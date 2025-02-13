// Berkomunikasi dengan database

const prisma = require("../db");

const findHasilujians = async () => {
  const hasilujians = await prisma.hasil_ujian.findMany();

  return hasilujians;
};

const findHasilujianById = async (id) => {
  const hasilujian = await prisma.hasil_ujian.findUnique({
    where: {
      id_hasil_ujian: id,
    },
  });

  return hasilujian;
};

// const findHasilujianByNama = async (nama_hasilujian) => {
//   const hasilujian = await prisma.hasilujian.findFirst({
//     where: {
//       nama_hasilujian,
//     },
//   });

//   return hasilujian;
// };

const insertHasilujian = async (hasil_ujianData) => {
  const hasilujian = await prisma.hasil_ujian.create({
    data: {
      id_siswa: hasil_ujianData.id_siswa,
      id_ujian: hasil_ujianData.id_ujian,
      nilai: hasil_ujianData.nilai,
    },
  });

  return hasilujian;
};

const deleteHasilujian = async (id) => {
  await prisma.hasil_ujian.delete({
    where: {
      id_hasil_ujian: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editHasilujian = async (id, hasil_ujianData) => {
  const hasilujian = await prisma.hasil_ujian.update({
    where: {
      id_hasil_ujian: parseInt(id),
    },
    data: {
      id_ujian: hasil_ujianData.id_ujian,
      id_siswa: hasil_ujianData.id_siswa,
      nilai: hasil_ujianData.nilai,
    },
  });

  return hasilujian;
};

module.exports = {
  findHasilujians,
  findHasilujianById,
  insertHasilujian,
  deleteHasilujian,
  editHasilujian,
  //   findHasilujianByNama,
};
