/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `classes_weekDayId_fkey`;

-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `teams` DROP FOREIGN KEY `teams_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `week_days` DROP FOREIGN KEY `week_days_teamId_fkey`;

-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `accounts_userId_key` ON `accounts`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `sessions_userId_key` ON `sessions`(`userId`);
