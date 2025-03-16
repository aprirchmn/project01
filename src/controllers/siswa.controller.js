const prisma = require("../db");

const siswaController = {
  getAll: async (req, res) => {
    try {
      const siswas = await prisma.siswa.findMany();
      res.json(siswas);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const siswaId = parseInt(req.params.id);
      const siswa = await prisma.siswa.findUnique({
        where: {
          id_siswa: siswaId,
        },
      });

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
      const siswa = await prisma.siswa.create({
        data: {
          nama_siswa: newSiswaData.nama_siswa,
          nis: newSiswaData.nis,
          password: newSiswaData.password,
          id_kelas: newSiswaData.id_kelas,
        },
      });

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

      // Check if siswa exists
      const existingSiswa = await prisma.siswa.findUnique({
        where: {
          id_siswa: siswaId,
        },
      });

      if (!existingSiswa) {
        return res.status(404).json({ message: "Data Murid tidak ditemukan" });
      }

      const siswa = await prisma.siswa.update({
        where: {
          id_siswa: siswaId,
        },
        data: {
          nama_siswa: siswaData.nama_siswa,
          nis: siswaData.nis,
          password: siswaData.password,
          id_kelas: siswaData.id_kelas,
        },
      });

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

      // Check if siswa exists
      const existingSiswa = await prisma.siswa.findUnique({
        where: {
          id_siswa: siswaId,
        },
      });

      if (!existingSiswa) {
        return res.status(404).json({ message: "Data Murid tidak ditemukan" });
      }

      await prisma.siswa.delete({
        where: {
          id_siswa: siswaId,
        },
      });

      res.status(200).json({ message: "Akun Murid berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const siswaId = parseInt(req.params.id);
      const siswaData = req.body;

      // Check if siswa exists
      const existingSiswa = await prisma.siswa.findUnique({
        where: {
          id_siswa: siswaId,
        },
      });

      if (!existingSiswa) {
        return res.status(404).json({ message: "Data Murid tidak ditemukan" });
      }

      const siswa = await prisma.siswa.update({
        where: {
          id_siswa: siswaId,
        },
        data: siswaData,
      });

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