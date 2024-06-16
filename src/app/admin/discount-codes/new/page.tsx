import db from "@/db/db";
import PageHeader from "../../_components/PageHeader";
import DiscountCodeForm from "../_components/DiscountCodeForm";

export default async function NewDiscountCodePage() {
  const products = await db.product.findMany({
    select: { name: true, id: true },
    orderBy: { name: "asc" },
  });
  return (
    <>
      <PageHeader>Add Coupon</PageHeader>
      <DiscountCodeForm products={products} />
    </>
  );
}
