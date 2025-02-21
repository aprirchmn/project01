// untuk handle business logic

const prisma = require("../db");
const { findJawabans, findJawabanById, insertJawaban, deleteJawaban, editJawaban } = require("../repository/jawaban.repository");
const natural = require("natural");
const stopword = require("stopword");
const { Stemmer } = require("sastrawijs");

// Inisialisasi tokenizer & stemmer bahasa Indonesia
const tokenizer = new natural.WordTokenizer();
const stemmer = new Stemmer();

const getAllJawabans = async () => {
  const jawabans = await findJawabans(); //menampilkan semua data Jawaban

  return jawabans;
};

const getJawabanById = async (id) => {
  const jawaban = await findJawabanById(id); //menampilkan semua data jawaban

  if (!jawaban) {
    throw Error("Jawaban tidak ditemukan");
  }

  return jawaban;
};

// Fungsi untuk memproses teks (pre-processing)
const processText = (text) => {
  // Case folding (ubah ke huruf kecil)
  text = text.toLowerCase();

  // Tokenizing (pecah menjadi kata-kata)
  let tokens = text.split(/\s+/);

  // Filtering (hapus stopwords)
  tokens = stopword.removeStopwords(tokens, stopword.id);

  // Lemmatization (stemming menggunakan Sastrawi)
  tokens = tokens.map((token) => stemmer.stem(token));

  return tokens.join(" "); // Gabungkan kembali
};

// Fungsi untuk membangun Term Frequency (TF)
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
  // Tokenisasi kedua teks dan buat vektor frekuensi kata
  const tf1 = buildTermFrequency(text1);
  const tf2 = buildTermFrequency(text2);

  // Hitung dot product dan magnitude dari kedua vektor
  const dotProduct = Object.keys(tf1).reduce((sum, key) => sum + tf1[key] * (tf2[key] || 0), 0);
  const magnitude1 = Math.sqrt(Object.values(tf1).reduce((sum, value) => sum + value ** 2, 0));
  const magnitude2 = Math.sqrt(Object.values(tf2).reduce((sum, value) => sum + value ** 2, 0));

  // Menghindari pembagian dengan 0
  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  // Hitung cosine similarity
  return dotProduct / (magnitude1 * magnitude2);
};

const createJawaban = async (newJawabanData) => {
  let skor = 0;
  let message = "Jawaban Salah";
  let cosine = null; // Hanya digunakan untuk soal essay

  // Validasi awal: Pastikan id_siswa dan id_ujian ada
  if (!newJawabanData.id_siswa || !newJawabanData.id_ujian) {
    throw new Error("id_siswa dan id_ujian harus diisi!");
  }

  // Cek validitas id_siswa
  const siswa = await prisma.siswa.findUnique({
    where: { id_siswa: newJawabanData.id_siswa },
  });
  if (!siswa) {
    throw new Error(`Siswa dengan ID ${newJawabanData.id_siswa} tidak ditemukan.`);
  }

  // Cek validitas id_ujian
  const ujian = await prisma.ujian.findUnique({
    where: { id_ujian: newJawabanData.id_ujian },
  });
  if (!ujian) {
    throw new Error(`Ujian dengan ID ${newJawabanData.id_ujian} tidak ditemukan.`);
  }

  // Ambil atau buat hasil_ujian untuk kombinasi id_siswa dan id_ujian
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

  // Proses untuk Soal Multiple Choice
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

  // Proses untuk Soal Essay
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
    if (cosine >= 0.5) {
      skor = cosine * soalEssay.bobot;
      message = "Jawaban Benar";
    } else {
      message = "Jawaban Salah";
    }
  }

  // Persiapkan data untuk disimpan; sertakan cosine jika soal essay
  const jawabanData = {
    id_hasil_ujian: hasilUjian.id_hasil_ujian,
    id_ujian: newJawabanData.id_ujian,
    id_siswa: newJawabanData.id_siswa,
    jawaban_murid: newJawabanData.jawaban_murid,
    skor,
    id_soal_essay: newJawabanData.id_soal_essay,
    id_soal_multiple: newJawabanData.id_soal_multiple,
  };
  if (cosine !== null) {
    jawabanData.cosine = cosine;
  }

  // Simpan jawaban
  const jawaban = await prisma.jawaban.create({ data: jawabanData });

  // Update total skor terpisah di hasil_ujian:
  // Agregasi skor untuk soal multiple choice
  const totalSkorMultiple = await prisma.jawaban.aggregate({
    where: { id_hasil_ujian: hasilUjian.id_hasil_ujian, id_soal_multiple: { not: null } },
    _sum: { skor: true },
  });
  // Agregasi skor untuk soal essay
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

  return { ...jawaban, message };
};

const deleteJawabanById = async (id) => {
  await getJawabanById(id);

  await deleteJawaban(id);
};

const editJawabanById = async (id, jawabanData) => {
  await getJawabanById(id);

  const jawaban = await editJawaban(id, jawabanData);

  return jawaban;
};

// const putJawabanById = async (Id, jawabanData) => {
//   const jawaban = await patchjawabanById(id, jawabanData);

//   return jawabanData;
// };

module.exports = {
  getAllJawabans,
  getJawabanById,
  createJawaban,
  deleteJawabanById,
  editJawabanById,
};
