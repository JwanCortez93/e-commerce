import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./components/OrderInformation";

type PurchaseReceiptEmailProps = {
  product: { name: string; imagePath: string; description: string };
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Product name",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi fugit exercitationem at dolores porro doloremque aut aperiam, eum debitis perspiciatis tempore optio sint doloribus iure quae, odio, maiores laborum quasi.",
    imagePath:
      "/products/dffb9517-504a-4346-9c8a-e1e3794ce55d-WhatsApp Image 2024-05-30 at 13.56.48.jpeg",
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 10000,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
