// Berkomunikasi dengan database

const prisma = require("../db");

const findJawabans = async () => {
  const jawabans = await prisma.jawaban.findMany();

  return jawabans;
};

const findJawabanById = async (id) => {
  const jawaban = await prisma.jawaban.findUnique({
    where: {
      id_jawaban: id,
    },
  });

  return jawaban;
};

// const findJawabanByNama = async (nama_jawaban) => {
//   const jawaban = await prisma.jawaban.findFirst({
//     where: {
//       nama_jawaban,
//     },
//   });

//   return jawaban;
// };

const insertJawaban = async (jawabanData) => {
  const jawaban = await prisma.jawaban.create({
    data: {
      id_soal_multiple: jawabanData.id_soal_multiple || null,
      id_soal_essay: jawabanData.id_soal_essay || null,
      id_hasil_ujian: jawabanData.id_hasil_ujian,
      id_ujian: jawabanData.id_ujian,
      id_siswa: jawabanData.id_siswa,
      jawaban_murid: jawabanData.jawaban_murid,
      skor: jawabanData.skor,
    },
  });

  return jawaban;
};

const deleteJawaban = async (id) => {
  await prisma.jawaban.delete({
    where: {
      id_jawaban: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editJawaban = async (id, jawabanData) => {
  const jawaban = await prisma.jawaban.update({
    where: {
      id_jawaban: parseInt(id),
    },
    data: {
      id_soal_multiple: jawabanData.id_soal_multiple || null,
      id_soal_essay: jawabanData.id_soal_essay || null,
      id_hasil_ujian: jawabanData.id_hasil_ujian,
      id_ujian: jawabanData.id_ujian,
      id_siswa: jawabanData.id_siswa,
      jawaban_murid: jawabanData.jawaban_murid,
      skor: jawabanData.skor,
    },
  });

  return jawaban;
};

module.exports = {
  findJawabans,
  findJawabanById,
  insertJawaban,
  deleteJawaban,
  editJawaban,
  //   findJawabanByNama,
};
