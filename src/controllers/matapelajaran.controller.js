const prisma = require("../db");
const crypto = require("crypto");

const matapelajaranController = {
  getAll: async (req, res) => {
    try {
      const matapelajarans = await prisma.mata_pelajaran.findMany();
      res.json({
        status: 200,
        message: "Berhasil Menampilkan data",
        data: matapelajarans,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);
      const matapelajaran = await prisma.mata_pelajaran.findUnique({
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
      });

      if (!matapelajaran) {
        return res.status(404).json({ message: "Mata Pelajaran tidak ditemukan" });
      }
      res.json(matapelajaran);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newMatapelajaranData = req.body;
      const kode_mata_pelajaran = crypto.randomBytes(3).toString("hex").toUpperCase();

      const matapelajaran = await prisma.mata_pelajaran.create({
        data: {
          id_guru: newMatapelajaranData.id_guru,
          nama_mata_pelajaran: newMatapelajaranData.nama_mata_pelajaran,
          kode_mata_pelajaran: kode_mata_pelajaran,
          deskripsi_mata_pelajaran: newMatapelajaranData.deskripsi_mata_pelajaran,
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

      if (!(matapelajaranData.id_guru && matapelajaranData.nama_mata_pelajaran)) {
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }

      const existingMatapelajaran = await prisma.mata_pelajaran.findUnique({
        where: { id_mata_pelajaran: matapelajaranId },
      });

      if (!existingMatapelajaran) {
        return res.status(404).json({ message: "Mata Pelajaran tidak ditemukan" });
      }

      const matapelajaran = await prisma.mata_pelajaran.update({
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
        data: {
          id_guru: matapelajaranData.id_guru,
          nama_mata_pelajaran: matapelajaranData.nama_mata_pelajaran,
          kode_mata_pelajaran: matapelajaranData.kode_mata_pelajaran,
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
        return res.status(404).json({ message: "Mata Pelajaran tidak ditemukan" });
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

  patch: async (req, res) => {
    try {
      const matapelajaranId = parseInt(req.params.id);
      const matapelajaranData = req.body;

      const existingMatapelajaran = await prisma.mata_pelajaran.findUnique({
        where: { id_mata_pelajaran: matapelajaranId },
      });

      if (!existingMatapelajaran) {
        return res.status(404).json({ message: "Mata Pelajaran tidak ditemukan" });
      }

      const matapelajaran = await prisma.mata_pelajaran.update({
        where: {
          id_mata_pelajaran: matapelajaranId,
        },
        data: {
          ...(matapelajaranData.id_guru && {
            id_guru: matapelajaranData.id_guru,
          }),
          ...(matapelajaranData.nama_mata_pelajaran && {
            nama_mata_pelajaran: matapelajaranData.nama_mata_pelajaran,
          }),
          ...(matapelajaranData.kode_mata_pelajaran && {
            kode_mata_pelajaran: matapelajaranData.kode_mata_pelajaran,
          }),
          ...(matapelajaranData.deskripsi_mata_pelajaran && {
            deskripsi_mata_pelajaran: matapelajaranData.deskripsi_mata_pelajaran,
          }),
        },
      });

      res.json({
        data: matapelajaran,
        message: "Berhasil mengedit data Mata Pelajaran",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  join: async (req, res) => {
    try {
      const { kode_mata_pelajaran, id_siswa } = req.body;

      if (!kode_mata_pelajaran || !id_siswa) {
        return res.status(400).json({ message: "Kode kelas dan ID siswa wajib diisi" });
      }

      const mata_pelajaran = await prisma.mata_pelajaran.findFirst({
        where: { kode_mata_pelajaran },
        include: { siswa: true },
      });

      if (!mata_pelajaran) {
        return res.status(404).json({ message: "Kode kelas tidak ditemukan" });
      }

      const siswaSudahAda = mata_pelajaran.siswa.some((siswa) => siswa.id_siswa === id_siswa);
      if (siswaSudahAda) {
        return res.status(400).json({ message: "Siswa sudah tergabung dalam kelas ini" });
      }

      const updatedMata_pelajaran = await prisma.mata_pelajaran.update({
        where: { id_mata_pelajaran: mata_pelajaran.id_mata_pelajaran },
        data: {
          siswa: { connect: { id_siswa } },
        },
      });

      res.json({
        data: updatedMata_pelajaran,
        message: "Berhasil bergabung ke kelas",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = matapelajaranController;
