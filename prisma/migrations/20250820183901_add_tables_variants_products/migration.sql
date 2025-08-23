/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "variants_attributes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "variants_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variants_attributes_values" (
    "id" SERIAL NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "variants_attributes_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "variants_attributes_name_key" ON "variants_attributes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "variants_attributes_values_attribute_id_product_id_value_key" ON "variants_attributes_values"("attribute_id", "product_id", "value");

-- AddForeignKey
ALTER TABLE "variants_attributes_values" ADD CONSTRAINT "variants_attributes_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "variants_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variants_attributes_values" ADD CONSTRAINT "variants_attributes_values_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
