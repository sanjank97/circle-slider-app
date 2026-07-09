import { Form } from "react-router";

export default function CircleForm() {
  return (
    <Form  method="post">

      <s-section heading="Circle Information">

        <s-text-field
          label="Title"
          name="title"
        />

        <br />

        <s-select
          label="Link Type"
          name="linkType"
          value=""
        >
          <s-option value="">Select Link Type</s-option>
          <s-option value="product">Product</s-option>
          <s-option value="collection">Collection</s-option>
          <s-option value="custom">Custom URL</s-option>
        </s-select>

        <br />

        <s-text-field
          label="Link"
          name="linkValue"
        />

        <br />

        <s-number-field
          label="Sort Order"
          name="sortOrder"
          value="0"
        />

        <br />

        <s-checkbox
          label="Active"
          name="status"
          checked
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