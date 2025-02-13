const { findSoalessays, findSoalessayById, insertSoalessay, editSoalessay, deleteSoalessay } = require("../repository/soalessay.repository");

const getAllSoalessays = async () => {
  const soalessays = await findSoalessays(); // Menampilkan semua data soal essay
  return soalessays;
};

const getSoalessayById = async (id) => {
  const soalessay = await findSoalessayById(id); // Menampilkan soal essay berdasarkan ID

  if (!soalessay) {
    throw new Error("Soal Essay tidak ditemukan");
  }

  return soalessay;
};

const createSoalessay = async (newSoalessayData) => {
  // Tambahkan validasi jika diperlukan
  //   if (!newSoalEssayData.id_mata_pelajaran || !newSoalEssayData.id_jenis_ujian || !newSoalEssayData.pertanyaan || !newSoalEssayData.kunci_jawaban || !newSoalEssayData.bobot) {
  //     throw new Error("Semua field harus diisi");
  //   }

  const soalessay = await insertSoalessay(newSoalessayData);

  return soalessay;
};

const deleteSoalessayById = async (id) => {
  await getSoalessayById(id); // Pastikan soal essay ada sebelum menghapus

  await deleteSoalessay(id);
};

const editSoalessayById = async (id, soalessayData) => {
  await getSoalessayById(id); // Pastikan soal essay ada sebelum mengedit

  const soalessay = await editSoalessay(id, soalessayData);

  return soalessay;
};

module.exports = {
  getAllSoalessays,
  getSoalessayById,
  createSoalessay,
  deleteSoalessayById,
  editSoalessayById,
};
