// untuk handle business logic

const prisma = require("../db");
const { findUjians, findUjianById, insertUjian, deleteUjian, editUjian } = require("../repository/ujian.repository");

const getAllUjians = async () => {
  const ujians = await findUjians(); //menampilkan semua data ujian

  return ujians;
};

const getUjianById = async (id) => {
  const ujian = await findUjianById(id);
  if (!ujian) throw new Error("Ujian tidak ditemukan");

  // Filter soal berdasarkan tipe ujian
  if (ujian.tipe_ujian === "MULTIPLE") {
    // Jika ujian tipe multiple choice, kita kosongkan soal essay
    ujian.soal_essays = [];
    // Jika konfigurasi acak aktif, acak urutan soal multiple
    if (ujian.acak_soal) {
      ujian.soal_multiples = ujian.soal_multiples.sort(() => Math.random() - 0.5);
    }
  } else if (ujian.tipe_ujian === "ESSAY") {
    // Jika ujian tipe essay, kosongkan soal multiple choice
    ujian.soal_multiples = [];
    // Jika konfigurasi acak aktif, acak urutan soal essay
    if (ujian.acak_soal) {
      ujian.soal_essays = ujian.soal_essays.sort(() => Math.random() - 0.5);
    }
  }

  // Jika konfigurasi tampilkan_nilai false, frontend bisa mengabaikan field hasil_ujian,
  // dan jika tampilkan_jawaban false, frontend bisa mengabaikan field jawaban.
  // Service hanya mengembalikan data ujian lengkap, sedangkan tampilan dikontrol oleh frontend.
  return ujian;
};

const createUjian = async (newUjianData) => {
  // const findUjian = await findUjianByNama(newUjianData);

  // if (findUjian) {
  //   throw new Error("Nama harus unik");
  // }

  const ujian = await insertUjian(newUjianData);

  return ujian;
};

const deleteUjianById = async (id) => {
  await getUjianById(id);

  await deleteUjian(id);
};

const editUjianById = async (id, ujianData) => {
  await getUjianById(id);

  const ujian = await editUjian(id, ujianData);

  return ujian;
};

// const putMatapelajaranById = async (Id, matapelajaranData) => {
//   const matapelajaran = await patchMatapelajaranById(id, matapelajaranData);

//   return matapelajaranData;
// };

module.exports = {
  getAllUjians,
  getUjianById,
  createUjian,
  deleteUjianById,
  editUjianById,
};
