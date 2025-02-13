const { getAllJenisujians, getJenisujianById, createJenisujian, deleteJenisujianById, editJenisujianById } = require("../services/jenisujian.service");

const jenisujianController = {
  getAll: async (req, res) => {
    try {
      const jenisujians = await getAllJenisujians();
      res.json(jenisujians);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const jenisujianId = parseInt(req.params.id);
      const jenisujian = await getJenisujianById(jenisujianId);
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
      const jenisujian = await createJenisujian(newJenisujianData);
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

      const jenisujian = await editJenisujianById(jenisujianId, jenisujianData);
      res.json({
        data: jenisujian,
        message: "Berhasil mengubah Jenis Ujian",
      });
    } catch (error) {
      res.status(500).send("Terjadi kesalahan saat memperbarui data Jenis Ujian");
    }
  },

  delete: async (req, res) => {
    try {
      const jenisujianId = parseInt(req.params.id);
      await deleteJenisujianById(jenisujianId);
      res.status(200).json({ message: "Jenis Ujian berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const jenisujianId = parseInt(req.params.id);
      const jenisujianData = req.body;

      const jenisujian = await editJenisujianById(jenisujianId, jenisujianData);
      res.json({
        data: jenisujian,
        message: "Berhasil mengedit Jenis Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = jenisujianController;
