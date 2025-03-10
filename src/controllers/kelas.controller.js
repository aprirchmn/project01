const { getAllKelass, getKelasById, createKelas, deleteKelasById, editKelasById, joinKelasByKode } = require("../services/kelas.service");

const kelasController = {
  getAll: async (req, res) => {
    try {
      const kelass = await getAllKelass();
      res.json(kelass);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const kelasId = parseInt(req.params.id);
      const kelas = await getKelasById(kelasId);
      if (!kelas) {
        return res.status(404).json({ message: "Kelas tidak ditemukan" });
      }
      res.json(kelas);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newKelasData = req.body;
      const kelas = await createKelas(newKelasData);
      res.status(201).json({
        data: kelas,
        message: "Selamat kamu berhasil menambahkan Kelas",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const kelasId = parseInt(req.params.id);
      const kelasData = req.body;

      if (!(kelasData.nama_kelas && kelasData.kode_kelas && kelasData.id_guru)) {
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }

      const kelas = await editKelasById(kelasId, kelasData);
      res.json({
        data: kelas,
        message: "Berhasil mengubah data Kelas",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const kelasId = parseInt(req.params.id);
      await deleteKelasById(kelasId);
      res.status(200).json({ message: "Kelas berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const kelasId = parseInt(req.params.id);
      const kelasData = req.body;
      const kelas = await editKelasById(kelasId, kelasData);
      res.json({
        data: kelas,
        message: "Berhasil mengedit data Kelas",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  join: async (req, res) => {
    try {
      const { kode_kelas, id_siswa } = req.body;
      if (!kode_kelas || !id_siswa) {
        return res.status(400).json({ message: "Kode kelas dan ID siswa wajib diisi" });
      }

      const kelas = await joinKelasByKode(kode_kelas, id_siswa);
      res.json({ data: kelas, message: "Berhasil bergabung ke kelas" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = kelasController;
