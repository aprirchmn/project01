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

// ✅ Menambahkan fungsi saveImportedData untuk menyimpan data impor
const saveImportedData = async (data) => {
  try {
    // Simpan data ke database
    await prisma.siswa.createMany({
      data: data.map((siswa) => ({
        nama_siswa: siswa.nama_siswa,
        nis: siswa.nis,
        password: siswa.nis.toString(),
      })),
      skipDuplicates: true, // Hindari duplikasi
    });

    // Ambil kembali data yang baru dimasukkan berdasarkan NIS
    const savedData = await prisma.siswa.findMany({
      where: {
        nis: {
          in: data.map((siswa) => siswa.nis),
        },
      },
    });

    return savedData; // Pastikan mengembalikan daftar siswa
  } catch (error) {
    console.error("❌ Gagal menyimpan data:", error);
    throw new Error("Gagal menyimpan data ke database");
  }
};

module.exports = {
  findSiswas,
  findSiswaById,
  insertSiswa,
  deleteSiswa,
  editSiswa,
  saveImportedData,
  //   findSiswaByNama,
};
