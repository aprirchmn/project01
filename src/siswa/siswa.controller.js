// Layer untuk handle request dan respone serta
// handle validasi body
const express = require("express");
const prisma = require("../db");

const { getAllSiswas, getSiswaById, createSiswa, deleteSiswaById, editSiswaById } = require("./siswa.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const siswas = await getAllSiswas(); //menampilkan semua data siswa

  res.send(siswas);
});

router.get("/:id", async (req, res) => {
  try {
    const siswaId = parseInt(req.params.id);
    const siswa = await getSiswaById(parseInt(siswaId));

    res.send(siswa);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newSiswaData = req.body;

    const siswa = await createSiswa(newSiswaData);

    res.send({
      data: siswa,
      message: "Berhasil menambahkan Murid",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const siswaId = req.params.id;

    await deleteSiswaById(parseInt(siswaId));

    res.send("Akun Murid berhasil dihapus");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const siswaId = req.params.id;
  const siswaData = req.body;

  if (!(siswaData.nama_siswa && siswaData.nis && siswaData.password)) {
    return res.status(400).send("Tidak boleh ada data yang kosong");
  }

  const siswa = await editSiswaById(parseInt(siswaId), siswaData);

  res.send({
    data: siswa,
    message: "Berhasil mengubah data Murid",
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const siswaId = req.params.id;
    const siswaData = req.body;

    const siswa = await editSiswaById(parseInt(siswaId), siswaData);

    res.send({
      data: siswa,
      message: "Berhasil mengedit data Murid",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
