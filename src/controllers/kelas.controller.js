const prisma = require("../db");
const crypto = require("crypto");

const kelasController = {
  getAll: async (req, res) => {
    try {
      const kelass = await prisma.kelas.findMany();
      res.json(kelass);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const kelasId = parseInt(req.params.id);
      const kelas = await prisma.kelas.findUnique({
        where: {
          id_kelas: kelasId,
        },
      });

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
      // Generate kode kelas secara otomatis
      const kode_kelas = crypto.randomBytes(3).toString("hex").toUpperCase();

      const kelas = await prisma.kelas.create({
        data: {
          nama_kelas: newKelasData.nama_kelas,
          kode_kelas: kode_kelas,
          id_guru: newKelasData.id_guru,
          deskripsi_kelas: newKelasData.deskripsi_kelas,
        },
      });

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

      const existingKelas = await prisma.kelas.findUnique({
        where: { id_kelas: kelasId },
      });

      if (!existingKelas) {
        return res.status(404).json({ message: "Kelas tidak ditemukan" });
      }

      const kelas = await prisma.kelas.update({
        where: {
          id_kelas: kelasId,
        },
        data: {
          nama_kelas: kelasData.nama_kelas,
          kode_kelas: kelasData.kode_kelas,
          id_guru: kelasData.id_guru,
          deskripsi_kelas: kelasData.deskripsi_kelas,
        },
      });

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

      const existingKelas = await prisma.kelas.findUnique({
        where: { id_kelas: kelasId },
      });

      if (!existingKelas) {
        return res.status(404).json({ message: "Kelas tidak ditemukan" });
      }

      await prisma.kelas.delete({
        where: {
          id_kelas: kelasId,
        },
      });

      res.status(200).json({ message: "Kelas berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const kelasId = parseInt(req.params.id);
      const kelasData = req.body;

      const existingKelas = await prisma.kelas.findUnique({
        where: { id_kelas: kelasId },
      });

      if (!existingKelas) {
        return res.status(404).json({ message: "Kelas tidak ditemukan" });
      }

      const kelas = await prisma.kelas.update({
        where: {
          id_kelas: kelasId,
        },
        data: {
          ...(kelasData.nama_kelas && { nama_kelas: kelasData.nama_kelas }),
          ...(kelasData.kode_kelas && { kode_kelas: kelasData.kode_kelas }),
          ...(kelasData.id_guru && { id_guru: kelasData.id_guru }),
          ...(kelasData.deskripsi_kelas && { deskripsi_kelas: kelasData.deskripsi_kelas }),
        },
      });

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

      // Cari kelas berdasarkan kode
      const kelas = await prisma.kelas.findFirst({
        where: { kode_kelas },
        include: { siswa: true },
      });

      if (!kelas) {
        return res.status(404).json({ message: "Kode kelas tidak ditemukan" });
      }

      // Cek apakah siswa sudah tergabung
      const siswaSudahAda = kelas.siswa.some(siswa => siswa.id_siswa === id_siswa);
      if (siswaSudahAda) {
        return res.status(400).json({ message: "Siswa sudah tergabung dalam kelas ini" });
      }

      // Tambahkan siswa ke kelas
      const updatedKelas = await prisma.kelas.update({
        where: { id_kelas: kelas.id_kelas },
        data: {
          siswa: { connect: { id_siswa } },
        },
      });

      res.json({
        data: updatedKelas,
        message: "Berhasil bergabung ke kelas"
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = kelasController;