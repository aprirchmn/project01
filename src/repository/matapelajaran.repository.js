// Berkomunikasi dengan database

const prisma = require("../db");

const findMatapelajarans = async () => {
  const matapelajarans = await prisma.mata_pelajaran.findMany();

  return matapelajarans;
};

const findMatapelajaranById = async (id) => {
  const matapelajaran = await prisma.mata_pelajaran.findUnique({
    where: {
      id_mata_pelajaran: id,
    },
  });

  return matapelajaran;
};

// const findMatapelajaranByNama = async (nama_matapelajaran) => {
//   const matapelajaran = await prisma.matapelajaran.findFirst({
//     where: {
//       nama_matapelajaran,
//     },
//   });

//   return matapelajaran;
// };

const insertMatapelajaran = async (mata_pelajaranData) => {
  const matapelajaran = await prisma.mata_pelajaran.create({
    data: {
      id_guru: mata_pelajaranData.id_guru,
      nama_mata_pelajaran: mata_pelajaranData.nama_mata_pelajaran,
    },
  });

  return matapelajaran;
};

const deleteMatapelajaran = async (id) => {
  await prisma.mata_pelajaran.delete({
    where: {
      id_mata_pelajaran: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editMatapelajaran = async (id, mata_pelajaranData) => {
  const matapelajaran = await prisma.mata_pelajaran.update({
    where: {
      id_mata_pelajaran: parseInt(id),
    },
    data: {
      nama_mata_pelajaran: mata_pelajaranData.nama_mata_pelajaran,
      id_guru: mata_pelajaranData.id_guru,
    },
  });

  return matapelajaran;
};

module.exports = {
  findMatapelajarans,
  findMatapelajaranById,
  insertMatapelajaran,
  deleteMatapelajaran,
  editMatapelajaran,
  //   findMatapelajaranByNama,
};
