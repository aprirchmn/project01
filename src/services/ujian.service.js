// untuk handle business logic

const prisma = require("../db");
const { findUjians, findUjianById, insertUjian, deleteUjian, editUjian } = require("../repository/ujian.repository");

const getAllUjians = async () => {
  const ujians = await findUjians(); //menampilkan semua data ujian

  return ujians;
};

const getUjianById = async (id) => {
  const ujian = await findUjianById(id); //menampilkan semua data ujian

  if (!ujian) {
    throw Error("Ujian tidak ditemukan");
  }

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
