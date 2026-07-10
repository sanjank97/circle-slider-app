export async function uploadImageToShopify(
  admin: any,
  file: File,
) {

    //step: 1 stagedUploadsCreate -> Temporary Upload URL
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

   const stagedUploadJson = await stagedUploadResponse.json();

  //Step:2 Upload binary file to Shopify -> resourceURL

  const stagedTarget =
    stagedUploadJson.data.stagedUploadsCreate.stagedTargets[0];

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


   //Step:3 fileCreate ->CDN URL

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



async function waitForImageReady(
  admin: any,
  mediaId: string,
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
          id: mediaId,
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

  throw new Error("Image processing timeout.");
}

const fileCreateJson = await fileCreateResponse.json();
const mediaId = fileCreateJson.data.fileCreate.files[0].id;
const imageUrl = await waitForImageReady(admin, mediaId);
return imageUrl;


}