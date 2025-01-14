const express = require("express");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json()); //untuk bisa membaca body

app.get("/api", (req, res) => {
  res.send("Project Aplikasi CBT berbasis AES");
});

const siswaController = require("./siswa/siswa.controller");

app.use("/siswas", siswaController);

app.listen(PORT, () => {
  console.log("Express API running in port: " + PORT);
});
