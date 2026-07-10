import { Link } from "react-router";

export default function EmptyState() {
  return (
    <s-section>
      <s-stack direction="block" gap="base" align="center">
        <s-heading>No circles yet</s-heading>

        <s-text tone="subdued">
          Create your first circular button to display on your storefront.
        </s-text>

        <Link to="/app/circles/new">
          <s-button variant="primary">
            Add Circle
          </s-button>
        </Link>
      </s-stack>
    </s-section>
  );
}