// untuk handle business logic

const prisma = require("../db");
const { findKelass, findKelasById, insertKelas, deleteKelas, editKelas } = require("../repository/kelas.repository");

const getAllKelass = async () => {
  const kelass = await findKelass(); //menampilkan semua data Kelas

  return kelass;
};

const getKelasById = async (id) => {
  const kelas = await findKelasById(id); //menampilkan semua data Kelas

  if (!kelas) {
    throw Error("Data Kelas tidak ditemukan");
  }

  return kelas;
};

const createKelas = async (newKelasData) => {
  // const findKelas = await findKelasByNama(newKelasData);

  // if (findKelas) {
  //   throw new Error("Nama harus unik");
  // }

  const kelas = await insertKelas(newKelasData);

  return kelas;
};

const deleteKelasById = async (id) => {
  await getKelasById(id);

  await deleteKelas(id);
};

const editKelasById = async (id, kelasData) => {
  await getKelasById(id);

  const kelas = await editKelas(id, kelasData);

  return kelas;
};

// const putKelasById = async (Id, kelasData) => {
//   const kelas = await patchKelasById(id, kelasData);

//   return kelasData;
// };

module.exports = {
  getAllKelass,
  getKelasById,
  createKelas,
  deleteKelasById,
  editKelasById,
};
