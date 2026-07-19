import prisma from "../db.server";

import { authenticate } from "../shopify.server";

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import CircleForm from "../components/circle/CircleForm";
import DashboardHeader from "../components/dashboard/DashboardHeader";

import {
  redirect,
  data,
  useActionData,
} from "react-router";
import type { ActionFunctionArgs } from "react-router";

import {uploadImageToShopify, deleteShopifyFile, getProductById, getCollectionById } from "../services/shopify-resource.server";

export const loader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  // Authenticate merchant
 const {session,admin} = await authenticate.admin(request);

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

  // console.log("Circle Link Value:", circle.linkValue);
  // console.log("Type:", typeof circle.linkValue);
  let product = null;
  let collection = null;

  if (circle.linkType === "product") {
    product = await getProductById(
      admin,
      circle.linkValue,
    );
  }

  if (circle.linkType === "collection") {
    collection =
      await getCollectionById(
        admin,
        circle.linkValue,
      );
  }

  console.log("product===",product);

  return {
    circle: {
      ...circle,
      imageFileId: circle?.imageFileId ?? "",

      productTitle: product?.title,
      productImage:
        product?.featuredImage?.url,

      collectionTitle:
        collection?.title,

      collectionImage:
        collection?.image?.url,
    },
  };

};


export const action = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const { session, admin} = await authenticate.admin(request);

  const id = Number(params.id);

  const formData = await request.formData();
  const image = formData.get("image");

  const title = String(formData.get("title") ?? "").trim();
  const linkType = String(formData.get("linkType") ?? "").trim();
  const linkValue = String(formData.get("linkValue") ?? "").trim();
  const status = formData.get("status") === "on";

  const errors: {
    title?: string;
    linkType?: string;
    linkValue?: string;
  } = {};


  if (!title) {
    errors.title = "Title is required.";
  }

  if (!linkType || linkType === "Select Link Type") {
    errors.linkType = "Please select a link type.";
  }

  if (linkType === "product" && !linkValue) {
    errors.linkValue = "Please select a product.";
  }

  if (linkType === "collection" && !linkValue) {
    errors.linkValue = "Please select a collection.";
  }

  if (linkType === "custom") {
    if (!linkValue) {
      errors.linkValue = "Please enter a URL.";
    } else {
      try {
        new URL(linkValue);
      } catch {
        errors.linkValue = "Please enter a valid URL.";
      }
    }
  }


  if (Object.keys(errors).length > 0) {
    return data(
      {
        errors,
      },
      {
        status: 400,
      },
    );
  }


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

  let imageUrl =existingCircle.image;

  let imageFileId = existingCircle.imageFileId;

if (image instanceof File && image.size > 0) {
  const oldImageFileId = existingCircle.imageFileId;
  const uploaded =
    await uploadImageToShopify(
      admin,
      image,
    );

  imageUrl = uploaded.imageUrl;
  imageFileId = uploaded.imageFileId;

    if (oldImageFileId) {
    await deleteShopifyFile(
      admin,
      oldImageFileId,
    );
  }
}

    await prisma.circle.update({
    where: {
        id: existingCircle.id,
    },
    data: {
        title,
        image: imageUrl,
        imageFileId,
        linkType,
        linkValue,
        status,
    },
    });

  return redirect("/app");
};



export default function EditCircle() {
  const { circle } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <s-page heading="Edit Circle">
      <DashboardHeader
        title="Edit Circle"
        description="Update an existing circle."
      />
      <CircleForm
        circle={circle}
        errors={actionData?.errors}
      />
    </s-page>
  );
}