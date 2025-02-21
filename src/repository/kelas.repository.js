// Berkomunikasi dengan database

const prisma = require("../db");

const findKelass = async () => {
  const kelass = await prisma.kelas.findMany(); // pastikan 'kelas' sesuai dengan nama model di schema

  return kelass;
};

const findKelasById = async (id) => {
  const kelas = await prisma.kelas.findUnique({
    where: {
      id_kelas: id,
    },
  });

  return kelas;
};

const findKelasByKode = async (kode_kelas) => {
  return await prisma.kelas.findFirst({
    where: { kode_kelas },
    include: { siswa: true }, // Pastikan relasi siswa di-include jika diperlukan
  });
};

// const findkelasByNama = async (nama_kelas) => {
//   const kelas = await prisma.kelas.findFirst({
//     where: {
//       nama_kelas,
//     },
//   });

//   return kelas;
// };

const insertKelas = async (kelasData) => {
  const kelas = await prisma.kelas.create({
    data: {
      nama_kelas: kelasData.nama_kelas,
      kode_kelas: kelasData.kode_kelas,
      id_guru: kelasData.id_guru,
    },
  });

  return kelas;
};

const deleteKelas = async (id) => {
  await prisma.kelas.delete({
    where: {
      id_kelas: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editKelas = async (id, kelasData) => {
  const kelas = await prisma.kelas.update({
    where: {
      id_kelas: parseInt(id),
    },
    data: {
      nama_kelas: kelasData.nama_kelas,
      kode_kelas: kelasData.kode_kelas,
      id_guru: kelasData.id_guru,
    },
  });

  return kelas;
};

const addSiswaToKelas = async (id_kelas, id_siswa) => {
  return await prisma.kelas.update({
    where: { id_kelas },
    data: {
      siswa: { connect: { id_siswa } }, // ✅ Menghubungkan siswa ke kelas
    },
  });
};

module.exports = {
  findKelass,
  findKelasById,
  insertKelas,
  deleteKelas,
  editKelas,
  addSiswaToKelas,
  findKelasByKode,
  //   findKelasByNama,
};
