import prisma from "../db.server";
import { authenticate } from "../shopify.server";

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import CircleForm from "../components/circle/CircleForm";

import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";

export const loader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  // Authenticate merchant
  const { session } = await authenticate.admin(request);

  // URL parameter
  const id = Number(params.id);

  // Fetch circle for current shop only
  const circle = await prisma.circle.findFirst({
    where: {
      id,
      shop: session.shop,
    },
  });

  // If record not found
  if (!circle) {
    throw new Response("Circle not found", {
      status: 404,
    });
  }

  return {
    circle,
  };
};


export const action = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const id = Number(params.id);

  const formData = await request.formData();

  const title = formData.get("title") as string;
  const linkType = formData.get("linkType") as string;
  const linkValue = formData.get("linkValue") as string;
  const sortOrder = Number(formData.get("sortOrder"));
  const status = formData.get("status") === "on";

    const existingCircle = await prisma.circle.findFirst({
        where: {
        id,
        shop: session.shop,
        },
    });


    if (!existingCircle) {
        throw new Response("Circle not found", {
            status: 404,
        });
    }

    await prisma.circle.update({
    where: {
        id: existingCircle.id,
    },
    data: {
        title,
        linkType,
        linkValue,
        sortOrder,
        status,
    },
    });

  return redirect("/app");
};



export default function EditCircle() {
  const { circle } = useLoaderData<typeof loader>();

    return (
    <s-page heading="Edit Circle">
        <CircleForm circle={circle} />
    </s-page>
    );
}