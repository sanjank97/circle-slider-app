import { useState } from "react";

type CustomUrlFieldProps = {
  value?: string;
};

export default function CustomUrlField({
  value = "",
}: CustomUrlFieldProps) {
  const [url, setUrl] = useState(value);

  return (
    <s-section heading="Custom URL">
      <s-text-field
        label="Website URL"
        name="linkValue"
        placeholder="https://example.com"
        value={url}
        onInput={(event: any) =>
          setUrl(event.target.value)
        }
      />

      <s-text appearance="subdued">
        Example:
        https://example.com/page
      </s-text>
    </s-section>
  );
}