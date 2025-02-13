const { getAllJawabans, getJawabanById, createJawaban, deleteJawabanById, editJawabanById } = require("../services/jawaban.service");

const jawabanController = {
  getAll: async (req, res) => {
    try {
      const jawabans = await getAllJawabans();
      res.json(jawabans);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const jawabanId = parseInt(req.params.id);
      const jawaban = await getJawabanById(jawabanId);
      if (!jawaban) {
        return res.status(404).json({ message: "Jawaban tidak ditemukan" });
      }
      res.json(jawaban);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newJawabanData = req.body;
      const jawaban = await createJawaban(newJawabanData);
      res.status(201).json({
        data: jawaban,
        message: "Berhasil menambahkan Jawaban",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const jawabanId = parseInt(req.params.id);
      const jawabanData = req.body;

      // Pastikan setidaknya salah satu dari id_soal_multiple atau id_soal_essay terisi
      const isValidSoal = jawabanData.id_soal_multiple !== undefined || jawabanData.id_soal_essay !== undefined;

      // Pastikan semua field wajib diisi (kecuali soal yang bisa opsional)
      const isValidData = jawabanData.id_hasil_ujian && jawabanData.id_ujian && jawabanData.id_siswa && jawabanData.jawaban_murid && jawabanData.skor !== undefined; // Cek eksplisit skor

      if (!isValidSoal || !isValidData) {
        return res.status(400).send("Tidak boleh ada data yang kosong");
      }

      const jawaban = await editJawabanById(jawabanId, jawabanData);
      res.json({
        data: jawaban,
        message: "Berhasil mengubah data Jawaban",
      });
    } catch (error) {
      res.status(500).send("Terjadi kesalahan saat memperbarui data Jawaban");
    }
  },

  delete: async (req, res) => {
    try {
      const jawabanId = parseInt(req.params.id);
      await deleteJawabanById(jawabanId);
      res.status(200).json({ message: "Jawaban berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const jawabanId = parseInt(req.params.id);
      const jawabanData = req.body;
      const jawaban = await editJawabanById(jawabanId, jawabanData);
      res.json({
        data: jawaban,
        message: "Berhasil mengedit Jawaban",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = jawabanController;
