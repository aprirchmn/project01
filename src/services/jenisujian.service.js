// untuk handle business logic

const prisma = require("../db");
const { findJenisujians, findJenisujianById, insertJenisujian, deleteJenisujian, editJenisujian } = require("../repository/jenisujian.repository");

const getAllJenisujians = async () => {
  const jenisujians = await findJenisujians(); //menampilkan semua data jenisujian

  return jenisujians;
};

const getJenisujianById = async (id) => {
  const jenisujian = await findJenisujianById(id); //menampilkan semua data jenisujian

  if (!jenisujian) {
    throw Error("Jenis Ujian tidak ditemukan");
  }

  return jenisujian;
};

const createJenisujian = async (newJenisujianData) => {
  // const findJenisujian = await findJenisujianByNama(newJenisujianData);

  // if (findJenisujian) {
  //   throw new Error("Nama harus unik");
  // }

  const jenisujian = await insertJenisujian(newJenisujianData);

  return jenisujian;
};

const deleteJenisujianById = async (id) => {
  await getJenisujianById(id);

  await deleteJenisujian(id);
};

const editJenisujianById = async (id, jenisujianData) => {
  await getJenisujianById(id);

  const jenisujian = await editJenisujian(id, jenisujianData);

  return jenisujian;
};

// const putJenisujianById = async (Id, jenisujianData) => {
//   const jenisujian = await patchJenisujianById(id, jenisujianData);

//   return jenisujianData;
// };

module.exports = {
  getAllJenisujians,
  getJenisujianById,
  createJenisujian,
  deleteJenisujianById,
  editJenisujianById,
};
