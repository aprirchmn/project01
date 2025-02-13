// untuk handle business logic

const prisma = require("../db");
const { findSoalmultiples, findSoalmultipleById, insertSoalmultiple, deleteSoalmultiple, editSoalmultiple } = require("../repository/soalmultiple.repository");

const getAllSoalmultiples = async () => {
  const soalmultiples = await findSoalmultiples(); //menampilkan semua data soalmultiple

  return soalmultiples;
};

const getSoalmultipleById = async (id) => {
  const soalmultiple = await findSoalmultipleById(id); //menampilkan semua data soalmultiple

  if (!soalmultiple) {
    throw Error("Soal Multiple tidak ditemukan");
  }

  return soalmultiple;
};

const createSoalmultiple = async (newSoalmultipleData) => {
  // const findSoalmultiple = await findSoalmultipleByNama(newSoalmultipleData);

  // if (findSoalmultiple) {
  //   throw new Error("Nama harus unik");
  // }

  const soalmultiple = await insertSoalmultiple(newSoalmultipleData);

  return soalmultiple;
};

const deleteSoalmultipleById = async (id) => {
  await getSoalmultipleById(id);

  await deleteSoalmultiple(id);
};

const editSoalmultipleById = async (id, soalmultipleData) => {
  await getSoalmultipleById(id);

  const soalmultiple = await editSoalmultiple(id, soalmultipleData);

  return soalmultiple;
};

// const putMatapelajaranById = async (Id, matapelajaranData) => {
//   const matapelajaran = await patchMatapelajaranById(id, matapelajaranData);

//   return matapelajaranData;
// };

module.exports = {
  getAllSoalmultiples,
  getSoalmultipleById,
  createSoalmultiple,
  deleteSoalmultipleById,
  editSoalmultipleById,
};
