// Layer untuk handle request dan respone serta
// handle validasi body
const express = require("express");
const prisma = require("../db");

const { getAllMatapelajarans, getMatapelajaranById, createMatapelajaran, deleteMatapelajaranById, editMatapelajaranById } = require("../services/matapelajaran.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const matapelajarans = await getAllMatapelajarans(); //menampilkan semua data matapelajaran

  res.send(matapelajarans);
});

router.get("/:id", async (req, res) => {
  try {
    const matapelajaranId = parseInt(req.params.id);
    const matapelajaran = await getMatapelajaranById(parseInt(matapelajaranId));

    res.send(matapelajaran);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newMatapelajaranData = req.body;

    const matapelajaran = await createMatapelajaran(newMatapelajaranData);

    res.send({
      data: matapelajaran,
      message: "Berhasil menambahkan Mata Pelajaran",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const matapelajaranId = req.params.id;

    await deleteMatapelajaranById(parseInt(matapelajaranId));

    res.send("Mata Pelajaran berhasil dihapus");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const matapelajaranId = req.params.id;
  const matapelajaranData = req.body;

  if (!(matapelajaranData.nama_mata_pelajaran && matapelajaranData.id_guru)) {
    return res.status(400).send("Tidak boleh ada data yang kosong");
  }

  const matapelajaran = await editMatapelajaranById(parseInt(matapelajaranId), matapelajaranData);

  res.send({
    data: matapelajaran,
    message: "Berhasil mengubah Mata Pelajaran",
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const matapelajaranId = req.params.id;
    const matapelajaranData = req.body;

    const matapelajaran = await editMatapelajaranById(parseInt(matapelajaranId), matapelajaranData);

    res.send({
      data: matapelajaran,
      message: "Berhasil mengedit Mata Pelajaran",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
