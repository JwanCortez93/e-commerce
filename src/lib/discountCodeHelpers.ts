import db from "@/db/db";
import { Prisma } from "@prisma/client";

export const usableDiscountCodeWhere = (productId: string) => {
  return {
    isActive: true,
    AND: [
      {
        OR: [
          { isForAllProducts: true },
          { products: { some: { id: productId } } },
        ],
      },
      { OR: [{ limit: null }, { limit: { gt: db.discountCode.fields.uses } }] },
      { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    ],
  } satisfies Prisma.DiscountCodeWhereInput;
};

export const getDiscountedAmount = (
  discountCode: { discountAmount: number; isFixed: boolean },
  priceInCents: number
) => {
  if (discountCode.isFixed) {
    return Math.max(
      1,
      Math.ceil(
        priceInCents - (priceInCents * discountCode.discountAmount) / 100
      )
    );
  }
  return Math.max(
    1,
    Math.ceil(priceInCents - discountCode.discountAmount * 100)
  );
};
