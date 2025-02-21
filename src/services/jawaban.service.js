// untuk handle business logic

const prisma = require("../db");
const { findJawabans, findJawabanById, insertJawaban, deleteJawaban, editJawaban } = require("../repository/jawaban.repository");

const getAllJawabans = async () => {
  const jawabans = await findJawabans(); //menampilkan semua data Jawaban

  return jawabans;
};

const getJawabanById = async (id) => {
  const jawaban = await findJawabanById(id); //menampilkan semua data jawaban

  if (!jawaban) {
    throw Error("Jawaban tidak ditemukan");
  }

  return jawaban;
};

const createJawaban = async (newJawabanData) => {
  let skor = 0; // Default jika jawaban salah
  let message = "Jawaban Salah"; // Default message

  if (newJawabanData.id_soal_multiple) {
    // Ambil data soal multiple choice berdasarkan ID
    const soal = await prisma.soal_multiple.findUnique({
      where: { id_soal_multiple: newJawabanData.id_soal_multiple },
    });

    if (!soal) {
      throw new Error("Soal tidak ditemukan");
    }

    // Cek apakah jawaban_murid sama dengan kunci_jawaban
    if (newJawabanData.jawaban_murid === soal.kunci_jawaban) {
      skor = soal.bobot; // Tambahkan skor sesuai bobot
      message = "Jawaban Benar"; // Jika jawaban benar, ubah message
    }
  }

  // Simpan jawaban dengan skor yang telah diperhitungkan
  const jawaban = await insertJawaban({
    ...newJawabanData,
    skor, // Menyimpan skor hasil perhitungan
  });

  return { ...jawaban, message }; // Tambahkan message ke dalam response
};

const deleteJawabanById = async (id) => {
  await getJawabanById(id);

  await deleteJawaban(id);
};

const editJawabanById = async (id, jawabanData) => {
  await getJawabanById(id);

  const jawaban = await editJawaban(id, jawabanData);

  return jawaban;
};

// const putJawabanById = async (Id, jawabanData) => {
//   const jawaban = await patchjawabanById(id, jawabanData);

//   return jawabanData;
// };

module.exports = {
  getAllJawabans,
  getJawabanById,
  createJawaban,
  deleteJawabanById,
  editJawabanById,
};
