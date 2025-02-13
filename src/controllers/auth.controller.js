const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = new PrismaClient();

const authController = {
  // 🔹 Login Guru berdasarkan NIP
  loginGuru: async (req, res) => {
    try {
      const { nip, password } = req.body;
      const nipInt = Number(nip); // Konversi NIP ke integer

      const guru = await prisma.guru.findUnique({ where: { nip: nipInt } });

      if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });

      // Cek password jika pakai bcrypt
      // const match = await bcrypt.compare(password, guru.password);
      // if (!match) return res.status(400).json({ message: "Password salah" });

      // Buat token JWT
      const token = jwt.sign({ id_guru: guru.id_guru, nip: guru.nip, role: "guru" }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(200).json({
        message: "Login berhasil",
        token,
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
      const siswa = await prisma.siswa.findUnique({ where: { nis } });

      if (!siswa) return res.status(404).json({ message: "Siswa tidak ditemukan" });

      // Cek password jika pakai bcrypt
      // const match = await bcrypt.compare(password, siswa.password);
      // if (!match) return res.status(400).json({ message: "Password salah" });

      // Buat token JWT
      const token = jwt.sign({ id_siswa: siswa.id, nis: siswa.nis, role: "siswa" }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(200).json({
        message: "Login berhasil",
        token,
        user: { id_siswa: siswa.id, nis: siswa.nis, role: "siswa" },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔹 Ambil data pengguna berdasarkan token
  Me: async (req, res) => {
    try {
      const { id_guru, id_siswa } = req.user; // Ambil data user dari token

      let user = null;

      if (id_guru) {
        user = await prisma.guru.findUnique({
          where: { id_guru },
          select: { id_guru: true, nip: true, nama_guru: true },
        });
      } else if (id_siswa) {
        user = await prisma.siswa.findUnique({
          where: { id: id_siswa },
          select: { id: true, nis: true, nama_siswa: true },
        });
      }

      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔹 Logout (Hapus token dari frontend)
  logout: async (req, res) => {
    try {
      // Logout hanya bisa dilakukan dengan menghapus token di frontend
      res.status(200).json({ message: "Logout Berhasil" });
    } catch (error) {
      res.status(500).json({ message: "Gagal logout" });
    }
  },

  // 🔹 Middleware untuk Verifikasi JWT
  verifyToken: async (req, res, next) => {
    console.log("Headers diterima:", req.headers); // Debugging

    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader); // Cek apakah token ada

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Token tidak ditemukan atau format salah");
      return res.status(401).json({ message: "Akses ditolak, token tidak ada" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token yang diterima:", token); // Cek token yang diterima

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token berhasil diverifikasi:", decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.log("Error verifikasi token:", error.message);
      res.status(403).json({ message: "Token tidak valid" });
    }
  },
};

module.exports = authController;
