import prisma from "../db.server";
import { authenticate } from "../shopify.server";

import { redirect } from "react-router";

import type { ActionFunctionArgs } from "react-router";

export const action = async ({
  request,
  params,
}: ActionFunctionArgs) => {

    const { session } = await authenticate.admin(request);
    const id = Number(params.id);

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

    await prisma.circle.delete({
        where: {
            id: existingCircle.id,
        },
    });

    return redirect("/app");


};

