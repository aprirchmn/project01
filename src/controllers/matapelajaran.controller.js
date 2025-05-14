const prisma = require("../db");
const crypto = require("crypto");

const matapelajaranController = {
  getAll: async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      let matapelajarans;

      if (userRole === "SUPER_ADMIN") {
        matapelajarans = await prisma.mata_pelajaran.findMany({
          include: {
            guru: {
              select: {
                nama_guru: true,
                id_guru: true,
              },
            },
            // siswa: {
            //   select: {
            //     _count: true,
            //   },
            // },
          },
        });
      } else if (userRole === "SISWA") {
        const siswa = await prisma.siswa.findUnique({
          where: { user_id: userId },
        });

        if (!siswa) {
          return res.status(404).json({
            status: 404,
            message: "Data siswa tidak ditemukan",
          });
        }

        const mataPelajaranSiswa = await prisma.mata_pelajaran_siswa.findMany({
          where: { id_siswa: siswa.id_siswa },
          include: {
            mata_pelajaran: {
              include: {
                guru: {
                  select: {
                    nama_guru: true,
                    id_guru: true,
                  },
                },
              },
            },
          },
        });

        matapelajarans = mataPelajaranSiswa.map((mps) => mps.mata_pelajaran);
      } else if (userRole === "GURU") {
        const guru = await prisma.guru.findUnique({
          where: { user_id: userId },
        });

        if (!guru) {
          return res.status(404).json({
            status: 404,
            message: "Data guru tidak ditemukan",
          });
        }

        matapelajarans = await prisma.mata_pelajaran.findMany({
          where: { id_guru: guru.id_guru },
          include: {
            siswa: {
              include: {
                siswa: {
                  select: {
                    nama_siswa: true,
                    nis: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
      } else {
        return res.status(403).json({
          status: 403,
          message: "Anda tidak memiliki akses untuk melihat data ini",
        });
      }

      res.json({
        status: 200,
        message: "Berhasil Menampilkan data",
        data: matapelajarans,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);
      const userRole = req.user.role;
      const userId = req.user.id;
      const statusFilter = req.query.status?.toUpperCase();
      const statusPengerjaanFilter = req.query.status_pengerjaan?.toUpperCase();

      const query = {
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
        include: {
          guru: {
            select: {
              nama_guru: true,
              id_guru: true,
            },
          },
          siswa: {
            include: {
              siswa: {
                select: {
                  nama_siswa: true,
                  nis: true,
                  email: true,
                },
              },
            },
          },
        },
      };

      let ujianQuery = {};

      const baseSelect = {
        id_ujian: true,
        nama_ujian: true,
        tanggal_ujian: true,
        durasi_ujian: true,
        deskripsi_ujian: true,
      };

      if (userRole !== "SISWA") {
        baseSelect.status_ujian = true;
      }

      if (userRole === "SISWA") {
        ujianQuery = {
          where: {
            status_ujian: "PUBLISHED",
          },
          select: baseSelect,
        };
      } else {
        ujianQuery = {
          select: baseSelect,
        };

        if (statusFilter && ["DRAFT", "PUBLISHED"].includes(statusFilter)) {
          ujianQuery.where = {
            status_ujian: statusFilter,
          };
        }
      }

      query.include.ujian = ujianQuery;

      const matapelajaran = await prisma.mata_pelajaran.findUnique(query);

      if (!matapelajaran) {
        return res
          .status(404)
          .json({ message: "Mata Pelajaran tidak ditemukan" });
      }

      if (userRole === "SISWA") {
        const siswa = await prisma.siswa.findUnique({
          where: {
            user_id: userId,
          },
          select: {
            id_siswa: true,
          },
        });

        if (siswa) {
          const hasilUjianList = await prisma.hasil_ujian.findMany({
            where: {
              id_siswa: siswa.user_id,
              ujian: {
                id_mata_pelajaran: matapelajaranId,
              },
            },
            select: {
              id_ujian: true,
              is_selesai: true,
            },
          });

          const ujianStatusMap = {};
          hasilUjianList.forEach((hasil) => {
            ujianStatusMap[hasil.id_ujian] = hasil.is_selesai
              ? "SELESAI"
              : "SEDANG DIKERJAKAN";
          });

          matapelajaran.ujian = matapelajaran.ujian.map((ujian) => {
            return {
              ...ujian,
              status_pengerjaan:
                ujianStatusMap[ujian.id_ujian] || "BELUM DIKERJAKAN",
            };
          });

          if (
            statusPengerjaanFilter &&
            ["SELESAI", "SEDANG DIKERJAKAN", "BELUM DIKERJAKAN"].includes(
              statusPengerjaanFilter,
            )
          ) {
            matapelajaran.ujian = matapelajaran.ujian.filter(
              (ujian) => ujian.status_pengerjaan === statusPengerjaanFilter,
            );
          }
        }
      }

      res.json({
        status: 200,
        message: "Berhasil Menampilkan data",
        data: matapelajaran,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newMatapelajaranData = req.body;
      const kode_mata_pelajaran = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

      const matapelajaran = await prisma.mata_pelajaran.create({
        data: {
          id_guru: newMatapelajaranData.id_guru,
          kode_mata_pelajaran: kode_mata_pelajaran,
          deskripsi_mata_pelajaran:
            newMatapelajaranData.deskripsi_mata_pelajaran,
          nama_mata_pelajaran: newMatapelajaranData.nama_mata_pelajaran,
        },
      });

      res.status(201).json({
        data: matapelajaran,
        message: "Berhasil menambahkan Mata Pelajaran",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);
      const matapelajaranData = req.body;

      const existingMatapelajaran = await prisma.mata_pelajaran.findUnique({
        where: { id_mata_pelajaran: matapelajaranId },
      });

      if (!existingMatapelajaran) {
        return res
          .status(404)
          .json({ message: "Mata Pelajaran tidak ditemukan" });
      }

      const matapelajaran = await prisma.mata_pelajaran.update({
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
        data: {
          id_guru: matapelajaranData.id_guru,
          nama_mata_pelajaran: matapelajaranData.nama_mata_pelajaran,
          deskripsi_mata_pelajaran: matapelajaranData.deskripsi_mata_pelajaran,
        },
      });

      res.json({
        data: matapelajaran,
        message: "Berhasil mengubah data Mata Pelajaran",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);

      const existingMatapelajaran = await prisma.mata_pelajaran.findUnique({
        where: { id_mata_pelajaran: matapelajaranId },
      });

      if (!existingMatapelajaran) {
        return res
          .status(404)
          .json({ message: "Mata Pelajaran tidak ditemukan" });
      }

      await prisma.mata_pelajaran.delete({
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
      });

      res.status(200).json({ message: "Mata Pelajaran berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = matapelajaranController;
