-- CreateTable
CREATE TABLE `week_days` (
    `id` VARCHAR(191) NOT NULL,
    `weekDay` INTEGER NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `week_days_weekDay_teamId_key`(`weekDay`, `teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `id` VARCHAR(191) NOT NULL,
    `hour` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `weekDayId` VARCHAR(191) NOT NULL,
    `season` ENUM('MORNING', 'AFTERNOON', 'NOCTURNAL') NOT NULL,

    UNIQUE INDEX `classes_hour_weekDayId_key`(`hour`, `weekDayId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `week_days` ADD CONSTRAINT `week_days_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_weekDayId_fkey` FOREIGN KEY (`weekDayId`) REFERENCES `week_days`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
