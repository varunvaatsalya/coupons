/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LoginStatus" AS ENUM ('success', 'failed');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'default_admin';

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleLogout" (
    "id" UUID NOT NULL,
    "role" "Role" NOT NULL,
    "lastLogoutAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleLogout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" UUID NOT NULL,
    "attemptedUserEmail" VARCHAR(255) NOT NULL,
    "role" "Role",
    "status" "LoginStatus" NOT NULL,
    "ipAddress" VARCHAR(255),
    "userAgent" VARCHAR(255),
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RoleLogout_role_key" ON "RoleLogout"("role");

-- CreateIndex
CREATE INDEX "LoginHistory_loginTime_idx" ON "LoginHistory"("loginTime");
