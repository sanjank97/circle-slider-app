type Circle = {
  id: number;
  title: string;
  linkType: string;
  status: boolean;
};

type CircleTableProps = {
  circles: Circle[];
};

export default function CircleTable({
  circles,
}: CircleTableProps) {
  if (circles.length === 0) {
    return (
      <s-section heading="Circle List">
        <s-paragraph>No circles found.</s-paragraph>
      </s-section>
    );
  }

  return (
    <s-section heading="Circle List">
      {circles.map((circle) => (
        <s-box
          key={circle.id}
          padding="base"
          borderWidth="base"
          borderRadius="base"
        >
          <s-stack direction="inline" gap="large">

            <s-stack direction="block">
              <s-text font-weight="bold">
                {circle.title}
              </s-text>

              <s-text tone="subdued">
                {circle.linkType}
              </s-text>
            </s-stack>

            <s-spacer />

            <s-badge tone={circle.status ? "success" : "critical"}>
              {circle.status ? "Active" : "Inactive"}
            </s-badge>

          </s-stack>
        </s-box>
      ))}
    </s-section>
  );
}