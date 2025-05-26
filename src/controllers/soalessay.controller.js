const prisma = require("../db");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const fs = require("fs");

const upload = multer({
  dest: "tmp/uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar!"), false);
    }
  },
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "soal-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 1000, crop: "limit" }],
  },
});
const uploadDirectly = multer({ storage: storage });

const soalessayController = {
  getAll: async (req, res) => {
    try {
      const soalessays = await prisma.soal_essay.findMany();
      res.json(soalessays);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const soalessayId = parseInt(req.params.id);
      const soalessay = await prisma.soal_essay.findUnique({
        where: {
          id_soal_essay: soalessayId,
        },
      });

      if (!soalessay) {
        return res.status(404).json({ message: "Soal Essay tidak ditemukan" });
      }
      res.json(soalessay);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      upload.single("gambar_soal")(req, res, async function (err) {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const newSoalessayData = req.body;
        let gambarUrl = null;

        if (req.file) {
          try {
            const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "soal-images",
              resource_type: "image",
            });

            gambarUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
          } catch (cloudinaryError) {
            if (req.file && req.file.path) {
              fs.unlinkSync(req.file.path);
            }
            return res.status(500).json({
              message: "Gagal mengunggah gambar",
              error: cloudinaryError.message,
            });
          }
        }

        const soalessay = await prisma.soal_essay.create({
          data: {
            id_mata_pelajaran: parseInt(newSoalessayData.id_mata_pelajaran),
            id_ujian: parseInt(newSoalessayData.id_ujian),
            pertanyaan: newSoalessayData.pertanyaan,
            gambar_soal: gambarUrl,
            kunci_jawaban: newSoalessayData.kunci_jawaban,
            bobot: parseFloat(newSoalessayData.bobot),
          },
        });

        res.status(201).json({
          data: soalessay,
          message: "Berhasil menambahkan Soal Essay",
        });
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const soalessayId = parseInt(req.params.id);

      upload.single("gambar_soal")(req, res, async function (err) {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const soalessayData = req.body;
        let gambarUrl = null;

        const existingSoalessay = await prisma.soal_essay.findUnique({
          where: {
            id_soal_essay: soalessayId,
          },
        });

        if (!existingSoalessay) {
          return res
            .status(404)
            .json({ message: "Soal Essay tidak ditemukan" });
        }

        if (req.file) {
          try {
            const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "soal-images",
              resource_type: "image",
            });

            gambarUrl = result.secure_url;
            fs.unlinkSync(req.file.path);

            if (existingSoalessay.gambar_soal) {
              const publicId = existingSoalessay.gambar_soal
                .split("/")
                .pop()
                .split(".")[0];
              try {
                await cloudinary.uploader.destroy(`soal-images/${publicId}`);
              } catch (error) {
                console.log("Gagal menghapus gambar lama:", error);
              }
            }
          } catch (cloudinaryError) {
            if (req.file && req.file.path) {
              fs.unlinkSync(req.file.path);
            }
            return res.status(500).json({
              message: "Gagal mengunggah gambar",
              error: cloudinaryError.message,
            });
          }
        } else {
          gambarUrl = existingSoal.gambar_soal;
        }

        if (
          soalessayData.hapus_gambar === "true" &&
          existingSoalessay.gambar_soal
        ) {
          gambarUrl = null;
          const publicId = existingSoalessay.gambar_soal
            .split("/")
            .pop()
            .split(".")[0];
          try {
            await cloudinary.uploader.destroy(`soal-images/${publicId}`);
          } catch (error) {
            console.log("Gagal menghapus gambar:", error);
          }
        }

        const soalessay = await prisma.soal_essay.update({
          where: {
            id_soal_essay: parseInt(soalessayId),
          },
          data: {
            id_mata_pelajaran: parseInt(soalessayData.id_mata_pelajaran),
            id_jenis_ujian: parseInt(soalessayData.id_jenis_ujian),
            pertanyaan: soalessayData.pertanyaan,
            gambar_soal: gambarUrl,
            kunci_jawaban: soalessayData.kunci_jawaban,
            bobot: soalessayData.bobot,
          },
        });

        res.json({
          data: soalessay,
          message: "Berhasil mengupdate Soal Essay",
        });
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const soalessayId = parseInt(req.params.id);

      const existingSoalessay = await prisma.soal_essay.findUnique({
        where: {
          id_soal_essay: soalessayId,
        },
      });

      if (!existingSoalessay) {
        return res.status(404).json({ message: "Soal Essay tidak ditemukan" });
      }

      if (existingSoalessay.gambar_soal) {
        try {
          const publicId = existingSoalessay.gambar_soal
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(`soal-images/${publicId}`);
        } catch (error) {
          console.log("Gagal menghapus gambar:", error);
        }
      }

      await prisma.soal_essay.delete({
        where: {
          id_soal_essay: soalessayId,
        },
      });

      res.json({ message: "Soal Essay berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = soalessayController;
