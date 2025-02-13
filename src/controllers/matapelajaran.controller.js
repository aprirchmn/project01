const { getAllMatapelajarans, getMatapelajaranById, createMatapelajaran, deleteMatapelajaranById, editMatapelajaranById } = require("../services/matapelajaran.service");

const matapelajaranController = {
  getAll: async (req, res) => {
    try {
      const matapelajarans = await getAllMatapelajarans();
      res.json(matapelajarans);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);
      const matapelajaran = await getMatapelajaranById(matapelajaranId);
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
      const matapelajaran = await createMatapelajaran(newMatapelajaranData);
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

      const matapelajaran = await editMatapelajaranById(matapelajaranId, matapelajaranData);
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
      await deleteMatapelajaranById(matapelajaranId);
      res.status(200).json({ message: "Mata Pelajaran berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);
      const matapelajaranData = req.body;
      const matapelajaran = await editMatapelajaranById(matapelajaranId, matapelajaranData);
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
