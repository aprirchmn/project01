// untuk handle business logic

const prisma = require("../db");
const xlsx = require("xlsx");
const fs = require("fs");
const { findGurus, findGuruById, insertGuru, deleteGuru, editGuru, saveImportedData } = require("../repository/guru.repository");

const getAllGurus = async () => {
  const gurus = await findGurus(); //menampilkan semua data guru

  return gurus;
};

const getGuruById = async (id) => {
  const guru = await findGuruById(id); //menampilkan semua data guru

  if (!guru) {
    throw Error("Data Guru tidak ditemukan");
  }

  return guru;
};

const createGuru = async (newGuruData) => {
  // const findGuru = await findGuruByNama(newGuruData);

  // if (findGuru) {
  //   throw new Error("Nama harus unik");
  // }

  const guru = await insertGuru(newGuruData);

  return guru;
};

const deleteGuruById = async (id) => {
  await getGuruById(id);

  await deleteGuru(id);
};

const editGuruById = async (id, guruData) => {
  await getGuruById(id);

  const guru = await editGuru(id, guruData);

  return guru;
};

const processExcelFile = async (filePath) => {
  try {
    // Baca file Excel
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Hapus file setelah dibaca
    fs.unlinkSync(filePath);

    // Simpan data ke database
    return await saveImportedData(data);
  } catch (error) {
    console.error("❌ Error saat memproses file:", error);
    throw new Error("Gagal memproses file Excel");
  }
};

// const putGuruById = async (Id, guruData) => {
//   const guru = await patchGuruById(id, guruData);

//   return guruData;
// };

module.exports = {
  getAllGurus,
  getGuruById,
  createGuru,
  deleteGuruById,
  editGuruById,
  processExcelFile,
};
