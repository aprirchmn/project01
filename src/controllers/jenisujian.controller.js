// Layer untuk handle request dan respone serta
// handle validasi body
const express = require("express");
const prisma = require("../db");

const { getAllJenisujians, getJenisujianById, createJenisujian, deleteJenisujianById, editJenisujianById } = require("../services/jenisujian.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const jenisujians = await getAllJenisujians(); //menampilkan semua data jenisujian

  res.send(jenisujians);
});

router.get("/:id", async (req, res) => {
  try {
    const jenisujianId = parseInt(req.params.id);
    const jenisujian = await getJenisujianById(parseInt(jenisujianId));

    res.send(jenisujian);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newJenisujianData = req.body;

    const jenisujian = await createJenisujian(newJenisujianData);

    res.send({
      data: jenisujian,
      message: "Berhasil menambahkan Jenis Ujian",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const jenisujianId = req.params.id;

    await deleteJenisujianById(parseInt(jenisujianId));

    res.send("Jenis Ujian berhasil dihapus");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const jenisujianId = req.params.id;
  const jenisujianData = req.body;

  if (!jenisujianData.jenis_ujian) {
    return res.status(400).send("Tidak boleh ada data yang kosong");
  }

  const jenisujian = await editJenisujianById(parseInt(jenisujianId), jenisujianData);

  res.send({
    data: jenisujian,
    message: "Berhasil mengubah Jenisujian",
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const jenisujianId = req.params.id;
    const jenisujianData = req.body;

    const jenisujian = await editJenisujianById(parseInt(jenisujianId), jenisujianData);

    res.send({
      data: jenisujian,
      message: "Berhasil mengedit Jenisujian",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
