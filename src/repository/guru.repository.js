// Berkomunikasi dengan database

const prisma = require("../db");

const findGurus = async () => {
  const gurus = await prisma.guru.findMany(); // pastikan 'guru' sesuai dengan nama model di schema

  return gurus;
};

const findGuruById = async (id) => {
  const guru = await prisma.guru.findUnique({
    where: {
      id_guru: id,
    },
  });

  return guru;
};

// const findGuruByNama = async (nama_guru) => {
//   const guru = await prisma.guru.findFirst({
//     where: {
//       nama_guru,
//     },
//   });

//   return guru;
// };

const insertGuru = async (guruData) => {
  const guru = await prisma.guru.create({
    data: {
      nama_guru: guruData.nama_guru,
      nip: guruData.nip,
      password: guruData.password,
    },
  });

  return guru;
};

const deleteGuru = async (id) => {
  await prisma.guru.delete({
    where: {
      id_guru: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editGuru = async (id, guruData) => {
  const guru = await prisma.guru.update({
    where: {
      id_guru: parseInt(id),
    },
    data: {
      nama_guru: guruData.nama_guru,
      nip: guruData.nip,
      password: guruData.password,
    },
  });

  return guru;
};

module.exports = {
  findGurus,
  findGuruById,
  insertGuru,
  deleteGuru,
  editGuru,
  //   findGuruByNama,
};
