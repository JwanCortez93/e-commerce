"use server";

import db from "@/db/db";
import { notFound, redirect } from "next/navigation";

import { z } from "zod";

const addSchema = z
  .object({
    code: z.string().min(1),
    discountAmount: z.coerce.number().int().min(1),
    isFixed: z.preprocess(
      (value) => (value === "true" ? true : value === "false" ? false : value),
      z.boolean()
    ),
    isForAllProducts: z.coerce.boolean(),
    productsIds: z.array(z.string()).optional(),
    expiresAt: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.date().min(new Date()).optional()
    ),
    limit: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().min(1).optional()
    ),
  })
  .refine((data) => data.discountAmount <= 100 || data.isFixed, {
    message: "Percentage discounts must be less than or equal to 100",
    path: ["discountAmount"],
  })
  .refine((data) => !data.isForAllProducts || data.productsIds == null, {
    message: 'Cannot select products when "all products" is selected',
    path: ["productsIds"],
  })
  .refine((data) => data.isForAllProducts || data.productsIds != null, {
    message: 'Must select products when "all products" is not selected',
    path: ["productsIds"],
  });

export const addDiscountCode = async (
  prevState: unknown,
  formData: FormData
) => {
  const productIds = formData.getAll("productsIds");

  const result = addSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    productsIds: productIds.length > 0 ? productIds : undefined,
  });

  if (result.success === false) return result.error.formErrors.fieldErrors;

  const data = result.data;

  await db.discountCode.create({
    data: {
      code: data.code,
      discountAmount: data.discountAmount,
      isFixed: data.isFixed,
      isForAllProducts: data.isForAllProducts,
      products:
        data.productsIds != null
          ? { connect: data.productsIds.map((id) => ({ id })) }
          : undefined,
      expiresAt: data.expiresAt,
      limit: data.limit,
    },
  });
  redirect("/admin/discount-codes");
};

export const toggleDiscountCodeActive = async (
  id: string,
  isActive: boolean
) => {
  await db.discountCode.update({ where: { id }, data: { isActive } });
};

export const deleteDiscountCode = async (id: string) => {
  const discountCode = await db.discountCode.delete({ where: { id } });
  if (discountCode == null) {
    return notFound();
  }
  return discountCode;
};
