const prisma = require("../db");

const jenisujianController = {
  getAll: async (req, res) => {
    try {
      const jenisujians = await prisma.jenis_ujian.findMany();
      res.json({
        status: 200,
        message: "Data Berhasil ditemukan",
        data: jenisujians,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const jenisujianId = parseInt(req.params.id);
      const jenisujian = await prisma.jenis_ujian.findUnique({
        where: { id_jenis_ujian: jenisujianId },
      });

      if (!jenisujian) {
        return res.status(404).json({ message: "Jenis Ujian tidak ditemukan" });
      }
      res.json(jenisujian);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newJenisujianData = req.body;
      const jenisujian = await prisma.jenis_ujian.create({
        data: {
          jenis_ujian: newJenisujianData.jenis_ujian,
        },
      });

      res.status(201).json({
        data: jenisujian,
        message: "Berhasil menambahkan Jenis Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const jenisujianId = parseInt(req.params.id);
      const jenisujianData = req.body;

      if (!jenisujianData.jenis_ujian) {
        return res.status(400).send("Tidak boleh ada data yang kosong");
      }

      const existingJenisujian = await prisma.jenis_ujian.findUnique({
        where: { id_jenis_ujian: jenisujianId },
      });

      if (!existingJenisujian) {
        return res.status(404).json({ message: "Jenis Ujian tidak ditemukan" });
      }

      const jenisujian = await prisma.jenis_ujian.update({
        where: {
          id_jenis_ujian: jenisujianId,
        },
        data: {
          jenis_ujian: jenisujianData.jenis_ujian,
        },
      });

      res.json({
        data: jenisujian,
        message: "Berhasil mengubah Jenis Ujian",
      });
    } catch (error) {
      res
        .status(500)
        .send("Terjadi kesalahan saat memperbarui data Jenis Ujian");
    }
  },

  patch: async (req, res) => {
    try {
      const jenisujianId = parseInt(req.params.id);
      const jenisujianData = req.body;

      const existingJenisujian = await prisma.jenis_ujian.findUnique({
        where: { id_jenis_ujian: jenisujianId },
      });

      if (!existingJenisujian) {
        return res.status(404).json({ message: "Jenis Ujian tidak ditemukan" });
      }

      const jenisujian = await prisma.jenis_ujian.update({
        where: {
          id_jenis_ujian: jenisujianId,
        },
        data: {
          ...(jenisujianData.jenis_ujian && {
            jenis_ujian: jenisujianData.jenis_ujian,
          }),
        },
      });

      res.json({
        data: jenisujian,
        message: "Berhasil mengedit Jenis Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const jenisujianId = parseInt(req.params.id);

      const existingJenisujian = await prisma.jenis_ujian.findUnique({
        where: { id_jenis_ujian: jenisujianId },
      });

      if (!existingJenisujian) {
        return res.status(404).json({ message: "Jenis Ujian tidak ditemukan" });
      }

      await prisma.jenis_ujian.delete({
        where: { id_jenis_ujian: jenisujianId },
      });

      res.status(200).json({ message: "Jenis Ujian berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = jenisujianController;
