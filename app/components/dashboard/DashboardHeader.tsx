import { Link } from "react-router";

type DashboardHeaderProps = {
  title: string;
  description: string;
};

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <s-section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <s-heading>{title}</s-heading>

          <s-text tone="subdued">
            {description}
          </s-text>
        </div>

        <Link to="/app/circles/new">
          <s-button >Add Circle</s-button>
        </Link>
      </div>
    </s-section>
  );
}