"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormState, useFormStatus } from "react-dom";
import { addDiscountCode } from "../../_actions/discountCodes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function DiscountCodeForm({
  products,
}: {
  products: { name: string; id: string }[];
}) {
  const [error, action] = useFormState(addDiscountCode, {});
  const [isForAllProducts, setIsForAllProducts] = useState(true);

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input type="text" id="code" name="code" required />
        {error.code && <div className="text-destructive">{error.code}</div>}
      </div>
      <div className="space y-2 gap-8 flex items-baseline">
        <div className="space-y-2">
          <Label htmlFor="isFixed">Discount Type</Label>
          <RadioGroup id="isFixed" name="isFixed" defaultValue="false">
            <div className="flex gap-2 items-center">
              <RadioGroupItem id="percentage" value={"false"} />
              <Label htmlFor="percentage">Percentage</Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem id="fixed" value={"true"} />
              <Label htmlFor="fixed">Fixed</Label>
            </div>
          </RadioGroup>
          {error.isFixed && (
            <div className="text-destructive">{error.isFixed}</div>
          )}
        </div>
        <div className="space-y-2 flex-grow">
          <Label htmlFor="discountAmount">Discount Amount</Label>
          <Input
            type="number"
            id="discountAmount"
            name="discountAmount"
            required
          />
          {error.discountAmount && (
            <div className="text-destructive">{error.discountAmount}</div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="limit">Limit</Label>
        <Input type="number" id="limit" name="limit" />
        <div className="text-muted-foreground">
          Leave blank for infinite uses
        </div>
        {error.limit && <div className="text-destructive">{error.limit}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expiration</Label>
        <Input
          type="datetime-local"
          id="expiresAt"
          name="expiresAt"
          className="w-max"
          min={new Date().toJSON().split(":").slice(0, -1).join(":")}
        />
        <div className="text-muted-foreground">
          Leave blank for no expiration
        </div>
        {error.expiresAt && (
          <div className="text-destructive">{error.expiresAt}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label>Allowed Products</Label>
        {error.isForAllProducts && (
          <div className="text-destructive">{error.isForAllProducts}</div>
        )}
        {error.productsIds && (
          <div className="text-destructive">{error.productsIds}</div>
        )}
        <div className="flex gap-2 items-center">
          <Checkbox
            id="isForAllProducts"
            name="isForAllProducts"
            checked={isForAllProducts}
            onCheckedChange={(e) => setIsForAllProducts(e === true)}
          />
          <Label htmlFor="isForAllProducts">All Products</Label>
        </div>
        {products.map((product) => (
          <div key={product.id} className="flex gap-2 items-center">
            <Checkbox
              id={product.id}
              name="productsIds"
              disabled={isForAllProducts}
              value={product.id}
            />
            <Label htmlFor={product.id}>{product.name}</Label>
          </div>
        ))}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving" : "Save"}
    </Button>
  );
}
