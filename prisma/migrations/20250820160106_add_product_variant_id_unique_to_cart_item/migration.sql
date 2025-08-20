/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productId,productVariantId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "cart_items_cartId_productId_key";

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_productVariantId_key" ON "cart_items"("cartId", "productId", "productVariantId");
