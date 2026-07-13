import prisma from "../db.server";
import { authenticate } from "../shopify.server";

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import CircleForm from "../components/circle/CircleForm";

import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { uploadImageToShopify, deleteShopifyFile,getProductById } from "../services/shopify-file.server";

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

  const product = await getProductById(
    admin,
    circle.linkValue,
  );

  console.log("product===",product);

  return {
    circle: {
      ...circle,
      productTitle: product?.title,
      productImage: product?.featuredImage?.url,
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