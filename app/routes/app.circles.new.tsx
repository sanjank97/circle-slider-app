
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "react-router";

import { redirect } from "react-router";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import CircleForm from "../components/circle/CircleForm";
import { uploadImageToShopify } from "../services/shopify-file.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    console.log("Action called =====================");
    const { session, admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const title = (formData.get("title") as string).trim();
    const linkType = (formData.get("linkType") as string).trim();
    const linkValue = (formData.get("linkValue") as string).trim();
    const sortOrder = Number(formData.get("sortOrder") || 0);
    const status = formData.get("status") === "on";
    const image = formData.get("image");
    const file = image as File;
    
 const {
    imageUrl,
    imageFileId,
  } = await uploadImageToShopify(
    admin,
    file,
  );

   console.log("imageurl====",imageUrl);





    if (!title) {
        // return {
        // success: false,
        // error: "Title is required.",
        // };
          throw new Error("Title is required");
    }

    if (!linkType) {
        // return {
        // success: false,
        // error: "Please select a link type.",
        // };

          throw new Error("Please select a link type.");
    }

    if (!linkValue) {
        // return {
        // success: false,
        // error: "Link is required.",
        // };
         throw new Error("Link is required.");
    }


    await prisma.circle.create({
        data: {
            shop: session.shop,
            title,
            image: imageUrl,// temporary
            imageFileId,
            linkType,
            linkValue,
            sortOrder,
            status,
        },
    });

  return redirect("/app");
};

export default function NewCirclePage() {
  return (
    <s-page heading="Add Circle">
      <CircleForm />
    </s-page>
  );
}