/*
  Warnings:

  - You are about to drop the column `product_id` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `attribute_value_id` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "product_id",
ADD COLUMN     "attribute_value_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_attribute_value_id_fkey" FOREIGN KEY ("attribute_value_id") REFERENCES "variants_attributes_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;
