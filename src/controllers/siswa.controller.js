const { getAllSiswas, getSiswaById, createSiswa, deleteSiswaById, editSiswaById } = require("../services/siswa.service");

const siswaController = {
  getAll: async (req, res) => {
    try {
      const siswas = await getAllSiswas();
      res.json(siswas);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const siswaId = parseInt(req.params.id);
      const siswa = await getSiswaById(siswaId);
      if (!siswa) {
        return res.status(404).json({ message: "Siswa tidak ditemukan" });
      }
      res.json(siswa);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newSiswaData = req.body;
      const siswa = await createSiswa(newSiswaData);
      res.status(201).json({
        data: siswa,
        message: "Berhasil menambahkan Murid",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const siswaId = parseInt(req.params.id);
      const siswaData = req.body;

      if (!(siswaData.nama_siswa && siswaData.nis && siswaData.password && siswaData.id_kelas)) {
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }

      const siswa = await editSiswaById(siswaId, siswaData);
      res.json({
        data: siswa,
        message: "Berhasil mengubah data Murid",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const siswaId = parseInt(req.params.id);
      await deleteSiswaById(siswaId);
      res.status(200).json({ message: "Akun Murid berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const siswaId = parseInt(req.params.id);
      const siswaData = req.body;
      const siswa = await editSiswaById(siswaId, siswaData);
      res.json({
        data: siswa,
        message: "Berhasil mengedit data Murid",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = siswaController;
