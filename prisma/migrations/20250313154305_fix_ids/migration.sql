/*
  Warnings:

  - The required column `id` was added to the `SensorData` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "SensorData_device_id_key";

-- AlterTable
ALTER TABLE "SensorData" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id");
