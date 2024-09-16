/*
  Warnings:

  - Added the required column `public_path` to the `Evidence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "public_path" TEXT NOT NULL;
