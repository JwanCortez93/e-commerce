/*
  Warnings:

  - You are about to drop the column `isForallProducts` on the `DiscountCode` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiscountCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "discountAmount" INTEGER NOT NULL,
    "isFixed" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isForAllProducts" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "limit" INTEGER,
    "expiresAt" DATETIME
);
INSERT INTO "new_DiscountCode" ("code", "createdAt", "discountAmount", "expiresAt", "id", "isActive", "isFixed", "limit", "uses") SELECT "code", "createdAt", "discountAmount", "expiresAt", "id", "isActive", "isFixed", "limit", "uses" FROM "DiscountCode";
DROP TABLE "DiscountCode";
ALTER TABLE "new_DiscountCode" RENAME TO "DiscountCode";
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
