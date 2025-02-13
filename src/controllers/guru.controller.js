const { getAllGurus, getGuruById, createGuru, deleteGuruById, editGuruById } = require("../services/guru.service");

const guruController = {
  getAll: async (req, res) => {
    try {
      const gurus = await getAllGurus();
      res.json(gurus);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const guruId = parseInt(req.params.id);
      const guru = await getGuruById(guruId);
      if (!guru) {
        return res.status(404).json({ message: "Guru tidak ditemukan" });
      }
      res.json(guru);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newGuruData = req.body;
      const guru = await createGuru(newGuruData);
      res.status(201).json({
        data: guru,
        message: "Berhasil menambahkan Guru",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const guruId = parseInt(req.params.id);
      const guruData = req.body;

      if (!(guruData.nama_guru && guruData.nip && guruData.password)) {
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }

      const guru = await editGuruById(guruId, guruData);
      res.json({
        data: guru,
        message: "Berhasil mengubah data Guru",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const guruId = parseInt(req.params.id);
      await deleteGuruById(guruId);
      res.status(200).json({ message: "Akun Guru berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const guruId = parseInt(req.params.id);
      const guruData = req.body;
      const guru = await editGuruById(guruId, guruData);
      res.json({
        data: guru,
        message: "Berhasil mengedit data Guru",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = guruController;
