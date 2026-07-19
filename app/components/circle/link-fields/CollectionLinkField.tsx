import { useAppBridge } from "@shopify/app-bridge-react";
import type { SelectedCollection } from "../../../types/collection";

type CollectionLinkFieldProps = {
  selectedCollection: SelectedCollection | null;
  onChange: (
    collection: SelectedCollection | null,
  ) => void;
};

export default function CollectionLinkField({
  selectedCollection,
  onChange,
}: CollectionLinkFieldProps) {
  const shopify = useAppBridge();

  async function openCollectionPicker() {
    try {
      const selection =
        await shopify.resourcePicker({
          type: "collection",
          multiple: false,
          action: "select",
        });

      if (
        !selection ||
        selection.length === 0
      ) {
        return;
      }

      const collection = selection[0];

      onChange({
        id: collection.id,
        title: collection.title,
        image:
          collection.image?.originalSrc,
      });
    } catch (error) {
      console.error(
        "Collection Picker Error:",
        error,
      );
    }
  }

  function removeCollection() {
    onChange(null);
  }

  return (
    <s-section heading="Collection">
      {selectedCollection ? (
        <s-box
          borderWidth="base"
          borderRadius="base"
          padding="base"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {selectedCollection.image && (
              <img
                src={selectedCollection.image}
                alt={
                  selectedCollection.title
                }
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border:
                    "1px solid #e1e3e5",
                }}
              />
            )}

            <div style={{ flex: 1 }}>
              <s-text
                font-weight="bold"
              >
                {selectedCollection.title}
              </s-text>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <s-button
                  variant="secondary"
                  onClick={
                    openCollectionPicker
                  }
                >
                  Change Collection
                </s-button>

                <s-button
                  variant="critical"
                  onClick={
                    removeCollection
                  }
                >
                  Remove
                </s-button>
              </div>
            </div>
          </div>
        </s-box>
      ) : (
        <s-button
          variant="secondary"
          onClick={
            openCollectionPicker
          }
        >
          Select Collection
        </s-button>
      )}

      <input
        type="hidden"
        name="linkValue"
        value={
          selectedCollection?.id ?? ""
        }
      />
    </s-section>
  );
}