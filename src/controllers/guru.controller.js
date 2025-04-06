const prisma = require("../db");
const bcrypt = require("bcrypt");
const { parse } = require("dotenv");
const xlsx = require("xlsx");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const guruController = {
  getAll: async (req, res) => {
    try {
      const gurus = await prisma.guru.findMany({
        include: {
          mata_pelajaran: true,
        },
      });
      res.json({
        status: 200,
        data: gurus,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const guruId = parseInt(req.params.id);
      const guru = await prisma.guru.findUnique({
        where: {
          id_guru: guruId,
        },
      });

      if (!guru) {
        return res.status(404).json({ message: "Guru tidak ditemukan" });
      }
      res.json(guru);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    const { username, password, nama_guru, nip, id_mata_pelajaran } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
            role: "GURU",
          },
        });

        // const idKelas = await prisma.kelas.findUnique({
        //   where: {
        //     id_kelas: req.body.id_kelas,
        //   },
        // });

        const guru = await prisma.guru.create({
          data: {
            nama_guru,
            nip,
            user_id: user.id,
            username,
          },
        });

        return { user, guru };
      });

      res.status(201).json({
        message: "Guru berhasil ditambahkan",
        data: {
          id_guru: result.guru.id_guru,
          nama_guru: result.guru.nama_guru,
          nip: result.guru.nip,
          username: result.user.username,
          role: result.user.role,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res.status(400).json({ message: "Username atau NIP sudah digunakan" });
      }
      res.status(500).json({ message: "Server error" });
    }
  },

  update: async (req, res) => {
    const id_guru = req.params.id;
    const { nama_guru, nip, username, password } = req.body;

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const guru = await prisma.guru.findUnique({
          where: { id_guru: parseInt(id_guru) },
        });

        if (!guru) {
          return res.status(404).json({ message: "Guru tidak ditemukan" });
        }

        const updatedGuru = await prisma.guru.update({
          where: { id_guru: parseInt(id_guru) },
          data: {
            nama_guru,
            nip,
            username,
          },
        });

        const updateUserData = { username };

        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updateUserData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
          where: { id: guru.user_id },
          data: updateUserData,
        });

        return { updatedGuru, updatedUser };
      });

      res.status(200).json({
        message: "Data guru berhasil diperbarui",
        data: {
          id_guru: result.updatedGuru.id_guru,
          nama_guru: result.updatedGuru.nama_guru,
          nip: result.updatedGuru.nip,
          username: result.updatedUser.username,
          role: result.updatedUser.role,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res.status(400).json({ message: "Username atau NIP sudah digunakan" });
      }
      res.status(500).json({ message: "Server error" });
    }
  },

  delete: async (req, res) => {
    try {
      const guruId = parseInt(req.params.id);

      const existingGuru = await prisma.guru.findUnique({
        where: {
          id_guru: guruId,
        },
      });

      if (!existingGuru) {
        throw Error("Data Guru tidak ditemukan");
      }

      await prisma.guru.delete({
        where: {
          id_guru: guruId,
        },
      });

      res.status(200).json({ message: "Akun Guru berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const guruId = parseInt(req.params.id);
      const guruData = req.body;

      const existingGuru = await prisma.guru.findUnique({
        where: {
          id_guru: guruId,
        },
      });

      if (!existingGuru) {
        throw Error("Data Guru tidak ditemukan");
      }

      const guru = await prisma.guru.update({
        where: {
          id_guru: guruId,
        },
        data: {
          ...(guruData.nama_guru && { nama_guru: guruData.nama_guru }),
          ...(guruData.nip && { nip: guruData.nip }),
          ...(guruData.password && { password: guruData.password }),
        },
      });

      res.json({
        data: guru,
        message: "Berhasil mengedit data Guru",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  importExcel: async (req, res) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

    const upload = multer({ storage }).single("file");

    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "File tidak ditemukan" });
      }

      try {
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        const imported = [];
        const skipped = [];

        for (const row of data) {
          const { username, password, nama_guru, nip, id_mata_pelajaran } = row;

          if (!username || !password || !nama_guru || !nip) {
            skipped.push({ row, reason: "Data tidak lengkap" });
            continue;
          }

          const userExist = await prisma.user.findUnique({ where: { username } });
          const nipExist = await prisma.guru.findUnique({ where: { nip } });

          if (userExist || nipExist) {
            skipped.push({ row, reason: "Data sudah ada" });
            continue;
          }

          const hashedPassword = await bcrypt.hash(password.toString(), 10);

          const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
              data: {
                username,
                password: hashedPassword,
                role: "GURU",
              },
            });

            const guru = await tx.guru.create({
              data: {
                nama_guru,
                nip,
                user_id: user.id,
                username,
                // id_mata_pelajaran: id_mata_pelajaran || null,
              },
            });

            return {
              id_guru: guru.id_guru,
              nama_guru: guru.nama_guru,
              nip: guru.nip,
              username: user.username,
              role: user.role,
            };
          });

          imported.push(result);
        }

        res.status(200).json({
          message: "Import guru selesai",
          imported: imported.length,
          skipped: skipped.length,
          data_imported: imported,
          data_skipped: skipped,
        });

        // Opsional: hapus file upload setelah diproses
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error("❌ Error importExcel guru:", error);
        res.status(500).json({ message: "Gagal import guru", error: error.message });
      }
    });
  },
};

module.exports = guruController;
