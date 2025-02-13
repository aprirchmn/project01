// untuk handle business logic

const prisma = require("../db");
const { findMatapelajarans, findMatapelajaranById, insertMatapelajaran, deleteMatapelajaran, editMatapelajaran } = require("../repository/matapelajaran.repository");

const getAllMatapelajarans = async () => {
  const matapelajarans = await findMatapelajarans(); //menampilkan semua data matapelajaran

  return matapelajarans;
};

const getMatapelajaranById = async (id) => {
  const matapelajaran = await findMatapelajaranById(id); //menampilkan semua data matapelajaran

  if (!matapelajaran) {
    throw Error("Mata Pelajaran tidak ditemukan");
  }

  return matapelajaran;
};

const createMatapelajaran = async (newMatapelajaranData) => {
  // const findMatapelajaran = await findMatapelajaranByNama(newMatapelajaranData);

  // if (findMatapelajaran) {
  //   throw new Error("Nama harus unik");
  // }

  const matapelajaran = await insertMatapelajaran(newMatapelajaranData);

  return matapelajaran;
};

const deleteMatapelajaranById = async (id) => {
  await getMatapelajaranById(id);

  await deleteMatapelajaran(id);
};

const editMatapelajaranById = async (id, matapelajaranData) => {
  await getMatapelajaranById(id);

  const matapelajaran = await editMatapelajaran(id, matapelajaranData);

  return matapelajaran;
};

// const putMatapelajaranById = async (Id, matapelajaranData) => {
//   const matapelajaran = await patchMatapelajaranById(id, matapelajaranData);

//   return matapelajaranData;
// };

module.exports = {
  getAllMatapelajarans,
  getMatapelajaranById,
  createMatapelajaran,
  deleteMatapelajaranById,
  editMatapelajaranById,
};
