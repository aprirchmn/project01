// untuk handle business logic

const prisma = require("../db");
const { findSiswas, findSiswaById, insertSiswa, deleteSiswa, editSiswa } = require("../repository/siswa.repository");

const getAllSiswas = async () => {
  const siswas = await findSiswas(); //menampilkan semua data siswa

  return siswas;
};

const getSiswaById = async (id) => {
  const siswa = await findSiswaById(id); //menampilkan semua data siswa

  if (!siswa) {
    throw Error("Data Murid tidak ditemukan");
  }

  return siswa;
};

const createSiswa = async (newSiswaData) => {
  // const findSiswa = await findSiswaByNama(newSiswaData);

  // if (findSiswa) {
  //   throw new Error("Nama harus unik");
  // }

  const siswa = await insertSiswa(newSiswaData);

  return siswa;
};

const deleteSiswaById = async (id) => {
  await getSiswaById(id);

  await deleteSiswa(id);
};

const editSiswaById = async (id, siswaData) => {
  await getSiswaById(id);

  const siswa = await editSiswa(id, siswaData);

  return siswa;
};

// const putSiswaById = async (Id, siswaData) => {
//   const siswa = await patchSiswaById(id, siswaData);

//   return siswaData;
// };

module.exports = {
  getAllSiswas,
  getSiswaById,
  createSiswa,
  deleteSiswaById,
  editSiswaById,
};
