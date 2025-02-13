// Layer untuk handle request dan respone serta
// handle validasi body
const express = require("express");
const prisma = require("../db");

const { getAllHasilujians, getHasilujianById, createHasilujian, deleteHasilujianById, editHasilujianById } = require("../services/hasilujian.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const hasilujians = await getAllHasilujians(); //menampilkan semua data hasilujian

  res.send(hasilujians);
});

router.get("/:id", async (req, res) => {
  try {
    const hasilujianId = parseInt(req.params.id);
    const hasilujian = await getHasilujianById(parseInt(hasilujianId));

    res.send(hasilujian);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newHasilujianData = req.body;

    const hasilujian = await createHasilujian(newHasilujianData);

    res.send({
      data: hasilujian,
      message: "Berhasil menambahkan Hasil Ujian",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const hasilujianId = req.params.id;

    await deleteHasilujianById(parseInt(hasilujianId));

    res.send("Hasil Ujian berhasil dihapus");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const hasilujianId = req.params.id;
  const hasilujianData = req.body;

  if (!(hasilujianData.id_siswa && hasilujianData.id_ujian && hasilujianData.nilai)) {
    return res.status(400).send("Tidak boleh ada data yang kosong");
  }

  const hasilujian = await editHasilujianById(parseInt(hasilujianId), hasilujianData);

  res.send({
    data: hasilujian,
    message: "Berhasil mengubah Hasil Ujian",
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const hasilujianId = req.params.id;
    const hasilujianData = req.body;

    const hasilujian = await editHasilujianById(parseInt(hasilujianId), hasilujianData);

    res.send({
      data: hasilujian,
      message: "Berhasil mengedit Hasil Ujian",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
