// Berkomunikasi dengan database

const prisma = require("../db");

const findSoalmultiples = async () => {
  const soalmultiples = await prisma.soal_multiple.findMany();

  return soalmultiples;
};

const findSoalmultipleById = async (id) => {
  const soalmultiple = await prisma.soal_multiple.findUnique({
    where: {
      id_soal_multiple: id,
    },
  });

  return soalmultiple;
};

// const findSoalmultipleByNama = async (nama_soalmultiple) => {
//   const soalmultiple = await prisma.soalmultiple.findFirst({
//     where: {
//       nama_soalmultiple,
//     },
//   });

//   return soalmultiple;
// };

const insertSoalmultiple = async (soal_multipleData) => {
  const soalmultiple = await prisma.soal_multiple.create({
    data: {
      id_mata_pelajaran: soal_multipleData.id_mata_pelajaran,
      id_jenis_ujian: soal_multipleData.id_jenis_ujian,
      pertanyaan: soal_multipleData.pertanyaan,
      pilihan_a: soal_multipleData.pilihan_a,
      pilihan_b: soal_multipleData.pilihan_b,
      pilihan_c: soal_multipleData.pilihan_c,
      pilihan_d: soal_multipleData.pilihan_d,
      pilihan_e: soal_multipleData.pilihan_e,
      kunci_jawaban: soal_multipleData.kunci_jawaban,
      bobot: soal_multipleData.bobot,
      //   jenis_multiple: {
      //     connect: { id_jenis_multiple: soal_multipleData.jenis_multiple }, // connect dengan id_mata_pelajaran
      //   },
      //   mata_pelajaran: {
      //     connect: { id_mata_pelajaran: soal_multipleData.mata_pelajaran }, // connect dengan id_mata_pelajaran
      //   },
    },
  });

  return soalmultiple;
};

const deleteSoalmultiple = async (id) => {
  await prisma.soal_multiple.delete({
    where: {
      id_soal_multiple: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editSoalmultiple = async (id, soal_multipleData) => {
  const soalmultiple = await prisma.soal_multiple.update({
    where: {
      id_soal_multiple: parseInt(id),
    },
    data: {
      id_mata_pelajaran: soal_multipleData.id_mata_pelajaran,
      id_guru: soal_multipleData.id_guru,
      pertanyaan: soal_multipleData.pertanyaan,
      pilihan_a: soal_multipleData.pilihan_a,
      pilihan_b: soal_multipleData.pilihan_b,
      pilihan_c: soal_multipleData.pilihan_c,
      pilihan_d: soal_multipleData.pilihan_d,
      pilihan_e: soal_multipleData.pilihan_e,
      kunci_jawaban: soal_multipleData.kunci_jawaban,
      bobot: soal_multipleData.bobot,
    },
  });

  return soalmultiple;
};

module.exports = {
  findSoalmultiples,
  findSoalmultipleById,
  insertSoalmultiple,
  deleteSoalmultiple,
  editSoalmultiple,
  //   findSoalmultipleByNama,
};
