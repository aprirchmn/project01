// Layer untuk handle request dan respone serta
// handle validasi body
const express = require("express");
const prisma = require("../db");

const { getAllKelass, getKelasById, createKelas, deleteKelasById, editKelasById } = require("../services/kelas.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const kelass = await getAllKelass(); //menampilkan semua data kelas

  res.send(kelass);
});

router.get("/:id", async (req, res) => {
  try {
    const kelasId = parseInt(req.params.id);
    const kelas = await getKelasById(parseInt(kelasId));

    res.send(kelas);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newKelasData = req.body;

    const kelas = await createKelas(newKelasData);

    res.send({
      data: kelas,
      message: "Berhasil menambahkan Kelas",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const kelasId = req.params.id;

    await deleteKelasById(parseInt(kelasId));

    res.send("Akun Kelas berhasil dihapus");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const kelasId = req.params.id;
  const kelasData = req.body;

  if (!(kelasData.nama_kelas && kelasData.kode_kelas && kelasData.id_guru)) {
    return res.status(400).send("Tidak boleh ada data yang kosong");
  }

  const kelas = await editKelasById(parseInt(kelasId), kelasData);

  res.send({
    data: kelas,
    message: "Berhasil mengubah data kelas",
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const kelasId = req.params.id;
    const kelasData = req.body;

    const kelas = await editKelasById(parseInt(kelasId), kelasData);

    res.send({
      data: kelas,
      message: "Berhasil mengedit data Kelas",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
