import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";
import { usableDiscountCodeWhere } from "@/lib/discountCodeHelpers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
  searchParams: { coupon },
}: {
  params: { id: string };
  searchParams: { coupon?: string };
}) {
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  const discountCode =
    coupon == null ? undefined : await getDiscountCode(coupon, product.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <CheckoutForm
      product={product}
      discountCode={discountCode || undefined}
      clientSecret={paymentIntent.client_secret}
    />
  );
}

const getDiscountCode = async (coupon: string, productId: string) => {
  return await db.discountCode.findUnique({
    where: { ...usableDiscountCodeWhere, code: coupon },
    select: { id: true, discountAmount: true, isFixed: true },
  });
};
