// Berkomunikasi dengan database

const prisma = require("../db");

const findJenisujians = async () => {
  const jenisujians = await prisma.jenis_ujian.findMany(); // pastikan 'jenisujian' sesuai dengan nama model di schema

  return jenisujians;
};

const findJenisujianById = async (id) => {
  const jenisujian = await prisma.jenis_ujian.findUnique({
    where: {
      id_jenis_ujian: id,
    },
  });

  return jenisujian;
};

// const findJenisujianByNama = async (nama_jenisujian) => {
//   const jenisujian = await prisma.jenisujian.findFirst({
//     where: {
//       nama_jenisujian,
//     },
//   });

//   return jenisujian;
// };

const insertJenisujian = async (jenis_ujianData) => {
  const jenisujian = await prisma.jenis_ujian.create({
    data: {
      jenis_ujian: jenis_ujianData.jenis_ujian,
    },
  });

  return jenisujian;
};

const deleteJenisujian = async (id) => {
  await prisma.jenis_ujian.delete({
    where: {
      id_jenis_ujian: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editJenisujian = async (id, jenis_ujianData) => {
  const jenisujian = await prisma.jenis_ujian.update({
    where: {
      id_jenis_ujian: parseInt(id),
    },
    data: {
      jenis_ujian: jenis_ujianData.jenis_ujian,
    },
  });

  return jenisujian;
};

module.exports = {
  findJenisujians,
  findJenisujianById,
  insertJenisujian,
  deleteJenisujian,
  editJenisujian,
  //   findJenisujianByNama,
};
