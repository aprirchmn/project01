const prisma = require("../db");

const hasilujianController = {
  getAll: async (req, res) => {
    try {
      const hasilujians = await prisma.hasil_ujian.findMany();
      res.json(hasilujians);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const hasilujianId = parseInt(req.params.id);
      const hasilujian = await prisma.hasil_ujian.findUnique({
        where: { id_hasil_ujian: hasilujianId },
      });

      if (!hasilujian) {
        return res.status(404).json({ message: "Hasil Ujian tidak ditemukan" });
      }
      res.json(hasilujian);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newHasilujianData = req.body;
      const hasilujian = await prisma.hasil_ujian.create({
        data: {
          id_siswa: newHasilujianData.id_siswa,
          id_ujian: newHasilujianData.id_ujian,
          nilai_multiple: newHasilujianData.nilai_multiple || 0,
          nilai_essay: newHasilujianData.nilai_essay || 0,
        },
      });

      res.status(201).json({
        data: hasilujian,
        message: "Berhasil menambahkan Hasil Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const hasilujianId = parseInt(req.params.id);
      const hasilujianData = req.body;

      if (!(hasilujianData.id_siswa && hasilujianData.id_ujian)) {
        return res
          .status(400)
          .json({ message: "Tidak boleh ada data yang kosong" });
      }

      const existingHasilujian = await prisma.hasil_ujian.findUnique({
        where: { id_hasil_ujian: hasilujianId },
      });

      if (!existingHasilujian) {
        throw Error("Hasil Ujian tidak ditemukan");
      }

      const hasilujian = await prisma.hasil_ujian.update({
        where: {
          id_hasil_ujian: hasilujianId,
        },
        data: {
          id_ujian: hasilujianData.id_ujian,
          id_siswa: hasilujianData.id_siswa,
          nilai_multiple: hasilujianData.nilai_multiple,
          nilai_essay: hasilujianData.nilai_essay,
        },
      });

      res.json({
        data: hasilujian,
        message: "Berhasil mengubah Hasil Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const hasilujianId = parseInt(req.params.id);
      const hasilujianData = req.body;

      const existingHasilujian = await prisma.hasil_ujian.findUnique({
        where: { id_hasil_ujian: hasilujianId },
      });

      if (!existingHasilujian) {
        throw Error("Hasil Ujian tidak ditemukan");
      }

      const hasilujian = await prisma.hasil_ujian.update({
        where: {
          id_hasil_ujian: hasilujianId,
        },
        data: {
          ...(hasilujianData.id_ujian && { id_ujian: hasilujianData.id_ujian }),
          ...(hasilujianData.id_siswa && { id_siswa: hasilujianData.id_siswa }),
          ...(hasilujianData.nilai_multiple !== undefined && {
            nilai_multiple: hasilujianData.nilai_multiple,
          }),
          ...(hasilujianData.nilai_essay !== undefined && {
            nilai_essay: hasilujianData.nilai_essay,
          }),
        },
      });

      res.json({
        data: hasilujian,
        message: "Berhasil mengedit Hasil Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const hasilujianId = parseInt(req.params.id);

      const existingHasilujian = await prisma.hasil_ujian.findUnique({
        where: { id_hasil_ujian: hasilujianId },
      });

      if (!existingHasilujian) {
        throw Error("Hasil Ujian tidak ditemukan");
      }

      await prisma.hasil_ujian.delete({
        where: { id_hasil_ujian: hasilujianId },
      });

      res.status(200).json({ message: "Hasil Ujian berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  getHasilUjian: async (req, res) => {
    try {
      const hasil = await prisma.hasil_ujian.findUnique({
        where: { id_hasil_ujian: parseInt(req.params.id) },
        include: {
          siswa: true,
          ujian: true,
        },
      });

      if (!hasil)
        return res.status(404).json({ message: "Hasil tidak ditemukan" });

      res.json(hasil);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  reviewJawaban: async (req, res) => {
    try {
      const { idUjian, idSiswa } = req.params;

      const ujian = await prisma.ujian.findUnique({
        where: {
          id_ujian: parseInt(idUjian),
        },
        select: {
          tipe_ujian: true,
        },
      });

      if (!ujian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      let jawaban = [];

      if (ujian.tipe_ujian === "ESSAY") {
        jawaban = await prisma.jawaban.findMany({
          where: {
            id_ujian: parseInt(idUjian),
            id_siswa: parseInt(idSiswa),
          },
          include: {
            soal_essay: true,
          },
        });
      } else if (ujian.tipe_ujian === "MULTIPLE") {
        jawaban = await prisma.jawaban.findMany({
          where: {
            id_ujian: parseInt(idUjian),
            id_siswa: parseInt(idSiswa),
          },
          include: {
            soal_multiple: true,
          },
        });
      }

      res.json({
        message: "Berhasil mendapatkan data",
        success: 200,
        tipe_ujian: ujian.tipe_ujian,
        data: jawaban,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  detailJawabanSiswa: async (req, res) => {
    try {
      const { id_hasil_ujian } = req.params;
      const guruId = req.user.id;

      const hasilUjian = await prisma.hasil_ujian.findFirst({
        where: {
          id_hasil_ujian: parseInt(id_hasil_ujian),
        },
        include: {
          siswa: {
            select: {
              nama_siswa: true,
              nis: true,
              jurusan: true,
            },
          },
          ujian: {
            select: {
              id_guru: true,
              nama_ujian: true,
              tipe_ujian: true,
              mata_pelajaran: {
                select: {
                  nama_mata_pelajaran: true,
                },
              },
            },
          },
        },
      });

      const jawabanMultiple = await prisma.jawaban.findMany({
        where: {
          id_hasil_ujian: parseInt(id_hasil_ujian),
          id_soal_multiple: {
            not: null,
          },
        },
        include: {
          soal_multiple: true,
        },
        orderBy: {
          id_soal_multiple: "asc",
        },
      });

      const jawabanEssay = await prisma.jawaban.findMany({
        where: {
          id_hasil_ujian: parseInt(id_hasil_ujian),
          id_soal_essay: {
            not: null,
          },
        },
        include: {
          soal_essay: true,
        },
        orderBy: {
          id_soal_essay: "asc",
        },
      });

      const formattedJawabanMultiple = jawabanMultiple.map((jawaban) => ({
        id_jawaban: jawaban.id_jawaban,
        id_soal: jawaban.id_soal_multiple,
        pertanyaan: jawaban.soal_multiple.pertanyaan,
        pilihan_a: jawaban.soal_multiple.pilihan_a,
        pilihan_b: jawaban.soal_multiple.pilihan_b,
        pilihan_c: jawaban.soal_multiple.pilihan_c,
        pilihan_d: jawaban.soal_multiple.pilihan_d,
        pilihan_e: jawaban.soal_multiple.pilihan_e,
        kunci_jawaban: jawaban.soal_multiple.kunci_jawaban,
        jawaban_siswa: jawaban.jawaban_murid,
        skor: jawaban.skor,
        bobot: jawaban.soal_multiple.bobot,
        gambar_soal: jawaban.soal_multiple.gambar_soal,
      }));

      const formattedJawabanEssay = jawabanEssay.map((jawaban) => ({
        id_jawaban: jawaban.id_jawaban,
        id_soal: jawaban.id_soal_essay,
        pertanyaan: jawaban.soal_essay.pertanyaan,
        kunci_jawaban: jawaban.soal_essay.kunci_jawaban,
        jawaban_siswa: jawaban.jawaban_murid,
        skor: jawaban.skor,
        cosine_similarity: jawaban.cosine,
        bobot: jawaban.soal_essay.bobot,
        gambar_soal: jawaban.soal_essay.gambar_soal,
      }));

      return res.status(200).json({
        success: true,
        data: {
          info_hasil: {
            id_hasil_ujian: hasilUjian.id_hasil_ujian,
            siswa: hasilUjian.siswa,
            ujian: hasilUjian.ujian,
            nilai_multiple: hasilUjian.nilai_multiple,
            nilai_essay: hasilUjian.nilai_essay,
            nilai_total: hasilUjian.nilai_total,
            waktu_selesai: hasilUjian.waktu_selesai,
          },
          jawaban_multiple: formattedJawabanMultiple,
          jawaban_essay: formattedJawabanEssay,
        },
      });
    } catch (error) {
      console.error("Error mendapatkan detail jawaban:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  },
};

module.exports = hasilujianController;
