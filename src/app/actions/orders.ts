"use server";

import db from "@/db/db";

export const doesUserOrderExists = async (email: string, productId: string) => {
  return (
    (await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  );
};
