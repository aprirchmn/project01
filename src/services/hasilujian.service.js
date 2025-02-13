// untuk handle business logic

const prisma = require("../db");
const { findHasilujians, findHasilujianById, insertHasilujian, deleteHasilujian, editHasilujian } = require("../repository/hasilujian.repository");

const getAllHasilujians = async () => {
  const hasilujians = await findHasilujians(); //menampilkan semua data Hasilujian

  return hasilujians;
};

const getHasilujianById = async (id) => {
  const hasilujian = await findHasilujianById(id); //menampilkan semua data hasilujian

  if (!hasilujian) {
    throw Error("Hasil Ujian tidak ditemukan");
  }

  return hasilujian;
};

const createHasilujian = async (newHasilujianData) => {
  // const findHasilujian = await findHasilujianByNama(newHasilujianData);

  // if (findHasilujian) {
  //   throw new Error("Nama harus unik");
  // }

  const hasilujian = await insertHasilujian(newHasilujianData);

  return hasilujian;
};

const deleteHasilujianById = async (id) => {
  await getHasilujianById(id);

  await deleteHasilujian(id);
};

const editHasilujianById = async (id, hasilujianData) => {
  await getHasilujianById(id);

  const hasilujian = await editHasilujian(id, hasilujianData);

  return hasilujian;
};

// const putHasilujianById = async (Id, hasilujianData) => {
//   const hasilujian = await patchHasilujianById(id, hasilujianData);

//   return hasilujianData;
// };

module.exports = {
  getAllHasilujians,
  getHasilujianById,
  createHasilujian,
  deleteHasilujianById,
  editHasilujianById,
};
