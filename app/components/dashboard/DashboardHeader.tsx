import { Link } from "react-router";

type DashboardHeaderProps = {
  title: string;
  description: string;
  buttonLabel?: string;
  buttonLink?: string;
};

export default function DashboardHeader({
  title,
  description,
  buttonLabel,
  buttonLink,
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

        {buttonLabel && buttonLink && (
            <Link to={buttonLink}>
              <s-button>{buttonLabel}</s-button>
            </Link>
          )}
      </div>
    </s-section>
  );
}