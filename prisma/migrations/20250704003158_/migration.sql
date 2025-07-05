/*
  Warnings:

  - Added the required column `kepala` to the `profile_sekolah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile_sekolah` ADD COLUMN `kepala` VARCHAR(150) NOT NULL,
    ADD COLUMN `ttd_kepala` VARCHAR(255) NULL;
