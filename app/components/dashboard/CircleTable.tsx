import CircleRow from "./CircleRow";

import type { Circle } from "../../types/circle";

type CircleTableProps = {
  circles: Circle[];
};

export default function CircleTable({
  circles,
}: CircleTableProps) {
  return (
    <s-box
      borderWidth="base"
      borderRadius="base"
    >
      {/* Header */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 2fr 1fr 2fr 120px 180px",
          gap: "16px",
          padding: "16px",
          fontWeight: "600",
          borderBottom: "1px solid #e1e3e5",
          alignItems: "center",
        }}
      >
        <span>Image</span>
        <span>Title</span>
        <span>Link Type</span>
        <span>Link</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {/* Rows */}

      {circles.map((circle) => (
        <CircleRow
          key={circle.id}
          circle={circle}
        />
      ))}
    </s-box>
  );
}