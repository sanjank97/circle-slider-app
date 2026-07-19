export async function uploadImageToShopify(
    admin: any,
    file: File,
  ) {

    // =====================================================
    // Step 1
    // Create Staged Upload
    // =====================================================

    const stagedUploadResponse = await admin.graphql(
      `#graphql
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters {
              name
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
      `,
      {
        variables: {
          input: [
            {
              filename: file.name,
              mimeType: file.type,
              fileSize: String(file.size),
              resource: "IMAGE",
              httpMethod: "POST",
            },
          ],
        },
      },
    );

    const stagedUploadJson =
      await stagedUploadResponse.json();

    const stagedTarget =
      stagedUploadJson.data.stagedUploadsCreate.stagedTargets[0];

    // =====================================================
    // Step 2
    // Upload Binary File
    // =====================================================

    const uploadFormData = new FormData();

    for (const parameter of stagedTarget.parameters) {
      uploadFormData.append(
        parameter.name,
        parameter.value,
      );
    }

    uploadFormData.append(
      "file",
      file,
      file.name,
    );

    const uploadResponse = await fetch(
      stagedTarget.url,
      {
        method: "POST",
        body: uploadFormData,
      },
    );

    if (!uploadResponse.ok) {
      throw new Error(
        "Failed to upload image to Shopify storage.",
      );
    }

    // =====================================================
    // Step 3
    // Create Shopify File
    // =====================================================

    const fileCreateResponse = await admin.graphql(
      `#graphql
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            id

            ... on MediaImage {
              image {
                url
              }
            }
          }

          userErrors {
            field
            message
          }
        }
      }
      `,
      {
        variables: {
          files: [
            {
              originalSource: stagedTarget.resourceUrl,
              contentType: "IMAGE",
            },
          ],
        },
      },
    );

    const fileCreateJson =await fileCreateResponse.json();

    const imageFileId =
      fileCreateJson.data.fileCreate.files[0].id;

    const imageUrl =
      await waitForImageReady(
        admin,
        imageFileId,
      );

    return {
      imageUrl,
      imageFileId,
    };
}

/* =======================================================
   Delete Shopify File
======================================================= */

export async function deleteShopifyFile(
  admin: any,
  fileId: string,
) {
  const response = await admin.graphql(
    `#graphql
    mutation fileDelete($fileIds: [ID!]!) {
      fileDelete(fileIds: $fileIds) {
        deletedFileIds

        userErrors {
          field
          message
        }
      }
    }
    `,
    {
      variables: {
        fileIds: [fileId],
      },
    },
  );

  const json = await response.json();
  console.log(
    "Delete Shopify File:",
    json,
  );

  return json;
}

/* =======================================================
   Wait Until Shopify Generates CDN URL
======================================================= */

async function waitForImageReady(
  admin: any,
  imageFileId: string,
) {
  for (let i = 0; i < 10; i++) {
    const response = await admin.graphql(
      `#graphql
      query getMedia($id: ID!) {
        node(id: $id) {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      `,
      {
        variables: {
          id: imageFileId,
        },
      },
    );

    const json = await response.json();

    const imageUrl =
      json.data.node?.image?.url;

    if (imageUrl) {
      return imageUrl;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 1000),
    );
  }

  throw new Error(
    "Image processing timeout."
  );
}


export async function getProductById(
  admin: any,
  productId: string,
) {
  const response = await admin.graphql(
    `#graphql
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title

        featuredImage {
          url
        }
      }
    }
    `,
    {
      variables: {
        id: productId,
      },
    },
  );

  const json = await response.json();

  return json.data.product;
}

export async function getCollectionById(
  admin: any,
  collectionId: string,
) {
  const response = await admin.graphql(
    `#graphql
    query getCollection($id: ID!) {
      collection(id: $id) {
        id
        title

        image {
          url
        }
      }
    }
    `,
    {
      variables: {
        id: collectionId,
      },
    },
  );

  const json = await response.json();

  return json.data.collection;
}