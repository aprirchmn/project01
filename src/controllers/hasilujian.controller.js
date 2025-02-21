const { getAllHasilujians, getHasilujianById, createHasilujian, deleteHasilujianById, editHasilujianById } = require("../services/hasilujian.service");

const hasilujianController = {
  getAll: async (req, res) => {
    try {
      const hasilujians = await getAllHasilujians();
      res.json(hasilujians);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const hasilujianId = parseInt(req.params.id);
      const hasilujian = await getHasilujianById(hasilujianId);
      if (!hasilujian) {
        return res.status(404).json({ message: "Hasil Ujian tidak ditemukan" });
      }
      res.json(hasilujian);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newHasilujianData = req.body;
      const hasilujian = await createHasilujian(newHasilujianData);
      res.status(201).json({
        data: hasilujian,
        message: "Berhasil menambahkan Hasil Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const hasilujianId = parseInt(req.params.id);
      const hasilujianData = req.body;
      // Validasi: Pastikan id_siswa dan id_ujian ada
      if (!(hasilujianData.id_siswa && hasilujianData.id_ujian)) {
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }
      const hasilujian = await editHasilujianById(hasilujianId, hasilujianData);
      res.json({
        data: hasilujian,
        message: "Berhasil mengubah Hasil Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const hasilujianId = parseInt(req.params.id);
      const hasilujianData = req.body;
      const hasilujian = await editHasilujianById(hasilujianId, hasilujianData);
      res.json({
        data: hasilujian,
        message: "Berhasil mengedit Hasil Ujian",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const hasilujianId = parseInt(req.params.id);
      await deleteHasilujianById(hasilujianId);
      res.status(200).json({ message: "Hasil Ujian berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = hasilujianController;
