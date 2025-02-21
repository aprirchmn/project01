-- CreateTable
CREATE TABLE "guru" (
    "id_guru" SERIAL NOT NULL,
    "nama_guru" TEXT NOT NULL,
    "nip" INTEGER NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id_guru")
);

-- CreateTable
CREATE TABLE "hasil_ujian" (
    "id_hasil_ujian" SERIAL NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "id_ujian" INTEGER NOT NULL,
    "nilai_multiple" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nilai_essay" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "hasil_ujian_pkey" PRIMARY KEY ("id_hasil_ujian")
);

-- CreateTable
CREATE TABLE "jawaban" (
    "id_jawaban" SERIAL NOT NULL,
    "id_hasil_ujian" INTEGER NOT NULL,
    "id_ujian" INTEGER NOT NULL,
    "jawaban_murid" TEXT NOT NULL,
    "skor" DOUBLE PRECISION NOT NULL,
    "cosine" DOUBLE PRECISION,
    "id_soal_essay" INTEGER,
    "id_soal_multiple" INTEGER,
    "id_siswa" INTEGER NOT NULL,

    CONSTRAINT "jawaban_pkey" PRIMARY KEY ("id_jawaban")
);

-- CreateTable
CREATE TABLE "jenis_ujian" (
    "id_jenis_ujian" SERIAL NOT NULL,
    "jenis_ujian" TEXT NOT NULL,

    CONSTRAINT "jenis_ujian_pkey" PRIMARY KEY ("id_jenis_ujian")
);

-- CreateTable
CREATE TABLE "kelas" (
    "id_kelas" SERIAL NOT NULL,
    "nama_kelas" TEXT NOT NULL,
    "kode_kelas" TEXT NOT NULL,
    "id_guru" INTEGER NOT NULL,

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("id_kelas")
);

-- CreateTable
CREATE TABLE "mata_pelajaran" (
    "id_mata_pelajaran" SERIAL NOT NULL,
    "id_guru" INTEGER NOT NULL,
    "nama_mata_pelajaran" TEXT NOT NULL,

    CONSTRAINT "mata_pelajaran_pkey" PRIMARY KEY ("id_mata_pelajaran")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id_siswa" SERIAL NOT NULL,
    "nama_siswa" TEXT NOT NULL,
    "nis" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "id_kelas" INTEGER NOT NULL,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id_siswa")
);

-- CreateTable
CREATE TABLE "soal_essay" (
    "id_soal_essay" SERIAL NOT NULL,
    "id_mata_pelajaran" INTEGER NOT NULL,
    "id_jenis_ujian" INTEGER NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "kunci_jawaban" TEXT NOT NULL,
    "bobot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "soal_essay_pkey" PRIMARY KEY ("id_soal_essay")
);

-- CreateTable
CREATE TABLE "soal_multiple" (
    "id_soal_multiple" SERIAL NOT NULL,
    "id_mata_pelajaran" INTEGER NOT NULL,
    "id_jenis_ujian" INTEGER NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "pilihan_a" TEXT NOT NULL,
    "pilihan_b" TEXT NOT NULL,
    "pilihan_c" TEXT NOT NULL,
    "pilihan_d" TEXT NOT NULL,
    "pilihan_e" TEXT NOT NULL,
    "kunci_jawaban" TEXT NOT NULL,
    "bobot" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "soal_multiple_pkey" PRIMARY KEY ("id_soal_multiple")
);

-- CreateTable
CREATE TABLE "ujian" (
    "id_ujian" SERIAL NOT NULL,
    "id_mata_pelajaran" INTEGER NOT NULL,
    "id_guru" INTEGER NOT NULL,
    "id_kelas" INTEGER NOT NULL,
    "id_jenis_ujian" INTEGER NOT NULL,
    "tanggal_ujian" TIMESTAMP(3) NOT NULL,
    "durasi_ujian" INTEGER NOT NULL,
    "status_ujian" TEXT NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "nama_ujian" TEXT NOT NULL,

    CONSTRAINT "ujian_pkey" PRIMARY KEY ("id_ujian")
);

-- CreateIndex
CREATE UNIQUE INDEX "guru_nip_key" ON "guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "hasil_ujian_id_siswa_id_ujian_key" ON "hasil_ujian"("id_siswa", "id_ujian");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nis_key" ON "siswa"("nis");

-- AddForeignKey
ALTER TABLE "hasil_ujian" ADD CONSTRAINT "hasil_ujian_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hasil_ujian" ADD CONSTRAINT "hasil_ujian_id_ujian_fkey" FOREIGN KEY ("id_ujian") REFERENCES "ujian"("id_ujian") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban" ADD CONSTRAINT "jawaban_id_hasil_ujian_fkey" FOREIGN KEY ("id_hasil_ujian") REFERENCES "hasil_ujian"("id_hasil_ujian") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban" ADD CONSTRAINT "jawaban_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban" ADD CONSTRAINT "jawaban_id_soal_essay_fkey" FOREIGN KEY ("id_soal_essay") REFERENCES "soal_essay"("id_soal_essay") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban" ADD CONSTRAINT "jawaban_id_soal_multiple_fkey" FOREIGN KEY ("id_soal_multiple") REFERENCES "soal_multiple"("id_soal_multiple") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban" ADD CONSTRAINT "jawaban_id_ujian_fkey" FOREIGN KEY ("id_ujian") REFERENCES "ujian"("id_ujian") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "guru"("id_guru") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mata_pelajaran" ADD CONSTRAINT "mata_pelajaran_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "guru"("id_guru") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soal_essay" ADD CONSTRAINT "soal_essay_id_jenis_ujian_fkey" FOREIGN KEY ("id_jenis_ujian") REFERENCES "jenis_ujian"("id_jenis_ujian") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soal_essay" ADD CONSTRAINT "soal_essay_id_mata_pelajaran_fkey" FOREIGN KEY ("id_mata_pelajaran") REFERENCES "mata_pelajaran"("id_mata_pelajaran") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soal_multiple" ADD CONSTRAINT "soal_multiple_id_jenis_ujian_fkey" FOREIGN KEY ("id_jenis_ujian") REFERENCES "jenis_ujian"("id_jenis_ujian") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soal_multiple" ADD CONSTRAINT "soal_multiple_id_mata_pelajaran_fkey" FOREIGN KEY ("id_mata_pelajaran") REFERENCES "mata_pelajaran"("id_mata_pelajaran") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ujian" ADD CONSTRAINT "ujian_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "guru"("id_guru") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ujian" ADD CONSTRAINT "ujian_id_jenis_ujian_fkey" FOREIGN KEY ("id_jenis_ujian") REFERENCES "jenis_ujian"("id_jenis_ujian") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ujian" ADD CONSTRAINT "ujian_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ujian" ADD CONSTRAINT "ujian_id_mata_pelajaran_fkey" FOREIGN KEY ("id_mata_pelajaran") REFERENCES "mata_pelajaran"("id_mata_pelajaran") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ujian" ADD CONSTRAINT "ujian_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;
