const prisma = require("../db");

const guruController = {
  getAll: async (req, res) => {
    try {
      const gurus = await prisma.guru.findMany();
      res.json(gurus);
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
    try {
      const newGuruData = req.body;
      const guru = await prisma.guru.create({
        data: {
          nama_guru: newGuruData.nama_guru,
          nip: newGuruData.nip,
          password: newGuruData.password,
        },
      });

      res.status(201).json({
        data: guru,
        message: "Berhasil menambahkan Guru",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const guruId = parseInt(req.params.id);
      const guruData = req.body;

      if (!(guruData.nama_guru && guruData.nip && guruData.password)) {
        return res.status(400).json({ message: "Tidak boleh ada data yang kosong" });
      }

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
          nama_guru: guruData.nama_guru,
          nip: guruData.nip,
          password: guruData.password,
        },
      });

      res.json({
        data: guru,
        message: "Berhasil mengubah data Guru",
      });
    } catch (error) {
      res.status(400).send(error.message);
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
};

module.exports = guruController;