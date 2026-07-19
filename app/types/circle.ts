export type Circle = {
  id: number;
  title: string;
  image: string;
  imageFileId: string;

  linkType: string;
  linkValue: string;

  // Product data (Shopify GraphQL)
  productTitle?: string;
  productImage?: string;

  collectionTitle?: string;
  collectionImage?: string;

  sortOrder: number;
  status: boolean;
};