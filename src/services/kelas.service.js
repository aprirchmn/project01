// untuk handle business logic

const prisma = require("../db");
const { findKelass, findKelasById, insertKelas, deleteKelas, editKelas, findKelasByKode, addSiswaToKelas } = require("../repository/kelas.repository");
const crypto = require("crypto");

const generateKodeKelas = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // Contoh: "A1B2C3"
};

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
  const newkelasDataWithKode = {
    ...newKelasData,
    kode_kelas: generateKodeKelas(), // ✅ Tambahkan kode kelas sebelum insert
  };
  // const findKelas = await findKelasByNama(newKelasData);

  // if (findKelas) {
  //   throw new Error("Nama harus unik");
  // }

  const kelas = await insertKelas(newkelasDataWithKode);

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

const joinKelasByKode = async (kode_kelas, id_siswa) => {
  const kelas = await findKelasByKode(kode_kelas);
  if (!kelas) {
    throw new Error("Kode kelas tidak ditemukan");
  }

  // ✅ Cek apakah siswa sudah ada di dalam kelas
  const siswaSudahAda = kelas.siswa.some((siswa) => siswa.id_siswa === id_siswa);
  if (siswaSudahAda) {
    throw new Error("Siswa sudah tergabung dalam kelas ini");
  }

  return await addSiswaToKelas(kelas.id_kelas, id_siswa);
};

module.exports = {
  getAllKelass,
  getKelasById,
  createKelas,
  deleteKelasById,
  editKelasById,
  joinKelasByKode,
};
