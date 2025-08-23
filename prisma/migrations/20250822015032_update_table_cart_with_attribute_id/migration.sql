/*
  Warnings:

  - You are about to drop the column `product_id` on the `cart_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cart_id,attribute_value_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attribute_value_id` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_product_id_fkey";

-- DropIndex
DROP INDEX "cart_items_cart_id_product_id_key";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "product_id",
ADD COLUMN     "attribute_value_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_attribute_value_id_key" ON "cart_items"("cart_id", "attribute_value_id");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_attribute_value_id_fkey" FOREIGN KEY ("attribute_value_id") REFERENCES "variants_attributes_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;
