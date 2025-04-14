const prisma = require("../db");
const bcrypt = require("bcrypt");

const siswaController = {
  getAll: async (req, res) => {
    try {
      const siswas = await prisma.siswa.findMany();
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
    const { username, password, nama_siswa, nis, email, mata_pelajaran_ids } =
      req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
            role: "SISWA",
            ...(email && { email }),
          },
        });

        const siswa = await prisma.siswa.create({
          data: {
            nama_siswa,
            nis,
            ...(email && { email }),
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
          email: result.siswa.email,
          username: result.user.username,
          role: result.user.role,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Username, NIS, atau email sudah digunakan" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  update: async (req, res) => {
    const id_siswa = req.params.id;
    const { nama_siswa, nis, id_kelas, username, password, email } = req.body;

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
            ...(email && { email }), // optional update
          },
        });

        const updateUserData = {
          username,
          ...(email && { email }), // optional update
        };

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
          email: result.updatedSiswa.email,
          username: result.updatedUser.username,
          role: result.updatedUser.role,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res.status(400).json({
          message: "Username, NIS, atau email sudah digunakan",
        });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const siswaId = parseInt(req.params.id);

      const existingSiswa = await prisma.siswa.findUnique({
        where: {
          id_siswa: siswaId,
        },
      });

      if (!existingSiswa) {
        return res.status(404).json({ message: "Data Murid tidak ditemukan" });
      }

      await prisma.$transaction(async (prisma) => {
        await prisma.mata_pelajaran_siswa.deleteMany({
          where: {
            id_siswa: siswaId,
          },
        });

        await prisma.hasil_ujian.deleteMany({
          where: {
            id_siswa: siswaId,
          },
        });

        await prisma.jawaban.deleteMany({
          where: {
            id_siswa: siswaId,
          },
        });

        await prisma.siswa.delete({
          where: {
            id_siswa: siswaId,
          },
        });
      });

      res.status(200).json({ message: "Akun Murid berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(400).send(error.message);
    }
  },

  join: async (req, res) => {
    const { id_siswa } = req.params;
    const { kode_mata_pelajaran } = req.body;

    try {
      const siswa = await prisma.siswa.findUnique({
        where: { id_siswa: parseInt(id_siswa) },
      });

      if (!siswa) {
        return res.status(404).json({ message: "Siswa tidak ditemukan" });
      }

      const mataPelajaran = await prisma.mata_pelajaran.findUnique({
        where: { kode_mata_pelajaran },
      });

      if (!mataPelajaran) {
        return res
          .status(404)
          .json({ message: "Mata pelajaran tidak ditemukan" });
      }

      const existingEnrollment = await prisma.mata_pelajaran_siswa.findUnique({
        where: {
          id_mata_pelajaran_id_siswa: {
            id_siswa: parseInt(id_siswa),
            id_mata_pelajaran: mataPelajaran.id_mata_pelajaran,
          },
        },
      });

      if (existingEnrollment) {
        return res
          .status(400)
          .json({ message: "Siswa sudah terdaftar di mata pelajaran ini" });
      }

      const enrollment = await prisma.mata_pelajaran_siswa.create({
        data: {
          id_siswa: parseInt(id_siswa),
          id_mata_pelajaran: mataPelajaran.id_mata_pelajaran,
        },
      });

      const mataPelajaranDetail = await prisma.mata_pelajaran.findUnique({
        where: { id_mata_pelajaran: mataPelajaran.id_mata_pelajaran },
        include: {
          guru: {
            select: {
              nama_guru: true,
            },
          },
        },
      });

      res.status(201).json({
        message: "Berhasil bergabung dengan mata pelajaran",
        data: {
          id_siswa: parseInt(id_siswa),
          mata_pelajaran: {
            id_mata_pelajaran: mataPelajaranDetail.id_mata_pelajaran,
            nama_mata_pelajaran: mataPelajaranDetail.nama_mata_pelajaran,
            kode_mata_pelajaran: mataPelajaranDetail.kode_mata_pelajaran,
            deskripsi_mata_pelajaran:
              mataPelajaranDetail.deskripsi_mata_pelajaran,
            pengajar: mataPelajaranDetail.guru.nama_guru,
          },
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = siswaController;
