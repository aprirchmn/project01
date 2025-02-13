// Layer untuk handle request dan respone serta
// handle validasi body
const express = require("express");
const prisma = require("../db");

const { getAllSoalmultiples, getSoalmultipleById, createSoalmultiple, deleteSoalmultipleById, editSoalmultipleById } = require("../services/soalmultiple.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const soalmultiples = await getAllSoalmultiples(); //menampilkan semua data soalmultiple

  res.send(soalmultiples);
});

router.get("/:id", async (req, res) => {
  try {
    const soalmultipleId = parseInt(req.params.id);
    const soalmultiple = await getSoalmultipleById(parseInt(soalmultipleId));

    res.send(soalmultiple);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newSoalmultipleData = req.body;

    const soalmultiple = await createSoalmultiple(newSoalmultipleData);

    res.send({
      data: soalmultiple,
      message: "Berhasil menambahkan Soal Multiple",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const soalmultipleId = req.params.id;

    await deleteSoalmultipleById(parseInt(soalmultipleId));

    res.send("Soal multiple berhasil dihapus");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const soalmultipleId = req.params.id;
  const soalmultipleData = req.body;

  if (
    !(
      soalmultipleData.pertanyaan &&
      soalmultipleData.pilihan_a &&
      soalmultipleData.pilihan_b &&
      soalmultipleData.pilihan_c &&
      soalmultipleData.pilihan_d &&
      soalmultipleData.pilihan_e &&
      soalmultipleData.kunci_jawaban &&
      soalmultipleData.bobot
    )
  ) {
    return res.status(400).send("Tidak boleh ada data yang kosong");
  }

  const soalmultiple = await editSoalmultipleById(parseInt(soalmultipleId), soalmultipleData);

  res.send({
    data: soalmultiple,
    message: "Berhasil mengubah Soal multiple",
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const soalmultipleId = req.params.id;
    const soalmultipleData = req.body;

    const soalmultiple = await editSoalmultipleById(parseInt(soalmultipleId), soalmultipleData);

    res.send({
      data: soalmultiple,
      message: "Berhasil mengedit Soal Multiple",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
