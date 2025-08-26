/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productId,productVariantId,stickersVariantId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "cart_items_cartId_productId_productVariantId_key";

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "stickersVariantId" INTEGER;

-- CreateTable
CREATE TABLE "stickersVariant" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "measure" TEXT NOT NULL,

    CONSTRAINT "stickersVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_productVariantId_stickersVarian_key" ON "cart_items"("cartId", "productId", "productVariantId", "stickersVariantId");

-- AddForeignKey
ALTER TABLE "stickersVariant" ADD CONSTRAINT "stickersVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_stickersVariantId_fkey" FOREIGN KEY ("stickersVariantId") REFERENCES "stickersVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
