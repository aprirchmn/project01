// Layer untuk handle request dan respone serta
// handle validasi body
const express = require("express");
const prisma = require("../db");
// const { verifyToken, authorizeRole } = require("../auth/auth.middleware");

const { getAllGurus, getGuruById, createGuru, deleteGuruById, editGuruById } = require("../services/guru.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const gurus = await getAllGurus(); //menampilkan semua data Guru

  res.send(gurus);
});

router.get("/:id", async (req, res) => {
  try {
    const guruId = parseInt(req.params.id);
    const guru = await getGuruById(parseInt(guruId));

    res.send(guru);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newGuruData = req.body;

    const guru = await createGuru(newGuruData);

    res.send({
      data: guru,
      message: "Berhasil menambahkan Guru",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const guruId = req.params.id;

    await deleteGuruById(parseInt(guruId));

    res.send("Akun Guru berhasil dihapus");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const guruId = req.params.id;
  const guruData = req.body;

  if (!(guruData.nama_guru && guruData.nip && guruData.password)) {
    return res.status(400).send("Tidak boleh ada data yang kosong");
  }

  const guru = await editGuruById(parseInt(guruId), guruData);

  res.send({
    data: guru,
    message: "Berhasil mengubah data Guru",
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const guruId = req.params.id;
    const guruData = req.body;

    const guru = await editGuruById(parseInt(guruId), guruData);

    res.send({
      data: guru,
      message: "Berhasil mengedit data Guru",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
