const { getAllSoalessays, getSoalessayById, createSoalessay, editSoalessayById, deleteSoalessayById } = require("../services/soalessay.service");

const soalessayController = {
  getAll: async (req, res) => {
    try {
      const soalessays = await getAllSoalessays();
      res.json(soalessays);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const soalessayId = parseInt(req.params.id);
      const soalessay = await getSoalessayById(soalessayId);
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
      const soalessay = await createSoalessay(newSoalessayData);
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

      // Validasi apakah semua field wajib diisi
      if (!(soalessayData.id_mata_pelajaran && soalessayData.id_jenis_ujian && soalessayData.pertanyaan && soalessayData.kunci_jawaban && soalessayData.bobot)) {
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }

      const soalessay = await editSoalessayById(soalessayId, soalessayData);
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

      const soalessay = await editSoalessayById(soalessayId, soalessayData);
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
      await deleteSoalessayById(soalessayId);
      res.json({ message: "Soal Essay berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = soalessayController;
