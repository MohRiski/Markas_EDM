-- CreateTable
CREATE TABLE `penugasan_operator` (
    `id_penugasan_operator` INTEGER NOT NULL AUTO_INCREMENT,
    `id_hak_akses` INTEGER NOT NULL,
    `id_bukti_fisik` INTEGER NOT NULL,

    PRIMARY KEY (`id_penugasan_operator`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `penugasan_operator` ADD CONSTRAINT `penugasan_operator_id_hak_akses_fkey` FOREIGN KEY (`id_hak_akses`) REFERENCES `hak_akses`(`id_hak_akses`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penugasan_operator` ADD CONSTRAINT `penugasan_operator_id_bukti_fisik_fkey` FOREIGN KEY (`id_bukti_fisik`) REFERENCES `bukti_fisik`(`id_bukti_fisik`) ON DELETE RESTRICT ON UPDATE CASCADE;
