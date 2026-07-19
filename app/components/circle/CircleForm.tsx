import { Form } from "react-router";
import { useState } from "react";

import type { Circle } from "../../types/circle";
import type { SelectedProduct } from "../../types/product";

import CircleImageUpload from "./CircleImageUpload";
import ProductLinkField from "./link-fields/ProductLinkField";
import CollectionLinkField from "./link-fields/CollectionLinkField";
import CustomUrlField from "./link-fields/CustomUrlField";
import type { SelectedCollection } from "../../types/collection";


type ValidationErrors = {
  title?: string;
  image?: string;
  linkType?: string;
  linkValue?: string;
};

type CircleFormProps = {
  circle?: Circle|null;
  errors?: ValidationErrors;
};

export default function CircleForm({
  circle,
  errors,
}: CircleFormProps) {

  const [selectedLinkType, setSelectedLinkType] =
    useState(circle?.linkType ?? "");

  const [selectedProduct, setSelectedProduct] =
    useState<SelectedProduct | null>(
      circle?.linkValue
        ? {
            id: circle.linkValue,
            title: circle.productTitle ?? "",
            image: circle.productImage,
          }
        : null,
    );

    const [selectedCollection, setSelectedCollection] =
      useState<SelectedCollection | null>(
        circle?.linkType === "collection"
          ? {
              id: circle.linkValue,
              title: circle.collectionTitle ?? "",
              image: circle.collectionImage,
            }
          : null,
      );

  return (
    <Form
      method="post"
      encType="multipart/form-data"
    >
      <s-section heading="Circle Information">

        <s-text-field
          label="Title"
          name="title"
          value={circle?.title ?? ""}
        />
         {errors?.title && (
            <s-text appearance="critical">
              {errors.title}
            </s-text>
          )}

        <br />

        <CircleImageUpload
          image={circle?.image}
        />
        {errors?.image && (
            <s-text appearance="critical">
              {errors.image}
            </s-text>
          )}

        <br />

        <s-select
          label="Link Type"
          name="linkType"
          value={selectedLinkType}
          onInput={(event: any) =>
            setSelectedLinkType(
              event.target.value,
            )
          }
        >
          <s-option value="">
            Select Link Type
          </s-option>

          <s-option value="product">
            Product
          </s-option>

          <s-option value="collection">
            Collection
          </s-option>

          <s-option value="custom">
            Custom URL
          </s-option>
        </s-select>

        {errors?.linkType && (
          <s-text appearance="critical">
            {errors.linkType}
          </s-text>
        )}
        <br />

        {selectedLinkType === "product" && (
          <ProductLinkField
            selectedProduct={selectedProduct}
            onChange={setSelectedProduct}
          />
        )}

        {selectedLinkType === "collection" && (
          <CollectionLinkField
              selectedCollection={selectedCollection}
              onChange={setSelectedCollection}
            />
        )}

        {selectedLinkType === "custom" && (
          <CustomUrlField
            value={circle?.linkValue}
          />
        )}

        {errors?.linkValue && (
          <s-text appearance="critical">
            {errors.linkValue}
          </s-text>
        )}
        <br />

        <s-checkbox
          label="Active"
          name="status"
          checked={circle?.status ?? true}
        />

        <br />

        <s-button
          type="submit"
          variant="primary"
        >
          Save Circle
        </s-button>

      </s-section>
    </Form>
  );
}