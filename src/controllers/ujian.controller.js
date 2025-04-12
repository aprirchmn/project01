const prisma = require("../db");

const ujianController = {
  getAll: async (req, res) => {
    try {
      const ujians = await prisma.ujian.findMany({
        include: {
          soal_essay: true,
          soal_multiple: true,
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
      const user = req.user;

      const ujian = await prisma.ujian.findUnique({
        where: { id_ujian: ujianId },
        include: {
          soal_essay: true,
          soal_multiple: true,
        },
      });

      if (!ujian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      if (user.role === "SISWA") {
        const soalMultiple = ujian.soal_multiple.map((soal) => ({
          id_soal_multiple: soal.id_soal_multiple,
          pertanyaan: soal.pertanyaan,
          pilihan_a: soal.pilihan_a,
          pilihan_b: soal.pilihan_b,
          pilihan_c: soal.pilihan_c,
          pilihan_d: soal.pilihan_d,
          pilihan_e: soal.pilihan_e,
        }));

        const soalEssay = ujian.soal_essay.map((soal) => ({
          id_soal_essay: soal.id_soal_essay,
          pertanyaan: soal.pertanyaan,
        }));

        const dataSoal =
          ujian.tipe_ujian === "MULTIPLE"
            ? { soal_multiple: soalMultiple }
            : { soal_essay: soalEssay };

        return res.json({
          status: 200,
          message: "Berhasil Mendapatkan Soal",
          data: {
            id_ujian: ujian.id_ujian,
            tipe_ujian: ujian.tipe_ujian,
            tanggal_ujian: ujian.tanggal_ujian,
            durasi_ujian: ujian.durasi_ujian,
            acak_soal: ujian.acak_soal,
            tampilkan_nilai: ujian.tampilkan_nilai,
            tampilkan_jawaban: ujian.tampilkan_jawaban,
            accessCamera: ujian.accessCamera,
            ...dataSoal,
          },
        });
      }

      if (user.role === "GURU" || user.role === "SUPER_ADMIN") {
        if (ujian.tipe_ujian === "MULTIPLE") {
          delete ujian.soal_essay;
        } else if (ujian.tipe_ujian === "ESSAY") {
          delete ujian.soal_multiple;
        }

        return res.json({
          status: 200,
          message: "Berhasil Mendapatkan Data",
          data: ujian,
        });
      }

      return res.status(403).json({ message: "Akses ditolak" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const {
        id_mata_pelajaran,
        id_guru,
        tanggal_ujian,
        durasi_ujian,
        deskripsi_ujian,
        status_ujian,
        nama_ujian,
        tipe_ujian,
        acak_soal,
        tampilkan_nilai,
        tampilkan_jawaban,
        accessCamera,
        soal_essay,
        soal_multiple,
      } = req.body;

      const ujian = await prisma.ujian.create({
        data: {
          id_mata_pelajaran,
          id_guru,
          tanggal_ujian,
          durasi_ujian,
          deskripsi_ujian,
          status_ujian: status_ujian,
          nama_ujian,
          tipe_ujian,
          acak_soal: acak_soal || false,
          tampilkan_nilai: tampilkan_nilai || false,
          tampilkan_jawaban: tampilkan_jawaban || false,
          accessCamera: accessCamera || false,
          soal_essay: {
            create: soal_essay || [],
          },
          soal_multiple: {
            create: soal_multiple || [],
          },
        },
        include: {
          mata_pelajaran: true,
          guru: true,
          soal_essay: true,
          soal_multiple: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Ujian berhasil dibuat",
        data: ujian,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Gagal membuat ujian",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        id_mata_pelajaran,
        id_guru,
        tanggal_ujian,
        durasi_ujian,
        deskripsi_ujian,
        status_ujian,
        nama_ujian,
        tipe_ujian,
        acak_soal,
        tampilkan_nilai,
        tampilkan_jawaban,
        accessCamera,
      } = req.body;

      const ujian = await prisma.ujian.update({
        where: {
          id_ujian: parseInt(id),
        },
        data: {
          id_mata_pelajaran: id_mata_pelajaran,
          id_guru: id_guru,
          tanggal_ujian: tanggal_ujian ? new Date(tanggal_ujian) : undefined,
          durasi_ujian: durasi_ujian,
          deskripsi_ujian: deskripsi_ujian,
          status_ujian: status_ujian,
          nama_ujian: nama_ujian,
          tipe_ujian: tipe_ujian,
          acak_soal: acak_soal,
          tampilkan_nilai: tampilkan_nilai,
          tampilkan_jawaban: tampilkan_jawaban,
          accessCamera: accessCamera,
        },
        include: {
          mata_pelajaran: true,
          guru: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Ujian berhasil diperbarui",
        data: ujian,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui ujian",
        error: error.message,
      });
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

  startUjian: async (req, res) => {
    try {
      const id_ujian = parseInt(req.params.id_ujian);
      const user = req.user;

      if (user.role !== "SISWA") {
        return res
          .status(403)
          .json({ message: "Hanya siswa yang bisa memulai ujian" });
      }

      const ujian = await prisma.ujian.findUnique({
        where: { id_ujian },
      });

      if (!ujian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      const existing = await prisma.hasil_ujian.findUnique({
        where: {
          id_siswa_id_ujian: {
            id_siswa: user.id,
            id_ujian,
          },
        },
      });

      if (existing) {
        return res.status(200).json({
          message: "Ujian sudah dimulai sebelumnya",
          alreadyStarted: true,
        });
      }

      await prisma.hasil_ujian.create({
        data: {
          id_siswa: user.id,
          id_ujian,
        },
      });

      return res.status(201).json({
        message: "Ujian berhasil dimulai",
        alreadyStarted: false,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Terjadi kesalahan", error: error.message });
    }
  },
};

module.exports = ujianController;
