const prisma = require("../db");

const soalessayController = {
  getAll: async (req, res) => {
    try {
      const soalessays = await prisma.soal_essay.findMany();
      res.json(soalessays);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const soalessayId = parseInt(req.params.id);
      const soalessay = await prisma.soal_essay.findUnique({
        where: {
          id_soal_essay: soalessayId,
        },
      });

      if (!soalessay) {
        return res.status(404).json({ message: "Soal Essay tidak ditemukan" });
      }
      res.json(soalessay);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newSoalessayData = req.body;
      const soalessay = await prisma.soal_essay.create({
        data: {
          id_mata_pelajaran: newSoalessayData.id_mata_pelajaran,
          id_ujian: newSoalessayData.id_ujian,
          pertanyaan: newSoalessayData.pertanyaan,
          kunci_jawaban: newSoalessayData.kunci_jawaban,
          bobot: newSoalessayData.bobot,
        },
      });

      res.status(201).json({
        data: soalessay,
        message: "Berhasil menambahkan Soal Essay",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const soalessayId = parseInt(req.params.id);
      const soalessayData = req.body;

      if (
        !(
          soalessayData.id_mata_pelajaran &&
          soalessayData.id_jenis_ujian &&
          soalessayData.pertanyaan &&
          soalessayData.kunci_jawaban &&
          soalessayData.bobot
        )
      ) {
        return res
          .status(400)
          .json({ message: "Tidak boleh ada data yang kosong" });
      }

      const existingSoalessay = await prisma.soal_essay.findUnique({
        where: {
          id_soal_essay: soalessayId,
        },
      });

      if (!existingSoalessay) {
        return res.status(404).json({ message: "Soal Essay tidak ditemukan" });
      }

      const soalessay = await prisma.soal_essay.update({
        where: {
          id_soal_essay: soalessayId,
        },
        data: {
          id_mata_pelajaran: soalessayData.id_mata_pelajaran,
          id_jenis_ujian: soalessayData.id_jenis_ujian,
          pertanyaan: soalessayData.pertanyaan,
          kunci_jawaban: soalessayData.kunci_jawaban,
          bobot: soalessayData.bobot,
        },
      });

      res.json({
        data: soalessay,
        message: "Berhasil mengupdate Soal Essay",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const soalessayId = parseInt(req.params.id);
      const soalessayData = req.body;

      const existingSoalessay = await prisma.soal_essay.findUnique({
        where: {
          id_soal_essay: soalessayId,
        },
      });

      if (!existingSoalessay) {
        return res.status(404).json({ message: "Soal Essay tidak ditemukan" });
      }

      const soalessay = await prisma.soal_essay.update({
        where: {
          id_soal_essay: soalessayId,
        },
        data: soalessayData,
      });

      res.json({
        data: soalessay,
        message: "Berhasil mengedit Soal Essay",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const soalessayId = parseInt(req.params.id);

      const existingSoalessay = await prisma.soal_essay.findUnique({
        where: {
          id_soal_essay: soalessayId,
        },
      });

      if (!existingSoalessay) {
        return res.status(404).json({ message: "Soal Essay tidak ditemukan" });
      }

      await prisma.soal_essay.delete({
        where: {
          id_soal_essay: soalessayId,
        },
      });

      res.json({ message: "Soal Essay berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = soalessayController;
