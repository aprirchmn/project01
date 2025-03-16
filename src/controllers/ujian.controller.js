const prisma = require("../db");

const ujianController = {
  getAll: async (req, res) => {
    try {
      const ujians = await prisma.ujian.findMany({
        include: {
          soal_essays: true,
          soal_multiples: true,
        },
      });
      res.json(ujians);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const ujianId = parseInt(req.params.id);
      const ujian = await prisma.ujian.findUnique({
        where: { id_ujian: ujianId },
        include: {
          soal_essays: true,
          soal_multiples: true,
        },
      });

      if (!ujian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      // Filter soal berdasarkan tipe ujian
      if (ujian.tipe_ujian === "MULTIPLE") {
        // Jika ujian tipe multiple choice, kita kosongkan soal essay
        ujian.soal_essays = [];
        // Jika konfigurasi acak aktif, acak urutan soal multiple
        if (ujian.acak_soal) {
          ujian.soal_multiples = ujian.soal_multiples.sort(
            () => Math.random() - 0.5,
          );
        }
      } else if (ujian.tipe_ujian === "ESSAY") {
        // Jika ujian tipe essay, kosongkan soal multiple choice
        ujian.soal_multiples = [];
        // Jika konfigurasi acak aktif, acak urutan soal essay
        if (ujian.acak_soal) {
          ujian.soal_essays = ujian.soal_essays.sort(() => Math.random() - 0.5);
        }
      }

      res.json(ujian);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newUjianData = req.body;
      const ujian = await prisma.ujian.create({
        data: {
          id_mata_pelajaran: newUjianData.id_mata_pelajaran,
          id_guru: newUjianData.id_guru,
          id_kelas: newUjianData.id_kelas,
          id_jenis_ujian: newUjianData.id_jenis_ujian,
          tanggal_ujian: newUjianData.tanggal_ujian,
          durasi_ujian: newUjianData.durasi_ujian,
          deskripsi_ujian: newUjianData.deskripsi_ujian,
          status_ujian: newUjianData.status_ujian,
          id_siswa: newUjianData.id_siswa,
          nama_ujian: newUjianData.nama_ujian,
          tipe_ujian: newUjianData.tipe_ujian,
          acak_soal: newUjianData.acak_soal,
          tampilkan_nilai: newUjianData.tampilkan_nilai,
          tampilkan_jawaban: newUjianData.tampilkan_jawaban,
          accessCamera: newUjianData.accessCamera,
        },
        include: {
          soal_essays: true,
          soal_multiples: true,
        },
      });

      res.status(201).json({
        data: ujian,
        message: "Berhasil menambahkan Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const ujianId = parseInt(req.params.id);
      const ujianData = req.body;

      if (
        !(
          ujianData.id_mata_pelajaran &&
          ujianData.id_guru &&
          ujianData.id_kelas &&
          ujianData.id_jenis_ujian &&
          ujianData.tanggal_ujian &&
          ujianData.durasi_ujian &&
          ujianData.deskripsi_ujian &&
          ujianData.status_ujian &&
          ujianData.id_siswa &&
          ujianData.nama_ujian &&
          ujianData.tipe_ujian &&
          ujianData.acak_soal !== undefined &&
          ujianData.tampilkan_nilai !== undefined &&
          ujianData.tampilkan_jawaban !== undefined &&
          ujianData.accessCamera !== undefined
        )
      ) {
        return res
          .status(400)
          .json({ message: "Tidak boleh ada data yang kosong" });
      }

      // Check if ujian exists
      const existingUjian = await prisma.ujian.findUnique({
        where: { id_ujian: ujianId },
      });

      if (!existingUjian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      const ujian = await prisma.ujian.update({
        where: {
          id_ujian: ujianId,
        },
        data: {
          id_mata_pelajaran: ujianData.id_mata_pelajaran,
          id_guru: ujianData.id_guru,
          id_kelas: ujianData.id_kelas,
          id_jenis_ujian: ujianData.id_jenis_ujian,
          tanggal_ujian: ujianData.tanggal_ujian,
          durasi_ujian: ujianData.durasi_ujian,
          deskripsi_ujian: ujianData.deskripsi_ujian,
          status_ujian: ujianData.status_ujian,
          id_siswa: ujianData.id_siswa,
          nama_ujian: ujianData.nama_ujian,
          tipe_ujian: ujianData.tipe_ujian,
          acak_soal: ujianData.acak_soal,
          tampilkan_nilai: ujianData.tampilkan_nilai,
          tampilkan_jawaban: ujianData.tampilkan_jawaban,
          accessCamera: ujianData.accessCamera,
        },
        include: {
          soal_essays: true,
          soal_multiples: true,
        },
      });

      res.json({
        data: ujian,
        message: "Berhasil mengubah Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const ujianId = parseInt(req.params.id);
      const ujianData = req.body;

      // Check if ujian exists
      const existingUjian = await prisma.ujian.findUnique({
        where: { id_ujian: ujianId },
      });

      if (!existingUjian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      const ujian = await prisma.ujian.update({
        where: {
          id_ujian: ujianId,
        },
        data: ujianData,
        include: {
          soal_essays: true,
          soal_multiples: true,
        },
      });

      res.json({
        data: ujian,
        message: "Berhasil mengedit Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const ujianId = parseInt(req.params.id);

      // Check if ujian exists
      const existingUjian = await prisma.ujian.findUnique({
        where: { id_ujian: ujianId },
      });

      if (!existingUjian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      await prisma.ujian.delete({
        where: {
          id_ujian: ujianId,
        },
      });

      res.status(200).json({ message: "Ujian berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = ujianController;
