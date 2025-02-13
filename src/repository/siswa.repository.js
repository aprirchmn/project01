// Berkomunikasi dengan database

const prisma = require("../db");

const findSiswas = async () => {
  const siswas = await prisma.siswa.findMany();

  return siswas;
};

const findSiswaById = async (id) => {
  const siswa = await prisma.siswa.findUnique({
    where: {
      id_siswa: id,
    },
  });

  return siswa;
};

// const findSiswaByNama = async (nama_siswa) => {
//   const siswa = await prisma.siswa.findFirst({
//     where: {
//       nama_siswa,
//     },
//   });

//   return siswa;
// };

const insertSiswa = async (siswaData) => {
  const siswa = await prisma.siswa.create({
    data: {
      nama_siswa: siswaData.nama_siswa,
      nis: siswaData.nis,
      password: siswaData.password,
      id_kelas: siswaData.id_kelas,
    },
  });

  return siswa;
};

const deleteSiswa = async (id) => {
  await prisma.siswa.delete({
    where: {
      id_siswa: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editSiswa = async (id, siswaData) => {
  const siswa = await prisma.siswa.update({
    where: {
      id_siswa: parseInt(id),
    },
    data: {
      nama_siswa: siswaData.nama_siswa,
      nis: siswaData.nis,
      password: siswaData.password,
      id_kelas: siswaData.id_kelas,
    },
  });

  return siswa;
};

module.exports = {
  findSiswas,
  findSiswaById,
  insertSiswa,
  deleteSiswa,
  editSiswa,
  //   findSiswaByNama,
};
