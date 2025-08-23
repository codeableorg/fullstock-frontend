/*
  Warnings:

  - Added the required column `final_price` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "final_price" DECIMAL(10,2) NOT NULL;
