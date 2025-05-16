const prisma = require("../db");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");

const guruController = {
  getAll: async (req, res) => {
    try {
      const gurus = await prisma.guru.findMany({
        include: {
          user: {
            include: {
              userRoles: true,
            },
          },
        },
      });

      const formattedGurus = gurus.map((guru) => {
        const { user, ...guruData } = guru;

        return {
          ...guruData,
          email: user.email,
          username: user.username,
          roles: user.userRoles.map((userRole) => userRole.role),
        };
      });

      res.json({
        status: 200,
        data: formattedGurus,
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
    const { username, password, nama_guru, nip, email, roles } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
            ...(email && { email }),
            userRoles: {
              create: roles.map((role) => ({ role })),
            },
          },
          include: {
            userRoles: true,
          },
        });

        let guru = null;
        if (roles.includes("GURU")) {
          guru = await prisma.guru.create({
            data: {
              nama_guru,
              nip,
              user_id: user.id,
              username,
              ...(email && { email }),
            },
          });
        }

        return { user, guru };
      });

      res.status(201).json({
        message: "User berhasil ditambahkan",
        data: {
          user_id: result.user.id,
          username: result.user.username,
          roles: result.user.userRoles.map((ur) => ur.role),
          ...(result.guru && {
            id_guru: result.guru.id_guru,
            nama_guru: result.guru.nama_guru,
            nip: result.guru.nip,
          }),
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Username atau NIP sudah digunakan" });
      }
      res.status(500).json({ message: "Server error" });
    }
  },

  update: async (req, res) => {
    const id_guru = req.params.id;
    const { nama_guru, nip, username, password, email, roles } = req.body;

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const guru = await prisma.guru.findUnique({
          where: { id_guru: parseInt(id_guru) },
          include: {
            user: {
              include: {
                userRoles: true,
              },
            },
          },
        });

        if (!guru) {
          throw new Error("Guru tidak ditemukan");
        }

        const updatedGuru = await prisma.guru.update({
          where: { id_guru: parseInt(id_guru) },
          data: {
            nama_guru,
            nip,
            username,
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
          where: { id: guru.user_id },
          data: updateUserData,
          include: {
            userRoles: true,
          },
        });

        if (roles && Array.isArray(roles)) {
          await prisma.userRole.deleteMany({
            where: { user_id: guru.user_id },
          });

          await prisma.userRole.createMany({
            data: roles.map((role) => ({
              user_id: guru.user_id,
              role,
            })),
          });

          const updatedRoles = await prisma.userRole.findMany({
            where: { user_id: guru.user_id },
          });

          return {
            updatedGuru,
            updatedUser: {
              ...updatedUser,
              userRoles: updatedRoles,
            },
          };
        }

        return { updatedGuru, updatedUser };
      });

      res.status(200).json({
        message: "Data guru berhasil diperbarui",
        data: {
          id_guru: result.updatedGuru.id_guru,
          nama_guru: result.updatedGuru.nama_guru,
          nip: result.updatedGuru.nip,
          username: result.updatedUser.username,
          roles: result.updatedUser.userRoles.map((ur) => ur.role),
        },
      });
    } catch (error) {
      console.error(error);
      if (error.message === "Guru tidak ditemukan") {
        return res.status(404).json({ message: "Guru tidak ditemukan" });
      }
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Username atau NIP sudah digunakan" });
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
        return res.status(404).json({ message: "Data Guru tidak ditemukan" });
      }

      const hasRelatedSubjects = await prisma.mata_pelajaran.findFirst({
        where: {
          id_guru: guruId,
        },
      });

      if (hasRelatedSubjects) {
        return res.status(400).json({
          message:
            "Guru tidak dapat dihapus karena masih memiliki data mata pelajaran terkait",
        });
      }

      const hasRelatedExams = await prisma.ujian.findFirst({
        where: {
          id_guru: guruId,
        },
      });

      if (hasRelatedExams) {
        return res.status(400).json({
          message:
            "Guru tidak dapat dihapus karena masih memiliki data ujian terkait",
        });
      }

      await prisma.guru.delete({
        where: {
          id_guru: guruId,
        },
      });

      res.status(200).json({ message: "Akun Guru berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting guru:", error);
      res.status(400).send(error.message);
    }
  },

  importFromExcel: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File tidak ditemukan" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const results = {
        success: [],
        errors: [],
      };

      for (const row of data) {
        try {
          if (!row.username || !row.nama_guru || !row.nip || !row.password) {
            results.errors.push({
              nip: row.nip || "Unknown",
              error: "Missing required fields",
            });
            continue;
          }

          const hashedPassword = await bcrypt.hash(row.password, 10);

          const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
              data: {
                username: row.username,
                password: hashedPassword,
                role: "GURU",
                ...(row.email && { email: row.email }),
              },
            });

            const guru = await prisma.guru.create({
              data: {
                nama_guru: row.nama_guru,
                username: row.username,
                nip: row.nip.toString(),
                ...(row.email && { email: row.email }),
                user_id: user.id,
              },
            });

            return { user, guru };
          });

          results.success.push({
            id_guru: result.guru.id_guru,
            nama_guru: result.guru.nama_guru,
            nip: result.guru.nip,
          });
        } catch (error) {
          console.error(`Error importing row with NIP ${row.nip}:`, error);
          results.errors.push({
            nip: row.nip || "Unknown",
            error:
              error.code === "P2002"
                ? "Username, NIP, atau email sudah digunakan"
                : error.message,
          });
        }
      }

      res.status(200).json({
        message: `Import selesai. Berhasil: ${results.success.length}, Gagal: ${results.errors.length}`,
        results,
      });
    } catch (error) {
      console.error("Error importing Excel:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = guruController;
