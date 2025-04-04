const prisma = require("../db");
const bcrypt = require("bcrypt");

const siswaController = {
  getAll: async (req, res) => {
    try {
      const siswas = await prisma.siswa.findMany({
        include: {
          kelas: true,
        },
      });
      res.json({
        status: 200,
        message: "Success",
        data: siswas,
      });
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
    const { username, password, nama_siswa, nis, id_kelas } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
            role: "SISWA",
          },
        });

        const siswa = await prisma.siswa.create({
          data: {
            nama_siswa,
            nis,
            id_kelas,
            user_id: user.id,
          },
        });

        return { user, siswa };
      });

      res.status(201).json({
        message: "Siswa berhasil ditambahkan",
        data: {
          id_siswa: result.siswa.id_siswa,
          nama_siswa: result.siswa.nama_siswa,
          nis: result.siswa.nis,
          id_kelas: result.siswa.id_kelas,
          username: result.user.username,
          role: result.user.role,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Username atau NIS sudah digunakan" });
      }
      res.status(500).json({ message: "Server error" });
    }
  },

  update: async (req, res) => {
    const id_siswa = req.params.id;
    const { nama_siswa, nis, id_kelas, username, password } = req.body;

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const siswa = await prisma.siswa.findUnique({
          where: { id_siswa: parseInt(id_siswa) },
        });

        if (!siswa) {
          return res.status(404).json({ message: "Siswa tidak ditemukan" });
        }

        const updatedSiswa = await prisma.siswa.update({
          where: { id_siswa: parseInt(id_siswa) },
          data: {
            nama_siswa,
            nis,
            id_kelas,
          },
        });

        const updateUserData = { username };

        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updateUserData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
          where: { id: siswa.user_id },
          data: updateUserData,
        });

        return { updatedSiswa, updatedUser };
      });

      res.status(200).json({
        message: "Data siswa berhasil diperbarui",
        data: {
          id_siswa: result.updatedSiswa.id_siswa,
          nama_siswa: result.updatedSiswa.nama_siswa,
          nis: result.updatedSiswa.nis,
          id_kelas: result.updatedSiswa.id_kelas,
          username: result.updatedUser.username,
          role: result.updatedUser.role,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Username atau NIS sudah digunakan" });
      }
      res.status(500).json({ message: "Server error" });
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
