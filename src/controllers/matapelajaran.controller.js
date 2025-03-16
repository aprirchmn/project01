const prisma = require("../db");

const matapelajaranController = {
  getAll: async (req, res) => {
    try {
      const matapelajarans = await prisma.mata_pelajaran.findMany();
      res.json(matapelajarans);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);
      const matapelajaran = await prisma.mata_pelajaran.findUnique({
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
      });

      if (!matapelajaran) {
        return res.status(404).json({ message: "Mata Pelajaran tidak ditemukan" });
      }
      res.json(matapelajaran);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newMatapelajaranData = req.body;
      const matapelajaran = await prisma.mata_pelajaran.create({
        data: {
          id_guru: newMatapelajaranData.id_guru,
          nama_mata_pelajaran: newMatapelajaranData.nama_mata_pelajaran,
        },
      });

      res.status(201).json({
        data: matapelajaran,
        message: "Berhasil menambahkan Mata Pelajaran",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);
      const matapelajaranData = req.body;

      if (!(matapelajaranData.id_guru && matapelajaranData.nama_mata_pelajaran)) {
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }

      const existingMatapelajaran = await prisma.mata_pelajaran.findUnique({
        where: { id_mata_pelajaran: matapelajaranId },
      });

      if (!existingMatapelajaran) {
        return res.status(404).json({ message: "Mata Pelajaran tidak ditemukan" });
      }

      const matapelajaran = await prisma.mata_pelajaran.update({
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
        data: {
          id_guru: matapelajaranData.id_guru,
          nama_mata_pelajaran: matapelajaranData.nama_mata_pelajaran,
        },
      });

      res.json({
        data: matapelajaran,
        message: "Berhasil mengubah data Mata Pelajaran",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);

      const existingMatapelajaran = await prisma.mata_pelajaran.findUnique({
        where: { id_mata_pelajaran: matapelajaranId },
      });

      if (!existingMatapelajaran) {
        return res.status(404).json({ message: "Mata Pelajaran tidak ditemukan" });
      }

      await prisma.mata_pelajaran.delete({
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
      });

      res.status(200).json({ message: "Mata Pelajaran berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);
      const matapelajaranData = req.body;

      const existingMatapelajaran = await prisma.mata_pelajaran.findUnique({
        where: { id_mata_pelajaran: matapelajaranId },
      });

      if (!existingMatapelajaran) {
        return res.status(404).json({ message: "Mata Pelajaran tidak ditemukan" });
      }

      const matapelajaran = await prisma.mata_pelajaran.update({
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
        data: {
          ...(matapelajaranData.id_guru && { id_guru: matapelajaranData.id_guru }),
          ...(matapelajaranData.nama_mata_pelajaran && { nama_mata_pelajaran: matapelajaranData.nama_mata_pelajaran }),
        },
      });

      res.json({
        data: matapelajaran,
        message: "Berhasil mengedit data Mata Pelajaran",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = matapelajaranController;