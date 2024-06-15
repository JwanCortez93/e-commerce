import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./components/OrderInformation";
import { Fragment } from "react";

type OrderHistoryEmailProps = {
  orders: {
    id: string;
    pricePaidInCents: number;
    createdAt: Date;
    downloadVerificationId: string;
    product: { name: string; imagePath: string; description: string };
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      pricePaidInCents: 10000,
      product: {
        name: "Product name",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi fugit exercitationem at dolores porro doloremque aut aperiam, eum debitis perspiciatis tempore optio sint doloribus iure quae, odio, maiores laborum quasi.",
        imagePath:
          "/products/dffb9517-504a-4346-9c8a-e1e3794ce55d-WhatsApp Image 2024-05-30 at 13.56.48.jpeg",
      },
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      pricePaidInCents: 5000,
      product: {
        name: "Product Name 2",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi fugit exercitationem at dolores porro doloremque aut aperiam, eum debitis perspiciatis tempore optio sint doloribus iure quae, odio, maiores laborum quasi.",
        imagePath:
          "/products/ee737060-8bf1-4bfd-969c-bbf313ac2b88-WhatsApp Image 2024-05-30 at 13.57.27 (1).jpeg",
      },
    },
  ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
