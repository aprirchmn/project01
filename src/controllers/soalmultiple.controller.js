const prisma = require("../db");

const soalmultipleController = {
  getAll: async (req, res) => {
    try {
      const soalmultiples = await prisma.soal_multiple.findMany();
      res.json({
        status: 200,
        message: "Berhasil menampilkan data",
        data: soalmultiples,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const soalmultipleId = parseInt(req.params.id);
      const soalmultiple = await prisma.soal_multiple.findUnique({
        where: {
          id_soal_multiple: soalmultipleId,
        },
      });

      if (!soalmultiple) {
        return res
          .status(404)
          .json({ message: "Soal Multiple tidak ditemukan" });
      }

      res.json({
        status: 200,
        message: "Berhasil menampilkan data",
        data: soalmultiple,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newSoalmultipleData = req.body;
      const soalmultiple = await prisma.soal_multiple.create({
        data: {
          id_mata_pelajaran: newSoalmultipleData.id_mata_pelajaran,
          id_ujian: newSoalmultipleData.id_ujian,
          pertanyaan: newSoalmultipleData.pertanyaan,
          pilihan_a: newSoalmultipleData.pilihan_a,
          pilihan_b: newSoalmultipleData.pilihan_b,
          pilihan_c: newSoalmultipleData.pilihan_c,
          pilihan_d: newSoalmultipleData.pilihan_d,
          pilihan_e: newSoalmultipleData.pilihan_e,
          kunci_jawaban: newSoalmultipleData.kunci_jawaban,
          bobot: newSoalmultipleData.bobot,
        },
      });

      res.status(201).json({
        data: soalmultiple,
        message: "Berhasil menambahkan Soal Multiple",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const soalmultipleId = parseInt(req.params.id);
      const soalmultipleData = req.body;

      if (
        !(
          soalmultipleData.pertanyaan &&
          soalmultipleData.pilihan_a &&
          soalmultipleData.pilihan_b &&
          soalmultipleData.pilihan_c &&
          soalmultipleData.pilihan_d &&
          soalmultipleData.pilihan_e &&
          soalmultipleData.kunci_jawaban &&
          soalmultipleData.bobot
        )
      ) {
        return res
          .status(400)
          .json({ message: "Tidak boleh ada data yang kosong" });
      }

      const existingSoalmultiple = await prisma.soal_multiple.findUnique({
        where: {
          id_soal_multiple: soalmultipleId,
        },
      });

      if (!existingSoalmultiple) {
        return res
          .status(404)
          .json({ message: "Soal Multiple tidak ditemukan" });
      }

      const soalmultiple = await prisma.soal_multiple.update({
        where: {
          id_soal_multiple: soalmultipleId,
        },
        data: {
          id_mata_pelajaran: soalmultipleData.id_mata_pelajaran,
          pertanyaan: soalmultipleData.pertanyaan,
          pilihan_a: soalmultipleData.pilihan_a,
          pilihan_b: soalmultipleData.pilihan_b,
          pilihan_c: soalmultipleData.pilihan_c,
          pilihan_d: soalmultipleData.pilihan_d,
          pilihan_e: soalmultipleData.pilihan_e,
          kunci_jawaban: soalmultipleData.kunci_jawaban,
          bobot: soalmultipleData.bobot,
        },
      });

      res.json({
        data: soalmultiple,
        message: "Berhasil mengubah Soal Multiple",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const soalmultipleId = parseInt(req.params.id);
      const soalmultipleData = req.body;

      const existingSoalmultiple = await prisma.soal_multiple.findUnique({
        where: {
          id_soal_multiple: soalmultipleId,
        },
      });

      if (!existingSoalmultiple) {
        return res
          .status(404)
          .json({ message: "Soal Multiple tidak ditemukan" });
      }

      const soalmultiple = await prisma.soal_multiple.update({
        where: {
          id_soal_multiple: soalmultipleId,
        },
        data: soalmultipleData,
      });

      res.json({
        data: soalmultiple,
        message: "Berhasil mengedit Soal Multiple",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const soalmultipleId = parseInt(req.params.id);

      const existingSoalmultiple = await prisma.soal_multiple.findUnique({
        where: {
          id_soal_multiple: soalmultipleId,
        },
      });

      if (!existingSoalmultiple) {
        return res
          .status(404)
          .json({ message: "Soal Multiple tidak ditemukan" });
      }

      await prisma.soal_multiple.delete({
        where: {
          id_soal_multiple: soalmultipleId,
        },
      });

      res.status(200).json({ message: "Soal Multiple berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = soalmultipleController;
