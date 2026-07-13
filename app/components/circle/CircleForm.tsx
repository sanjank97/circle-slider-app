import { Form } from "react-router";
import { useState } from "react";
import type { Circle } from "../../types/circle";
import CircleImageUpload from "./CircleImageUpload";
import ProductLinkField from "./link-fields/ProductLinkField";
import CollectionLinkField from "./link-fields/CollectionLinkField";
import CustomUrlField from "./link-fields/CustomUrlField";
type CircleFormProps = {
  circle?: Circle
};

export default function CircleForm({
  circle,
}: CircleFormProps) {


 const [selectedLinkType, setSelectedLinkType] =
  useState(
    circle?.linkType ?? "",
  );

  console.log("selectedLinkType", selectedLinkType);

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
        <br />
        <CircleImageUpload
          image={circle?.image}
        />
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
          <s-option value="">Select Link Type</s-option>
          <s-option value="product">Product</s-option>
          <s-option value="collection">Collection</s-option>
          <s-option value="custom">Custom URL</s-option>
        </s-select>
  
     {selectedLinkType === "product" && (
        <ProductLinkField
          value={circle?.linkValue}
          productTitle={circle?.productTitle}
          productImage={circle?.productImage}
        />
      )}

      {selectedLinkType === "collection" && (
        <CollectionLinkField />
      )}

      {selectedLinkType === "custom" && (
        <CustomUrlField
          value={circle?.linkValue}
        />
      )}

        <br />

       <s-number-field
          label="Sort Order"
          name="sortOrder"
          value={String(circle?.sortOrder ?? 0)}
        />

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

    </Form >
  );
}