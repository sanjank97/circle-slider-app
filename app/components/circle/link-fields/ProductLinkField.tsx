import { useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";


type SelectedProduct = {
  id: string;
  title: string;
  image?: string;
};

type ProductLinkFieldProps = {
  value?: string;
  productTitle?: string;
  productImage?: string;
};

export default function ProductLinkField({
  value,
  productTitle,
  productImage,
}: ProductLinkFieldProps) {

const shopify = useAppBridge();
const [selectedProduct, setSelectedProduct] =
  useState<SelectedProduct | null>(
    value
      ? {
          id: value,
          title: productTitle ?? "",
          image: productImage,
        }
      : null,
  );

 async function openProductPicker() {
  
    try {
        const selection = await shopify.resourcePicker({
            type: "product",
            multiple: false,
            action: "select",
        });

        if (!selection || selection.length === 0) {
            return;
        }

       const product = selection[0];

       setSelectedProduct({
            id: product.id,
            title: product.title,
            image: product.images?.[0]?.originalSrc,
        });

    } catch (error) {
        console.error("Picker Error:", error);
    }

  
  }

    return (
    <s-section heading="Product">
        {selectedProduct ? (
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
            {selectedProduct.image && (
                <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #e1e3e5",
                }}
                />
            )}

            <div style={{ flex: 1 }}>
                <s-text font-weight="bold">
                {selectedProduct.title}
                </s-text>

                <div style={{ marginTop: "10px" }}>
                <s-button
                    variant="secondary"
                    onClick={openProductPicker}
                >
                    Change Product
                </s-button>
                 <input
                    type="hidden"
                    name="linkValue"
                    value={selectedProduct?.id ?? ""}
                 />
                </div>
            </div>
            </div>
        </s-box>
        ) : (
        <s-button
            variant="secondary"
            onClick={openProductPicker}
        >
            Select Product
        </s-button>
        )}
    </s-section>
    );
}