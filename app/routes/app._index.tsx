import prisma from "../db.server";
import { useEffect,useState,useRef} from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData, useNavigate,useLocation } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import CircleTable from "../components/dashboard/CircleTable";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import EmptyState from "../components/dashboard/EmptyState";

const PAGE_SIZE = 2;
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("q")?.trim() ?? "";
  const page = Number(
    url.searchParams.get("page") ?? "1",
  );

  const skip = (page - 1) * PAGE_SIZE;
  const { session } = await authenticate.admin(request);

  const where = {
    shop: session.shop,
    title: {
      contains: search,
    },
  };
  
 const circles = await prisma.circle.findMany({
    where,
    orderBy: {
      sortOrder: "asc",
    },
    skip,
    take: PAGE_SIZE,
  });


  const totalCircles = await prisma.circle.count({
    where,
  });

  const totalPages = Math.ceil(
    totalCircles / PAGE_SIZE
  );


  console.log("Current Shop:", session.shop);
  console.log("Circles:", circles);
  console.log("search", search);
  console.log('page', page);
  console.log('skip', skip);
   console.log('totalPages', totalPages);
  console.log('totalCircles', totalCircles);

  return {
    circles,
    search,
    page,
    totalPages,
    totalCircles,
  };
};



export default function Index() {

 const {
  circles,
  search,
  page,
  totalPages,
  totalCircles,
} = useLoaderData<typeof loader>();


  const startRecord =
  totalCircles === 0
    ? 0
    : (page - 1) * PAGE_SIZE + 1;

  const endRecord = Math.min(
    page * PAGE_SIZE,
    totalCircles
  );
  const [searchValue, setSearchValue] = useState(search);
  const previousSearch = useRef(search);
  const navigate = useNavigate();

const handlePrevious = () => {
  if (page <= 1) return;

  const params = new URLSearchParams(location.search);
  params.set("page", String(page - 1));

    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleNext = () => {
    if (page >= totalPages) return;

    const params = new URLSearchParams(location.search);
    params.set("page", String(page + 1));

    navigate(`${location.pathname}?${params.toString()}`);
  };


  const location = useLocation();

  useEffect(() => {
    if (previousSearch.current === searchValue) {
      return;
    }
    const timeout = setTimeout(() => {
    const params = new URLSearchParams(location.search);

      if (searchValue.trim()) {
        params.set("q", searchValue.trim());
        params.set("page", "1");
      } else {
        params.delete("q");
        params.set("page", "1");
      }

     let newUrl = location.pathname;
      if (params.toString()) {
        newUrl += "?" + params.toString();
      } else {
        newUrl += "";
      }

      if (location.pathname + location.search !== newUrl) {
        previousSearch.current = searchValue;
        navigate(newUrl);
      }
    }, 300);

    return () => clearTimeout(timeout);

  }, [searchValue, navigate,location]);

  console.log({
  page,
  totalPages,
  totalCircles,
});
 
  return (
    
    <s-page>
        <DashboardHeader
          title="Circles"
          description="Manage your storefront circles."
          buttonLabel="Add Circle"
          buttonLink="/app/circles/new"
        />

        <s-section>
              <s-text-field
                label="Search"
                placeholder="Search circles..."
                value={searchValue}
               onInput={(event: any) => {
                    setSearchValue(event.target.value);
                  }}
                />
        </s-section>
        <s-section heading="Circle List">
          {circles.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <CircleTable circles={circles} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <s-button
                  disabled={page <= 1}
                  onClick={handlePrevious}
                >
                  Previous
                </s-button>

               <span>
                Showing {startRecord}–{endRecord} of {totalCircles} circles
              </span>

                <s-button
                  disabled={page >= totalPages}
                  onClick={handleNext}
                >
                  Next
                </s-button>
              </div>
            </>
          )}
        </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
