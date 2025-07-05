-- CreateTable
CREATE TABLE `profile_sekolah` (
    `id_profile_sekolah` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(150) NOT NULL,
    `npsn` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `akreditasi` ENUM('A', 'B', 'C', 'D') NOT NULL,
    `jenjang_pendidikan` ENUM('MA', 'MTS', 'MI') NOT NULL,
    `status_pendidikan` ENUM('Swasta', 'Negeri') NOT NULL,
    `logo` VARCHAR(255) NULL,

    PRIMARY KEY (`id_profile_sekolah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tahun_akademik` (
    `id_tahun_akademik` INTEGER NOT NULL AUTO_INCREMENT,
    `id_profile_sekolah` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `status` ENUM('Aktif', 'Tidak_Aktif') NOT NULL,

    PRIMARY KEY (`id_tahun_akademik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengguna` (
    `id_pengguna` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `jenis_kelamin` ENUM('Laki_Laki', 'Perempuan') NOT NULL,
    `tanggal_lahir` DATE NOT NULL,
    `alamat` TEXT NOT NULL,
    `no_hp` VARCHAR(20) NOT NULL,
    `foto` VARCHAR(255) NULL,

    PRIMARY KEY (`id_pengguna`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hak_akses` (
    `id_hak_akses` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_hak_akses`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hak_akses_pengguna` (
    `id_hak_akses_pengguna` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pengguna` INTEGER NOT NULL,
    `id_hak_akses` INTEGER NOT NULL,

    PRIMARY KEY (`id_hak_akses_pengguna`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indikator` (
    `id_indikator` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(10) NOT NULL,
    `keterangan` TEXT NOT NULL,

    PRIMARY KEY (`id_indikator`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bukti_fisik` (
    `id_bukti_fisik` INTEGER NOT NULL AUTO_INCREMENT,
    `id_indikator` INTEGER NOT NULL,
    `kode` VARCHAR(10) NOT NULL,
    `keterangan` TEXT NOT NULL,
    `required` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id_bukti_fisik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `input_bukti_fisik` (
    `id_input_bukti_fisik` INTEGER NOT NULL AUTO_INCREMENT,
    `id_operator` INTEGER NOT NULL,
    `id_bukti_fisik` INTEGER NOT NULL,
    `id_tahun_akademik` INTEGER NOT NULL,
    `status` ENUM('Belum_dikerjakan', 'Menunggu_validasi', 'Diterima', 'Ditolak') NOT NULL,
    `kunci` BOOLEAN NOT NULL DEFAULT false,
    `tanggal_input` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_input_bukti_fisik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jawaban_bukti_fisik` (
    `id_jawaban` INTEGER NOT NULL AUTO_INCREMENT,
    `id_input_bukti_fisik` INTEGER NOT NULL,

    PRIMARY KEY (`id_jawaban`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_jawaban` (
    `id_detail_jawaban` INTEGER NOT NULL AUTO_INCREMENT,
    `id_jawaban` INTEGER NOT NULL,
    `atribut` VARCHAR(100) NOT NULL,
    `nilai` TEXT NOT NULL,

    PRIMARY KEY (`id_detail_jawaban`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tahun_akademik` ADD CONSTRAINT `tahun_akademik_id_profile_sekolah_fkey` FOREIGN KEY (`id_profile_sekolah`) REFERENCES `profile_sekolah`(`id_profile_sekolah`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hak_akses_pengguna` ADD CONSTRAINT `hak_akses_pengguna_id_pengguna_fkey` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hak_akses_pengguna` ADD CONSTRAINT `hak_akses_pengguna_id_hak_akses_fkey` FOREIGN KEY (`id_hak_akses`) REFERENCES `hak_akses`(`id_hak_akses`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bukti_fisik` ADD CONSTRAINT `bukti_fisik_id_indikator_fkey` FOREIGN KEY (`id_indikator`) REFERENCES `indikator`(`id_indikator`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `input_bukti_fisik` ADD CONSTRAINT `input_bukti_fisik_id_operator_fkey` FOREIGN KEY (`id_operator`) REFERENCES `pengguna`(`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `input_bukti_fisik` ADD CONSTRAINT `input_bukti_fisik_id_bukti_fisik_fkey` FOREIGN KEY (`id_bukti_fisik`) REFERENCES `bukti_fisik`(`id_bukti_fisik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `input_bukti_fisik` ADD CONSTRAINT `input_bukti_fisik_id_tahun_akademik_fkey` FOREIGN KEY (`id_tahun_akademik`) REFERENCES `tahun_akademik`(`id_tahun_akademik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jawaban_bukti_fisik` ADD CONSTRAINT `jawaban_bukti_fisik_id_input_bukti_fisik_fkey` FOREIGN KEY (`id_input_bukti_fisik`) REFERENCES `input_bukti_fisik`(`id_input_bukti_fisik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_jawaban` ADD CONSTRAINT `detail_jawaban_id_jawaban_fkey` FOREIGN KEY (`id_jawaban`) REFERENCES `jawaban_bukti_fisik`(`id_jawaban`) ON DELETE RESTRICT ON UPDATE CASCADE;
