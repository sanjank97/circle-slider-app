import { Form, Link } from "react-router";

import type { Circle } from "../../types/circle";

type CircleRowProps = {
  circle: Circle;
};

export default function CircleRow({
  circle,
}: CircleRowProps) {
  console.log("circle.imageFileId", circle.imageFileId);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 2fr 1fr 2fr 120px 180px",
        gap: "16px",
        padding: "16px",
        alignItems: "center",
        borderBottom: "1px solid #e1e3e5",
      }}
    >
      {/* Image */}

      <div>
        {circle.image && (

        <img
            src={circle.image}
            
            alt={circle.title}
            width={50}
            height={50}
            style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #ddd",
            }}
        />
        )}
      </div>

      {/* Title */}

      <s-text font-weight="bold">
        {circle.title}
      </s-text>

      {/* Link Type */}

      <s-text tone="subdued">
        {circle.linkType}
      </s-text>

      {/* Link */}

      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <s-text tone="subdued">
          {circle.linkValue}
        </s-text>
      </div>

      {/* Status */}

      <s-badge tone={circle.status ? "success" : "critical"}>
        {circle.status ? "Active" : "Inactive"}
      </s-badge>

      {/* Actions */}

      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <Link to={`/app/circles/${circle.id}/edit`}>
          <s-button>Edit</s-button>
        </Link>

        <Form
          method="post"
          action={`/app/circles/${circle.id}/delete`}
        >
          <s-button
            type="submit"
            tone="critical"
          >
            Delete
          </s-button>
        </Form>
      </div>
    </div>
  );
}