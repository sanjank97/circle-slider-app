export default function CustomUrlField({
  value = "",
}: {
  value?: string;
}) {
  return (
    <s-text-field
      label="Custom URL"
      name="linkValue"
      value={value}
    />
  );
}