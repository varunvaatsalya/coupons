/*
  Warnings:

  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(60)`.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'owner');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "editPermission" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLogoutPending" BOOLEAN DEFAULT false,
ADD COLUMN     "lastLogoutByAdmin" TIMESTAMP(3),
ADD COLUMN     "password" VARCHAR(255) NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL,
ADD COLUMN     "uid" VARCHAR(255) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(60);
