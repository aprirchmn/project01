const prisma = require("../db");

const findSoalessays = async () => {
  const soalessays = await prisma.soal_essay.findMany();
  return soalessays;
};

const findSoalessayById = async (id) => {
  const soalessay = await prisma.soal_essay.findUnique({
    where: {
      id_soal_essay: id,
    },
  });
  return soalessay;
};

const insertSoalessay = async (soal_essayData) => {
  const soalessay = await prisma.soal_essay.create({
    data: {
      id_mata_pelajaran: soal_essayData.id_mata_pelajaran,
      id_jenis_ujian: soal_essayData.id_jenis_ujian,
      pertanyaan: soal_essayData.pertanyaan,
      kunci_jawaban: soal_essayData.kunci_jawaban,
      bobot: soal_essayData.bobot,
    },
  });

  return soalessay;
};

const editSoalessay = async (id, soal_essayData) => {
  const soalessay = await prisma.soal_essay.update({
    where: {
      id_soal_essay: parseInt(id),
    },
    data: {
      id_mata_pelajaran: soal_essayData.id_mata_pelajaran,
      id_jenis_ujian: soal_essayData.id_jenis_ujian,
      pertanyaan: soal_essayData.pertanyaan,
      kunci_jawaban: soal_essayData.kunci_jawaban,
      bobot: soal_essayData.bobot,
    },
  });

  return soalessay;
};

const deleteSoalessay = async (id) => {
  await prisma.soal_essay.delete({
    where: {
      id_soal_essay: id,
    },
  });
};

module.exports = {
  findSoalessays,
  findSoalessayById,
  insertSoalessay,
  editSoalessay,
  deleteSoalessay,
};
