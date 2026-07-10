import { Form } from "react-router";
import type { Circle } from "../../types/circle";
import CircleImageUpload from "./CircleImageUpload";
type CircleFormProps = {
  circle?: Circle
};

export default function CircleForm({
  circle,
}: CircleFormProps) {
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
            value={circle?.linkType ?? ""}
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
          value={circle?.linkValue ?? ""}
        />

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