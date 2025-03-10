// Berkomunikasi dengan database

const prisma = require("../db");

const findUjians = async () => {
  const ujians = await prisma.ujian.findMany({
    include: {
      soal_essays: true,
      soal_multiples: true,
    },
  });

  return ujians;
};

const findUjianById = async (id) => {
  const ujian = await prisma.ujian.findUnique({
    where: { id_ujian: id },
    include: {
      soal_essays: true,
      soal_multiples: true,
    },
  });

  return ujian;
};

// const findUjianByNama = async (nama_ujian) => {
//   const ujian = await prisma.ujian.findFirst({
//     where: {
//       nama_ujian,
//     },
//   });

//   return ujian;
// };

const insertUjian = async (ujianData) => {
  const ujian = await prisma.ujian.create({
    data: {
      id_mata_pelajaran: ujianData.id_mata_pelajaran,
      id_guru: ujianData.id_guru,
      id_kelas: ujianData.id_kelas,
      id_jenis_ujian: ujianData.id_jenis_ujian,
      tanggal_ujian: ujianData.tanggal_ujian,
      durasi_ujian: ujianData.durasi_ujian,
      deskripsi_ujian: ujianData.deskripsi_ujian,
      status_ujian: ujianData.status_ujian,
      id_siswa: ujianData.id_siswa,
      nama_ujian: ujianData.nama_ujian,
      //   jenis_ujian: {
      //     connect: { id_jenis_ujian: ujianData.jenis_ujian }, // connect dengan id_mata_pelajaran
      //   },
      //   mata_pelajaran: {
      //     connect: { id_mata_pelajaran: ujianData.mata_pelajaran }, // connect dengan id_mata_pelajaran
      //   },
      tipe_ujian: ujianData.tipe_ujian,
      acak_soal: ujianData.acak_soal,
      tampilkan_nilai: ujianData.tampilkan_nilai,
      tampilkan_jawaban: ujianData.tampilkan_jawaban,
      accessCamera: ujianData.accessCamera,
    },
    include: {
      soal_essays: true,
      soal_multiples: true,
    },
  });

  return ujian;
};

const deleteUjian = async (id) => {
  await prisma.ujian.delete({
    where: {
      id_ujian: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editUjian = async (id, ujianData) => {
  const ujian = await prisma.ujian.update({
    where: {
      id_ujian: parseInt(id),
    },
    data: {
      id_mata_pelajaran: ujianData.id_mata_pelajaran,
      id_guru: ujianData.id_guru,
      id_kelas: ujianData.id_kelas,
      id_jenis_ujian: ujianData.id_jenis_ujian,
      tanggal_ujian: ujianData.tanggal_ujian,
      durasi_ujian: ujianData.durasi_ujian,
      deskripsi_ujian: ujianData.deskripsi_ujian,
      status_ujian: ujianData.status_ujian,
      id_siswa: ujianData.id_siswa,
      nama_ujian: ujianData.nama_ujian,
      tipe_ujian: ujianData.tipe_ujian,
      acak_soal: ujianData.acak_soal,
      tampilkan_nilai: ujianData.tampilkan_nilai,
      tampilkan_jawaban: ujianData.tampilkan_jawaban,
      accessCamera: ujianData.accessCamera,
    },
    include: {
      soal_essays: true,
      soal_multiples: true,
    },
  });

  return ujian;
};

module.exports = {
  findUjians,
  findUjianById,
  insertUjian,
  deleteUjian,
  editUjian,
  //   findUjianByNama,
};
