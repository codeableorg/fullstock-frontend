/*
  Warnings:

  - A unique constraint covering the columns `[cart_id,product_id,category_variant_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "cart_items_cart_id_product_id_key";

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "category_variant_id" INTEGER;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "has_variants" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "category_variant_id" INTEGER,
ADD COLUMN     "variant_info" TEXT;

-- CreateTable
CREATE TABLE "category_variants" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price_modifier" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_variants_category_id_value_key" ON "category_variants"("category_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_product_id_category_variant_id_key" ON "cart_items"("cart_id", "product_id", "category_variant_id");

-- AddForeignKey
ALTER TABLE "category_variants" ADD CONSTRAINT "category_variants_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_category_variant_id_fkey" FOREIGN KEY ("category_variant_id") REFERENCES "category_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_category_variant_id_fkey" FOREIGN KEY ("category_variant_id") REFERENCES "category_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
