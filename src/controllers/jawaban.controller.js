const prisma = require("../db");
const natural = require("natural");
const stopword = require("stopword");
const { Stemmer } = require("sastrawijs");

const tokenizer = new natural.WordTokenizer();
const stemmer = new Stemmer();

const processText = (text) => {
  text = text.toLowerCase();

  let tokens = text.split(/\s+/);

  tokens = stopword.removeStopwords(tokens, stopword.id);

  tokens = tokens.map((token) => stemmer.stem(token));

  return tokens.join(" ");
};

const buildTermFrequency = (text) => {
  const termFrequency = {};
  const tokens = text.split(" ");

  tokens.forEach((token) => {
    termFrequency[token] = (termFrequency[token] || 0) + 1;
  });

  return termFrequency;
};

// Fungsi untuk menghitung cosine similarity antara dua vektor
const calculateCosineSimilarity = (text1, text2) => {
  const tf1 = buildTermFrequency(text1);
  const tf2 = buildTermFrequency(text2);

  const dotProduct = Object.keys(tf1).reduce((sum, key) => sum + tf1[key] * (tf2[key] || 0), 0);
  const magnitude1 = Math.sqrt(Object.values(tf1).reduce((sum, value) => sum + value ** 2, 0));
  const magnitude2 = Math.sqrt(Object.values(tf2).reduce((sum, value) => sum + value ** 2, 0));

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
};

