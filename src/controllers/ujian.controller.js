const { getAllUjians, getUjianById, createUjian, deleteUjianById, editUjianById } = require("../services/ujian.service");

const ujianController = {
  getAll: async (req, res) => {
    try {
      const ujians = await getAllUjians();
      res.json(ujians);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const ujianId = parseInt(req.params.id);
      const ujian = await getUjianById(ujianId);

      if (!ujian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      res.json(ujian);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newUjianData = req.body;
      const ujian = await createUjian(newUjianData);

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

      if (!(ujianData.id_mata_pelajaran && ujianData.id_guru && ujianData.id_kelas && ujianData.id_jenis_ujian && ujianData.tanggal_ujian && ujianData.durasi_ujian && ujianData.status_ujian && ujianData.id_siswa && ujianData.nama_ujian)) {
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }

      const ujian = await editUjianById(ujianId, ujianData);

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

      const ujian = await editUjianById(ujianId, ujianData);

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
      await deleteUjianById(ujianId);

      res.status(200).json({ message: "Ujian berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = ujianController;
