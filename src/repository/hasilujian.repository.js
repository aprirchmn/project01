const prisma = require("../db");

const findHasilujians = async () => {
  return await prisma.hasil_ujian.findMany();
};

const findHasilujianById = async (id) => {
  return await prisma.hasil_ujian.findUnique({
    where: { id_hasil_ujian: id },
  });
};

const insertHasilujian = async (hasil_ujianData) => {
  const hasilujian = await prisma.hasil_ujian.create({
    data: {
      id_siswa: hasil_ujianData.id_siswa,
      id_ujian: hasil_ujianData.id_ujian,
      nilai_multiple: hasil_ujianData.nilai_multiple || 0,
      nilai_essay: hasil_ujianData.nilai_essay || 0,
    },
  });
  return hasilujian;
};

const deleteHasilujian = async (id) => {
  await prisma.hasil_ujian.delete({
    where: { id_hasil_ujian: id },
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
      // Perbarui nilai_multiple dan nilai_essay jika diperlukan:
      nilai_multiple: hasil_ujianData.nilai_multiple,
      nilai_essay: hasil_ujianData.nilai_essay,
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
};