const jawabanController = {
  getAll: async (req, res) => {
    try {
      const jawabans = await prisma.jawaban.findMany();
      res.json(jawabans);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const jawabanId = parseInt(req.params.id);
      const jawaban = await prisma.jawaban.findUnique({
        where: {
          id_jawaban: jawabanId,
        },
      });

      if (!jawaban) {
        return res.status(404).json({ message: "Jawaban tidak ditemukan" });
      }
      res.json(jawaban);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const newJawabanData = req.body;
      let skor = 0;
      let message = "Jawaban Salah";
      let cosine = null;

      if (!newJawabanData.id_siswa || !newJawabanData.id_ujian) {
        throw new Error("id_siswa dan id_ujian harus diisi!");
      }

      const siswa = await prisma.siswa.findUnique({
        where: { id_siswa: newJawabanData.id_siswa },
      });
      if (!siswa) {
        throw new Error(`Siswa dengan ID ${newJawabanData.id_siswa} tidak ditemukan.`);
      }

      const ujian = await prisma.ujian.findUnique({
        where: { id_ujian: newJawabanData.id_ujian },
      });
      if (!ujian) {
        throw new Error(`Ujian dengan ID ${newJawabanData.id_ujian} tidak ditemukan.`);
      }

      let hasilUjian = await prisma.hasil_ujian.findFirst({
        where: {
          id_siswa: newJawabanData.id_siswa,
          id_ujian: newJawabanData.id_ujian,
        },
      });
      if (!hasilUjian) {
        try {
          hasilUjian = await prisma.hasil_ujian.create({
            data: {
              id_siswa: newJawabanData.id_siswa,
              id_ujian: newJawabanData.id_ujian,
              nilai_multiple: 0,
              nilai_essay: 0,
            },
          });
        } catch (error) {
          throw new Error("Gagal membuat hasil ujian. Periksa apakah ID siswa dan ID ujian valid.");
        }
      }
      if (!hasilUjian || !hasilUjian.id_hasil_ujian) {
        throw new Error("Data tidak ditemukan atau gagal dibuat.");
      }

      if (newJawabanData.id_soal_multiple) {
        const soal = await prisma.soal_multiple.findUnique({
          where: { id_soal_multiple: newJawabanData.id_soal_multiple },
        });
        if (!soal) {
          throw new Error("Soal tidak ditemukan");
        }
        if (newJawabanData.jawaban_murid === soal.kunci_jawaban) {
          skor = soal.bobot;
          message = "Jawaban Benar";
        }
      }

      if (newJawabanData.id_soal_essay) {
        const soalEssay = await prisma.soal_essay.findUnique({
          where: { id_soal_essay: newJawabanData.id_soal_essay },
        });
        if (!soalEssay) {
          throw new Error("Soal essay tidak ditemukan");
        }
        const cleanedJawabanMurid = processText(newJawabanData.jawaban_murid);
        const cleanedKunciJawaban = processText(soalEssay.kunci_jawaban);
        cosine = parseFloat(calculateCosineSimilarity(cleanedJawabanMurid, cleanedKunciJawaban).toFixed(2));
        skor = cosine * soalEssay.bobot;
        message = cosine >= 0.5 ? "Jawaban Benar" : "Jawaban Salah";
      }

      const jawabanData = {
        id_hasil_ujian: hasilUjian.id_hasil_ujian,
        id_ujian: newJawabanData.id_ujian,
        id_siswa: newJawabanData.id_siswa,
        jawaban_murid: newJawabanData.jawaban_murid,
        skor,
        id_soal_essay: newJawabanData.id_soal_essay || null,
        id_soal_multiple: newJawabanData.id_soal_multiple || null,
        id_mata_pelajaran: newJawabanData.id_mata_pelajaran,
      };
      if (cosine !== null) {
        jawabanData.cosine = cosine;
      }

      const jawaban = await prisma.jawaban.create({ data: jawabanData });

      const totalSkorMultiple = await prisma.jawaban.aggregate({
        where: { id_hasil_ujian: hasilUjian.id_hasil_ujian, id_soal_multiple: { not: null } },
        _sum: { skor: true },
      });
      const totalSkorEssay = await prisma.jawaban.aggregate({
        where: { id_hasil_ujian: hasilUjian.id_hasil_ujian, id_soal_essay: { not: null } },
        _sum: { skor: true },
      });

      await prisma.hasil_ujian.update({
        where: { id_hasil_ujian: hasilUjian.id_hasil_ujian },
        data: {
          nilai_multiple: totalSkorMultiple._sum.skor || 0,
          nilai_essay: totalSkorEssay._sum.skor || 0,
        },
      });

      res.status(201).json({
        data: { ...jawaban, message },
        message: "Berhasil menambahkan Jawaban",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const jawabanId = parseInt(req.params.id);
      const jawabanData = req.body;

      const isValidSoal = jawabanData.id_soal_multiple !== undefined || jawabanData.id_soal_essay !== undefined;

      const isValidData = jawabanData.id_hasil_ujian && jawabanData.id_ujian && jawabanData.id_siswa && jawabanData.jawaban_murid && jawabanData.skor !== undefined;

      if (!isValidSoal || !isValidData) {
        return res.status(400).send("Tidak boleh ada data yang kosong");
      }

      const existingJawaban = await prisma.jawaban.findUnique({
        where: { id_jawaban: jawabanId },
      });

      if (!existingJawaban) {
        throw Error("Jawaban tidak ditemukan");
      }

      const jawaban = await prisma.jawaban.update({
        where: {
          id_jawaban: jawabanId,
        },
        data: {
          id_soal_multiple: jawabanData.id_soal_multiple || null,
          id_soal_essay: jawabanData.id_soal_essay || null,
          id_hasil_ujian: jawabanData.id_hasil_ujian,
          id_ujian: jawabanData.id_ujian,
          id_siswa: jawabanData.id_siswa,
          jawaban_murid: jawabanData.jawaban_murid,
          skor: jawabanData.skor,
          cosine: jawabanData.cosine || null,
        },
      });

      res.json({
        data: jawaban,
        message: "Berhasil mengubah data Jawaban",
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const jawabanId = parseInt(req.params.id);

      // Check if jawaban exists
      const existingJawaban = await prisma.jawaban.findUnique({
        where: { id_jawaban: jawabanId },
      });

      if (!existingJawaban) {
        throw Error("Jawaban tidak ditemukan");
      }

      await prisma.jawaban.delete({
        where: {
          id_jawaban: jawabanId,
        },
      });

      res.status(200).json({ message: "Jawaban berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  patch: async (req, res) => {
    try {
      const jawabanId = parseInt(req.params.id);
      const jawabanData = req.body;

      const existingJawaban = await prisma.jawaban.findUnique({
        where: { id_jawaban: jawabanId },
      });

      if (!existingJawaban) {
        throw Error("Jawaban tidak ditemukan");
      }

      const jawaban = await prisma.jawaban.update({
        where: {
          id_jawaban: jawabanId,
        },
        data: {
          ...(jawabanData.id_soal_multiple !== undefined && { id_soal_multiple: jawabanData.id_soal_multiple || null }),
          ...(jawabanData.id_soal_essay !== undefined && { id_soal_essay: jawabanData.id_soal_essay || null }),
          ...(jawabanData.id_hasil_ujian && { id_hasil_ujian: jawabanData.id_hasil_ujian }),
          ...(jawabanData.id_ujian && { id_ujian: jawabanData.id_ujian }),
          ...(jawabanData.id_siswa && { id_siswa: jawabanData.id_siswa }),
          ...(jawabanData.jawaban_murid && { jawaban_murid: jawabanData.jawaban_murid }),
          ...(jawabanData.skor !== undefined && { skor: jawabanData.skor }),
          ...(jawabanData.cosine !== undefined && { cosine: jawabanData.cosine || null }),
        },
      });

      res.json({
        data: jawaban,
        message: "Berhasil mengedit Jawaban",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = jawabanController;
