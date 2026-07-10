import { useEffect, useState } from "react";

type CircleImageUploadProps = {
  image?: string;
};

export default function CircleImageUpload({
  image,
}: CircleImageUploadProps) {
    
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (image) {
      setPreview(image);
    }
  }, [image]);


function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        setError("");

        // Only image
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");

            return;
        }

        // Max 2 MB
        if (file.size > 2 * 1024 * 1024) {
            setError("Image size must be less than 2 MB.");

            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);
   }

  return (
    <s-stack direction="block" gap="base">

      <label>
        Image
      </label>

      <input
        type="file"
        name ="image"
        accept="image/*"
        onChange={handleChange}
      />

      {error && (
        <s-text tone="critical">
            {error}
        </s-text>
       )}

      {preview && (
        <img
          src={preview}
          alt="Preview"
          width={120}
          height={120}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #ddd",
          }}
        />
      )}

    </s-stack>
  );
}