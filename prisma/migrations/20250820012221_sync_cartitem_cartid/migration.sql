/*
  Warnings:

  - You are about to drop the column `cart_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the `ProductVariants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cartId,productId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartId` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_product_id_fkey";

-- DropIndex
DROP INDEX "cart_items_cart_id_product_id_key";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "cart_id",
DROP COLUMN "product_id",
ADD COLUMN     "cartId" INTEGER NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "productVariantId" INTEGER;

-- DropTable
DROP TABLE "ProductVariants";

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_key" ON "cart_items"("cartId", "productId");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
