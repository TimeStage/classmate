/*
  Warnings:

  - A unique constraint covering the columns `[courseName]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamName,courseId]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `courses_courseName_key` ON `courses`(`courseName`);

-- CreateIndex
CREATE UNIQUE INDEX `teams_teamName_courseId_key` ON `teams`(`teamName`, `courseId`);
