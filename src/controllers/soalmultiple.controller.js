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

const soalmultipleController = {
  getAll: async (req, res) => {
    try {
      const soalmultiples = await prisma.soal_multiple.findMany();
      res.json({
        status: 200,
        message: "Berhasil menampilkan data",
        data: soalmultiples,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const soalmultipleId = parseInt(req.params.id);
      const soalmultiple = await prisma.soal_multiple.findUnique({
        where: {
          id_soal_multiple: soalmultipleId,
        },
      });

      if (!soalmultiple) {
        return res
          .status(404)
          .json({ message: "Soal Multiple tidak ditemukan" });
      }

      res.json({
        status: 200,
        message: "Berhasil menampilkan data",
        data: soalmultiple,
      });
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

        const newSoalmultipleData = req.body;
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

        const soalmultiple = await prisma.soal_multiple.create({
          data: {
            id_mata_pelajaran: parseInt(newSoalmultipleData.id_mata_pelajaran),
            id_ujian: newSoalmultipleData.id_ujian
              ? parseInt(newSoalmultipleData.id_ujian)
              : null,
            pertanyaan: newSoalmultipleData.pertanyaan,
            gambar_soal: gambarUrl,
            pilihan_a: newSoalmultipleData.pilihan_a,
            pilihan_b: newSoalmultipleData.pilihan_b,
            pilihan_c: newSoalmultipleData.pilihan_c,
            pilihan_d: newSoalmultipleData.pilihan_d,
            pilihan_e: newSoalmultipleData.pilihan_e,
            kunci_jawaban: newSoalmultipleData.kunci_jawaban,
            bobot: parseFloat(newSoalmultipleData.bobot),
          },
        });

        res.status(201).json({
          data: soalmultiple,
          message: "Berhasil menambahkan Soal Multiple dengan gambar",
        });
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;

      upload.single("gambar_soal")(req, res, async function (err) {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const updateData = req.body;
        let gambarUrl = null;

        const existingSoal = await prisma.soal_multiple.findUnique({
          where: { id_soal_multiple: parseInt(id) },
        });

        if (!existingSoal) {
          return res.status(404).json({ message: "Soal tidak ditemukan" });
        }

        if (req.file) {
          try {
            const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "soal-images",
              resource_type: "image",
            });

            gambarUrl = result.secure_url;
            fs.unlinkSync(req.file.path);

            if (existingSoal.gambar_soal) {
              const publicId = existingSoal.gambar_soal
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

        if (updateData.hapus_gambar === "true" && existingSoal.gambar_soal) {
          gambarUrl = null;
          const publicId = existingSoal.gambar_soal
            .split("/")
            .pop()
            .split(".")[0];
          try {
            await cloudinary.uploader.destroy(`soal-images/${publicId}`);
          } catch (error) {
            console.log("Gagal menghapus gambar:", error);
          }
        }

        const updatedSoal = await prisma.soal_multiple.update({
          where: { id_soal_multiple: parseInt(id) },
          data: {
            id_mata_pelajaran: updateData.id_mata_pelajaran
              ? parseInt(updateData.id_mata_pelajaran)
              : undefined,
            id_ujian: updateData.id_ujian
              ? parseInt(updateData.id_ujian)
              : undefined,
            pertanyaan: updateData.pertanyaan || undefined,
            gambar_soal: gambarUrl,
            pilihan_a: updateData.pilihan_a || undefined,
            pilihan_b: updateData.pilihan_b || undefined,
            pilihan_c: updateData.pilihan_c || undefined,
            pilihan_d: updateData.pilihan_d || undefined,
            pilihan_e: updateData.pilihan_e || undefined,
            kunci_jawaban: updateData.kunci_jawaban || undefined,
            bobot: updateData.bobot ? parseFloat(updateData.bobot) : undefined,
          },
        });

        res.status(200).json({
          data: updatedSoal,
          message: "Berhasil memperbarui Soal Multiple",
        });
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const soal = await prisma.soal_multiple.findUnique({
        where: { id_soal_multiple: parseInt(id) },
      });

      if (!soal) {
        return res.status(404).json({ message: "Soal tidak ditemukan" });
      }

      if (soal.gambar_soal) {
        try {
          const publicId = soal.gambar_soal.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`soal-images/${publicId}`);
        } catch (error) {
          console.log("Gagal menghapus gambar:", error);
        }
      }

      await prisma.soal_multiple.delete({
        where: { id_soal_multiple: parseInt(id) },
      });

      res.status(200).json({
        message: "Berhasil menghapus Soal Multiple",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = soalmultipleController;
