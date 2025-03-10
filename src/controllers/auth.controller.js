const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const prisma = new PrismaClient();

const generateAccessToken = (payload) => {
  // Masa berlaku access token misalnya 10 menit
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10m" });
};

const generateRefreshToken = () => {
  // Menggunakan UUID sebagai refresh token
  return uuidv4();
};

const authController = {
  // 🔹 Login Guru berdasarkan NIP
  loginGuru: async (req, res) => {
    try {
      const { nip, password } = req.body;

      // Cek jika NIP atau password kosong
      if (!nip && !password) {
        return res.status(400).json({ message: "NIP dan password tidak boleh kosong" });
      }
      if (!nip) {
        return res.status(400).json({ message: "NIP tidak boleh kosong" });
      }
      if (!password) {
        return res.status(400).json({ message: "Password tidak boleh kosong" });
      }

      // Konversi NIP ke angka
      const nipInt = parseInt(nip, 10);
      if (isNaN(nipInt)) {
        return res.status(400).json({ message: "NIP harus berupa angka" });
      }

      // Cari guru berdasarkan NIP
      const guru = await prisma.guru.findUnique({ where: { nip: nipInt } });
      if (!guru) {
        return res.status(401).json({ message: "NIP atau password salah" });
      }

      // Buat token JWT
      // const token = jwt.sign({ id_guru: guru.id_guru, nip: guru.nip, role: "guru" }, process.env.JWT_SECRET, { expiresIn: "1d" });
      const accessToken = generateAccessToken({ id_guru: guru.id_guru, nip: guru.nip, role: "guru" });
      const refreshToken = generateRefreshToken();
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari
          id_guru: guru.id_guru,
        },
      });

      res.status(200).json({
        message: "Login berhasil",
        accessToken,
        refreshToken,
        user: { id_guru: guru.id_guru, nip: guru.nip, role: "guru" },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔹 Login Siswa berdasarkan NIS
  loginSiswa: async (req, res) => {
    try {
      const { nis, password } = req.body;

      // Cek jika NIS atau password kosong
      if (!nis && !password) {
        return res.status(400).json({ message: "NIS dan password tidak boleh kosong" });
      }
      if (!nis) {
        return res.status(400).json({ message: "NIS tidak boleh kosong" });
      }
      if (!password) {
        return res.status(400).json({ message: "Password tidak boleh kosong" });
      }

      // Konversi NIS ke angka
      const nisInt = parseInt(nis, 10);
      if (isNaN(nisInt)) {
        return res.status(400).json({ message: "NIS harus berupa angka" });
      }

      // Cari siswa berdasarkan NIS
      const siswa = await prisma.siswa.findUnique({ where: { nis: nisInt } });
      if (!siswa) {
        return res.status(401).json({ message: "Username atau password salah" });
      }

      // Buat token JWT
      // const token = jwt.sign({ id_siswa: siswa.id_siswa, nis: siswa.nis, role: "siswa" }, process.env.JWT_SECRET, { expiresIn: "1d" });
      const accessToken = generateAccessToken({ id_siswa: siswa.id_siswa, nis: siswa.nis, role: "siswa" });
      const refreshToken = generateRefreshToken();
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          id_siswa: siswa.id_siswa,
        },
      });

      res.status(200).json({
        message: "Login berhasil",
        accessToken,
        refreshToken,
        user: { id_siswa: siswa.id_siswa, nis: siswa.nis, role: "siswa" },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔹 Ambil data pengguna berdasarkan token
  Me: async (req, res) => {
    try {
      const { id_guru, id_siswa } = req.user;
      let user = null;

      if (id_guru) {
        user = await prisma.guru.findUnique({
          where: { id_guru },
          select: { id_guru: true, nip: true, nama_guru: true },
        });
      } else if (id_siswa) {
        user = await prisma.siswa.findUnique({
          where: { id_siswa },
          select: { id_siswa: true, nis: true, nama_siswa: true },
        });
      }

      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔹 Logout (Menghapus token di frontend)
  logout: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({ success: false, message: "Refresh token is required." });
      }

      // Hapus refresh token dari database
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });

      return res.status(200).json({
        success: true,
        message: "Logout successful.",
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // 🔹 Middleware untuk Verifikasi JWT
  verifyToken: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Akses ditolak, token tidak ada" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({ message: "Token tidak valid" });
    }
  },
};

module.exports = authController;
