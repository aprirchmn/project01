// Layer untuk handle request dan respone serta
// handle validasi body
const express = require("express");
const prisma = require("../db");

const { getAllUjians, getUjianById, createUjian, deleteUjianById, editUjianById } = require("../services/ujian.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const ujians = await getAllUjians(); //menampilkan semua data Ujian

  res.send(ujians);
});

router.get("/:id", async (req, res) => {
  try {
    const ujianId = parseInt(req.params.id);
    const ujian = await getUjianById(parseInt(ujianId));

    res.send(ujian);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newUjianData = req.body;

    const ujian = await createUjian(newUjianData);

    res.send({
      data: ujian,
      message: "Berhasil menambahkan Ujian",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ujianId = req.params.id;

    await deleteUjianById(parseInt(ujianId));

    res.send("Ujian berhasil dihapus");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const ujianId = req.params.id;
  const ujianData = req.body;

  if (!(ujianData.id_mata_pelajaran && ujianData.id_guru && ujianData.id_kelas && ujianData.id_jenis_ujian && ujianData.tanggal_ujian && ujianData.durasi_ujian && ujianData.status_ujian && ujianData.id_siswa && ujianData.nama_ujian)) {
    return res.status(400).send("Tidak boleh ada data yang kosong");
  }

  const ujian = await editUjianById(parseInt(ujianId), ujianData);

  res.send({
    data: ujian,
    message: "Berhasil mengubah  Ujian",
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const ujianId = req.params.id;
    const ujianData = req.body;

    const ujian = await editUjianById(parseInt(ujianId), ujianData);

    res.send({
      data: ujian,
      message: "Berhasil mengedit Ujian",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
