
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "react-router";

import { redirect,data, useActionData} from "react-router";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import CircleForm from "../components/circle/CircleForm";
import { uploadImageToShopify } from "../services/shopify-resource.server";
import DashboardHeader from "../components/dashboard/DashboardHeader";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {

    console.log("Action called =====================");

    const { session, admin } = await authenticate.admin(request);
    const formData = await request.formData();


    const title = String(formData.get("title") ?? "").trim();
    const linkType = String(formData.get("linkType") ?? "").trim();
    const linkValue = String(formData.get("linkValue") ?? "").trim();
    const status = formData.get("status") === "on";
    const image = formData.get("image");
    const file = image as File;

     console.log(formData.get("linkType"));

    const errors: {
      title?: string ;
      image?: string;
      linkType?: string;
      linkValue?: string;
    } = {};

  if (!title) {
    errors.title = "Title is required.";
  }

  if (!linkType) {
    errors.linkType = "Please select a link type.";
  }
  if (!linkType || linkType === "Select Link Type") {
    errors.linkType = "Please select a link type.";
  }
  if (!linkValue) {
    errors.linkValue = "Link is required.";
  }
  if (!(file instanceof File) || file.size === 0) {
    errors.image = "Please select an image.";
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

    
 const {
    imageUrl,
    imageFileId,
  } = await uploadImageToShopify(
    admin,
    file,
  );



  await prisma.circle.create({
      data: {
          shop: session.shop,
          title,
          image: imageUrl,// temporary
          imageFileId,
          linkType,
          linkValue,
          status,
      },
  });

  return redirect("/app");
};

export default function NewCirclePage() {
  const actionData = useActionData<typeof action>();
  return (
    <s-page heading="Add Circle">

      <DashboardHeader
        title="Add Circle"
        description="Create a new circle."
      />
      <CircleForm
          circle={null}
          errors={actionData?.errors}
        />
    </s-page>
  );
}