-- CreateEnum
CREATE TYPE "CategorySlug" AS ENUM ('polos', 'tazas', 'stickers');

-- AlterTable: Add temporary column
ALTER TABLE "categories" ADD COLUMN "slug_new" "CategorySlug";

-- Update data: Convert existing string values to enum
UPDATE "categories" SET "slug_new" = 
  CASE 
    WHEN "slug" = 'polos' THEN 'polos'::"CategorySlug"
    WHEN "slug" = 'tazas' THEN 'tazas'::"CategorySlug" 
    WHEN "slug" = 'stickers' THEN 'stickers'::"CategorySlug"
    ELSE 'polos'::"CategorySlug" -- default fallback
  END;

-- Make the new column NOT NULL
ALTER TABLE "categories" ALTER COLUMN "slug_new" SET NOT NULL;

-- Drop the old column
ALTER TABLE "categories" DROP COLUMN "slug";

-- Rename the new column
ALTER TABLE "categories" RENAME COLUMN "slug_new" TO "slug";

-- Add unique constraint
ALTER TABLE "categories" ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");