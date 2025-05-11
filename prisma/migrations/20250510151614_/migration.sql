/*
  Warnings:

  - You are about to drop the column `guruId_guru` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `siswaId_siswa` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `id_jenis_ujian` on the `soal_essay` table. All the data in the column will be lost.
  - You are about to drop the column `id_jenis_ujian` on the `soal_multiple` table. All the data in the column will be lost.
  - You are about to drop the column `accessCamera` on the `ujian` table. All the data in the column will be lost.
  - You are about to drop the column `id_jenis_ujian` on the `ujian` table. All the data in the column will be lost.
  - You are about to drop the column `tampilkan_nilai` on the `ujian` table. All the data in the column will be lost.
  - You are about to drop the `jenis_ujian` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `username` to the `guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `siswa` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status_ujian` on the `ujian` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusUjian" AS ENUM ('PUBLISHED', 'DRAFT');

-- DropForeignKey
ALTER TABLE "soal_essay" DROP CONSTRAINT "soal_essay_id_jenis_ujian_fkey";

-- DropForeignKey
ALTER TABLE "soal_multiple" DROP CONSTRAINT "soal_multiple_id_jenis_ujian_fkey";

-- DropForeignKey
ALTER TABLE "ujian" DROP CONSTRAINT "ujian_id_jenis_ujian_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "guruId_guru",
DROP COLUMN "siswaId_siswa";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "guru" ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "hasil_ujian" ADD COLUMN     "is_selesai" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "waktu_selesai" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "siswa" ADD COLUMN     "jurusan" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "soal_essay" DROP COLUMN "id_jenis_ujian",
ADD COLUMN     "gambar_soal" TEXT;

-- AlterTable
ALTER TABLE "soal_multiple" DROP COLUMN "id_jenis_ujian",
ADD COLUMN     "gambar_soal" TEXT;

-- AlterTable
ALTER TABLE "ujian" DROP COLUMN "accessCamera",
DROP COLUMN "id_jenis_ujian",
DROP COLUMN "tampilkan_nilai",
ALTER COLUMN "durasi_ujian" SET DATA TYPE TEXT,
DROP COLUMN "status_ujian",
ADD COLUMN     "status_ujian" "StatusUjian" NOT NULL;

-- DropTable
DROP TABLE "jenis_ujian";
