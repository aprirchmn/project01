// untuk handle business logic

const prisma = require("../db");
const { findJawabans, findJawabanById, insertJawaban, deleteJawaban, editJawaban } = require("../repository/jawaban.repository");

const getAllJawabans = async () => {
  const jawabans = await findJawabans(); //menampilkan semua data Jawaban

  return jawabans;
};

const getJawabanById = async (id) => {
  const jawaban = await findJawabanById(id); //menampilkan semua data jawaban

  if (!jawaban) {
    throw Error("Data Murid tidak ditemukan");
  }

  return jawaban;
};

const createJawaban = async (newJawabanData) => {
  // const findJawaban = await findJawabanByNama(newJawabanData);

  // if (findJawaban) {
  //   throw new Error("Nama harus unik");
  // }

  const jawaban = await insertJawaban(newJawabanData);

  return jawaban;
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
