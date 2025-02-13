const prisma = require("../prisma/client"); // Menggunakan Prisma
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authController = {
  // 🔹 Login untuk Guru berdasarkan NIP
  loginGuru: async (req, res) => {
    try {
      const { nip, password } = req.body;
      const guru = await prisma.guru.findUnique({
        where: { nip },
      });

      if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });

      // Cek apakah password cocok (tanpa hashing)
      if (guru.password !== password) {
        return res.status(400).json({ message: "Password salah" });
      }

      // Buat JWT Token
      const token = jwt.sign({ id: guru.id, nip: guru.nip, role: "guru" }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(200).json({
        message: "Login berhasil",
        token,
        user: { id: guru.id, nip: guru.nip, role: "guru" },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔹 Login untuk Siswa berdasarkan NIS
  loginSiswa: async (req, res) => {
    try {
      const { nis, password } = req.body;
      const siswa = await prisma.siswa.findUnique({
        where: { nis },
      });

      if (!siswa) return res.status(404).json({ message: "Siswa tidak ditemukan" });

      // Cek apakah password cocok (tanpa hashing)
      if (siswa.password !== password) {
        return res.status(400).json({ message: "Password salah" });
      }

      // Buat JWT Token
      const token = jwt.sign({ id: siswa.id, nis: siswa.nis, role: "siswa" }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(200).json({
        message: "Login berhasil",
        token,
        user: { id: siswa.id, nis: siswa.nis, role: "siswa" },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔹 Logout (Hapus token dari frontend)
  logout: async (req, res) => {
    res.status(200).json({ message: "Logout berhasil" });
  },
};

module.exports = authController;
