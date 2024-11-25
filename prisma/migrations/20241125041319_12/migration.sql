/*
  Warnings:

  - You are about to drop the column `key` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Settings` table. All the data in the column will be lost.
  - Added the required column `adminEmail` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminMailPass` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminPhone` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appLogoDashboard` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appLogoLogin` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appName` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favicon` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guideLink` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Settings_key_key";

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "key",
DROP COLUMN "value",
ADD COLUMN     "adminEmail" TEXT NOT NULL,
ADD COLUMN     "adminMailPass" TEXT NOT NULL,
ADD COLUMN     "adminPhone" TEXT NOT NULL,
ADD COLUMN     "appLogoDashboard" TEXT NOT NULL,
ADD COLUMN     "appLogoLogin" TEXT NOT NULL,
ADD COLUMN     "appName" TEXT NOT NULL,
ADD COLUMN     "favicon" TEXT NOT NULL,
ADD COLUMN     "guideLink" TEXT NOT NULL;
