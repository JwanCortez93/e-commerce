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
import {
  CheckCircle2,
  Infinity,
  ListChecks,
  Minus,
  MoreVertical,
  XCircle,
} from "lucide-react";
import {
  formatDateTime,
  formatDiscountCode,
  formatNumber,
} from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import db from "@/db/db";
import { Prisma } from "@prisma/client";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "./_components/DiscountCodeActions";

const WHERE_EXPIRED: Prisma.DiscountCodeWhereInput = {
  OR: [
    { limit: { not: null, lte: db.discountCode.fields.uses } },
    { expiresAt: { not: null, lte: new Date() } },
  ],
};

const SELECT_FIELDS: Prisma.DiscountCodeSelect = {
  id: true,
  isForAllProducts: true,
  code: true,
  discountAmount: true,
  isFixed: true,
  expiresAt: true,
  limit: true,
  uses: true,
  isActive: true,
  products: { select: { name: true } },
  _count: { select: { orders: true } },
};

const getExpiredDiscountCodes = () => {
  return db.discountCode.findMany({
    where: WHERE_EXPIRED,
    select: SELECT_FIELDS,
    orderBy: { createdAt: "asc" },
  });
};

const getActiveDiscountCodes = () => {
  return db.discountCode.findMany({
    where: { NOT: WHERE_EXPIRED },
    select: SELECT_FIELDS,
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
      <DiscountCodesTable discountCodes={activeDiscountCodes} canDeactivate />
      <div className="mt-8">
        <PageHeader>Expired Coupons</PageHeader>
        <DiscountCodesTable discountCodes={expiredDiscountCodes} isInactive />
      </div>
    </>
  );
}

type DiscountCodesTableProps = {
  discountCodes: Awaited<ReturnType<typeof getActiveDiscountCodes>>;
  isInactive?: boolean;
  canDeactivate?: boolean;
};

const DiscountCodesTable = ({
  discountCodes,
  isInactive = false,
  canDeactivate = false,
}: DiscountCodesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Is Active</span>
          </TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Remaining Uses</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Products</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {discountCodes.map((discountCode) => (
          <TableRow key={discountCode.id}>
            <TableCell>
              {discountCode.isActive && !isInactive ? (
                <>
                  <span className="sr-only">Active</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className="sr-only">Inactive</span>
                  <XCircle className="stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell>{discountCode.code}</TableCell>
            <TableCell>{formatDiscountCode(discountCode)}</TableCell>
            <TableCell>
              {discountCode.expiresAt == null ? (
                <Minus />
              ) : (
                formatDateTime(discountCode.expiresAt)
              )}
            </TableCell>
            <TableCell>
              {discountCode.limit == null ? (
                <Infinity />
              ) : (
                formatNumber(discountCode.limit - discountCode.uses)
              )}
            </TableCell>
            <TableCell>{formatNumber(discountCode._count.orders)}</TableCell>
            <TableCell>
              {discountCode.isForAllProducts ? (
                <ListChecks />
              ) : (
                discountCode.products.map((product) => product.name).join(", ")
              )}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {canDeactivate && (
                    <>
                      <ActiveToggleDropdownItem
                        id={discountCode.id}
                        isActive={discountCode.isActive}
                      />
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DeleteDropdownItem
                    id={discountCode.id}
                    disabled={discountCode._count.orders > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
