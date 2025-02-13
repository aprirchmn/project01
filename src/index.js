const express = require("express");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json()); //untuk bisa membaca body

app.get("/api", (req, res) => {
  res.send("Project Aplikasi CBT berbasis AES");
});

// const authController = require("./auth/auth.controller");

// app.use("/", authController); // Menambahkan route login

// Logout

const siswaController = require("./controllers/siswa.controller");

app.use("/siswas", siswaController);

const guruController = require("./controllers/guru.controller");

app.use("/gurus", guruController);

const kelasController = require("./controllers/kelas.controller");

app.use("/kelass", kelasController);

const jenisujianController = require("./controllers/jenisujian.controller");

app.use("/jenisujians", jenisujianController);

const matapelajaranController = require("./controllers/matapelajaran.controller");

app.use("/matapelajarans", matapelajaranController);

const soalmultipleController = require("./controllers/soalmultiple.controller");

app.use("/soalmultiples", soalmultipleController);

const ujianController = require("./controllers/ujian.controller");

app.use("/ujians", ujianController);

const jawabanController = require("./controllers/jawaban.controller");

app.use("/jawabans", jawabanController);

const hasilujianController = require("./controllers/hasilujian.controller");

app.use("/hasilujians", hasilujianController);

app.listen(PORT, () => {
  console.log("Express API running in port: " + PORT);
});
