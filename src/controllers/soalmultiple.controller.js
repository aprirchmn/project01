const { getAllSoalmultiples, getSoalmultipleById, createSoalmultiple, deleteSoalmultipleById, editSoalmultipleById } = require("../services/soalmultiple.service");

const soalmultipleController = {
  getAll: async (req, res) => {
    try {
      const soalmultiples = await getAllSoalmultiples();
      res.json(soalmultiples);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const soalmultipleId = parseInt(req.params.id);
      const soalmultiple = await getSoalmultipleById(soalmultipleId);

      if (!soalmultiple) {
        return res.status(404).json({ message: "Soal Multiple tidak ditemukan" });
      }

      res.json(soalmultiple);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newSoalmultipleData = req.body;
      const soalmultiple = await createSoalmultiple(newSoalmultipleData);

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
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }

      const soalmultiple = await editSoalmultipleById(soalmultipleId, soalmultipleData);

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

      const soalmultiple = await editSoalmultipleById(soalmultipleId, soalmultipleData);

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
      await deleteSoalmultipleById(soalmultipleId);

      res.status(200).json({ message: "Soal Multiple berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = soalmultipleController;
