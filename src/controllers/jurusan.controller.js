const prisma = require("../db");

const jurusanController = {
  getAll: async (req, res) => {
    try {
      const jurusan = await prisma.jurusan.findMany({
        include: {
          _count: {
            select: {
              siswa: true,
            },
          },
        },
      });

      return res.status(200).json({
        status: true,
        message: "Data jurusan berhasil diambil",
        data: jurusan,
      });
    } catch (error) {
      console.error("Error getAll jurusan:", error);
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan saat mengambil data jurusan",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const jurusan = await prisma.jurusan.findUnique({
        where: {
          id_jurusan: parseInt(id),
        },
        include: {
          siswa: {
            select: {
              id_siswa: true,
              nama_siswa: true,
              nis: true,
              email: true,
            },
          },
          _count: {
            select: {
              siswa: true,
            },
          },
        },
      });

      if (!jurusan) {
        return res.status(404).json({
          status: false,
          message: "Jurusan tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Data jurusan berhasil diambil",
        data: jurusan,
      });
    } catch (error) {
      console.error("Error getById jurusan:", error);
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan saat mengambil data jurusan",
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { nama_jurusan, kode_jurusan } = req.body;

      if (!nama_jurusan) {
        return res.status(400).json({
          status: false,
          message: "Nama jurusan harus diisi",
        });
      }

      const existingJurusan = await prisma.jurusan.findFirst({
        where: {
          OR: [{ nama_jurusan }, { kode_jurusan: kode_jurusan || undefined }],
        },
      });

      if (existingJurusan) {
        let message = "Data jurusan sudah ada";
        if (existingJurusan.nama_jurusan === nama_jurusan) {
          message = "Nama jurusan sudah digunakan";
        } else if (existingJurusan.kode_jurusan === kode_jurusan) {
          message = "Kode jurusan sudah digunakan";
        }

        return res.status(400).json({
          status: false,
          message,
        });
      }

      const jurusan = await prisma.jurusan.create({
        data: {
          nama_jurusan,
          kode_jurusan,
        },
      });

      return res.status(201).json({
        status: true,
        message: "Jurusan berhasil ditambahkan",
        data: jurusan,
      });
    } catch (error) {
      console.error("Error create jurusan:", error);
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan saat menambahkan jurusan",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_jurusan, kode_jurusan } = req.body;

      if (!nama_jurusan && !kode_jurusan) {
        return res.status(400).json({
          status: false,
          message: "Setidaknya satu field harus diisi",
        });
      }

      const jurusanExists = await prisma.jurusan.findUnique({
        where: {
          id_jurusan: parseInt(id),
        },
      });

      if (!jurusanExists) {
        return res.status(404).json({
          status: false,
          message: "Jurusan tidak ditemukan",
        });
      }

      if (nama_jurusan || kode_jurusan) {
        const existingJurusan = await prisma.jurusan.findFirst({
          where: {
            OR: [
              nama_jurusan ? { nama_jurusan } : {},
              kode_jurusan ? { kode_jurusan } : {},
            ],
            NOT: {
              id_jurusan: parseInt(id),
            },
          },
        });

        if (existingJurusan) {
          let message = "Data jurusan sudah ada";
          if (existingJurusan.nama_jurusan === nama_jurusan) {
            message = "Nama jurusan sudah digunakan";
          } else if (existingJurusan.kode_jurusan === kode_jurusan) {
            message = "Kode jurusan sudah digunakan";
          }

          return res.status(400).json({
            status: false,
            message,
          });
        }
      }

      const updatedJurusan = await prisma.jurusan.update({
        where: {
          id_jurusan: parseInt(id),
        },
        data: {
          ...(nama_jurusan && { nama_jurusan }),
          ...(kode_jurusan && { kode_jurusan }),
        },
      });

      return res.status(200).json({
        status: true,
        message: "Jurusan berhasil diperbarui",
        data: updatedJurusan,
      });
    } catch (error) {
      console.error("Error update jurusan:", error);
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan saat memperbarui jurusan",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const jurusan = await prisma.jurusan.findUnique({
        where: {
          id_jurusan: parseInt(id),
        },
        include: {
          _count: {
            select: {
              siswa: true,
            },
          },
        },
      });

      if (!jurusan) {
        return res.status(404).json({
          status: false,
          message: "Jurusan tidak ditemukan",
        });
      }

      if (jurusan._count.siswa > 0) {
        return res.status(400).json({
          status: false,
          message: `Jurusan tidak dapat dihapus karena masih digunakan oleh ${jurusan._count.siswa} siswa`,
        });
      }

      await prisma.jurusan.delete({
        where: {
          id_jurusan: parseInt(id),
        },
      });

      return res.status(200).json({
        status: true,
        message: "Jurusan berhasil dihapus",
      });
    } catch (error) {
      console.error("Error delete jurusan:", error);
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan saat menghapus jurusan",
        error: error.message,
      });
    }
  },
};

module.exports = jurusanController;
