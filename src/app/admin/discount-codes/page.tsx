import { Button } from "@/components/ui/button";
import PageHeader from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import db from "@/db/db";
import { Prisma } from "@prisma/client";

const WHERE_EXPIRED: Prisma.DiscountCodeWhereInput = {
  OR: [
    { limit: { not: null, lte: db.discountCode.fields.uses } },
    { expiresAt: { not: null, lte: new Date() } },
  ],
};

const getExpiredDiscountCodes = () => {
  return db.discountCode.findMany({
    where: WHERE_EXPIRED,
    // select: {},
    orderBy: { createdAt: "asc" },
  });
};

const getActiveDiscountCodes = () => {
  return db.discountCode.findMany({
    where: { NOT: WHERE_EXPIRED },
    // select: {},
    orderBy: { createdAt: "asc" },
  });
};

export default async function DiscountCodesPage() {
  const [expiredDiscountCodes, activeDiscountCodes] = await Promise.all([
    getExpiredDiscountCodes(),
    getActiveDiscountCodes(),
  ]);

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Coupons</PageHeader>
        <Button asChild>
          <Link href={"/admin/discount-codes/new"}>Add Coupon</Link>
        </Button>
      </div>
      <DiscountCodesTable discountCodes={activeDiscountCodes} />
      <div className="mt-8">
        <PageHeader>Expired Coupons</PageHeader>
        <DiscountCodesTable discountCodes={expiredDiscountCodes} />
      </div>
    </>
  );
}

const DiscountCodesTable = ({ discountCodes }: { discountCodes: any[] }) => {
  return null;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableForPurchase ? (
                <>
                  <span className="sr-only">Available</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className="sr-only">Unavailable</span>
                  <XCircle className="stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
            <TableCell>{formatNumber(product._count.orders)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <a download href={`/admin/products/${product.id}/download`}>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </Link>
                  {/* <ActiveToggleDropdownItem
                    id={product.id}
                    isAvailableForPurchase={product.isAvailableForPurchase}
                  /> */}
                  <DropdownMenuSeparator />
                  {/* <DeleteDropdownItem
                    id={product.id}
                    disabled={product._count.orders > 0}
                  /> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
