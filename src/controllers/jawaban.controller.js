// Layer untuk handle request dan respone serta
// handle validasi body
const express = require("express");
const prisma = require("../db");

const { getAllJawabans, getJawabanById, createJawaban, deleteJawabanById, editJawabanById } = require("../services/jawaban.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const jawabans = await getAllJawabans(); //menampilkan semua data jawaban

  res.send(jawabans);
});

router.get("/:id", async (req, res) => {
  try {
    const jawabanId = parseInt(req.params.id);
    const jawaban = await getJawabanById(parseInt(jawabanId));

    res.send(jawaban);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newJawabanData = req.body;

    const jawaban = await createJawaban(newJawabanData);

    res.send({
      data: jawaban,
      message: "Berhasil menambahkan Jawaban",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const jawabanId = req.params.id;

    await deleteJawabanById(parseInt(jawabanId));

    res.send("Jawaban berhasil dihapus");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// router.put("/:id", async (req, res) => {
//   const jawabanId = req.params.id;
//   const jawabanData = req.body;

//   if (!(jawabanData.id_soal_multiple || jawabanData.id_soal_essay || (jawabanData.id_hasil_ujian && jawabanData.id_ujian && jawabanData.id_siswa && jawabanData.jawaban_murid && jawabanData.skor))) {
//     return res.status(400).send("Tidak boleh ada data yang kosong");
//   }

//   const jawaban = await editJawabanById(parseInt(jawabanId), jawabanData);

//   res.send({
//     data: jawaban,
//     message: "Berhasil mengubah data Jawaban",
//   });
// });

router.put("/:id", async (req, res) => {
  const jawabanId = req.params.id;
  const jawabanData = req.body;

  // Pastikan setidaknya salah satu dari id_soal_multiple atau id_soal_essay terisi
  const isValidSoal = jawabanData.id_soal_multiple !== undefined || jawabanData.id_soal_essay !== undefined;

  // Pastikan semua field wajib diisi (kecuali soal yang bisa opsional)
  const isValidData = jawabanData.id_hasil_ujian && jawabanData.id_ujian && jawabanData.id_siswa && jawabanData.jawaban_murid && jawabanData.skor !== undefined; // Cek eksplisit skor

  if (!isValidSoal || !isValidData) {
    return res.status(400).send("Tidak boleh ada data yang kosong");
  }

  try {
    const jawaban = await editJawabanById(parseInt(jawabanId), jawabanData);
    res.send({
      data: jawaban,
      message: "Berhasil mengubah data Jawaban",
    });
  } catch (error) {
    res.status(500).send("Terjadi kesalahan saat memperbarui data Jawaban");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const jawabanId = req.params.id;
    const jawabanData = req.body;

    const jawaban = await editJawabanById(parseInt(jawabanId), jawabanData);

    res.send({
      data: jawaban,
      message: "Berhasil mengedit Jawaban",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
