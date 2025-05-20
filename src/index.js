const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); //untuk bisa membaca body
app.use(cors());
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.send("Project Aplikasi CBT berbasis AES");
});

const jurusanRoutes = require("./routes/jurusan.routes");
const siswaRoutes = require("./routes/siswa.routes");
const guruRoutes = require("./routes/guru.routes");
const jawabanRoutes = require("./routes/jawaban.routes");
const matapelajaranRoutes = require("./routes/matapelajaran.routes");
const soalmultipleRoutes = require("./routes/soalmultiple.routes");
const ujianRoutes = require("./routes/ujian.routes");
const hasilujianRoutes = require("./routes/hasilujian.routes");
const soalessayRoutes = require("./routes/soalessay.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/jurusan", jurusanRoutes);
app.use("/siswas", siswaRoutes);
app.use("/gurus", guruRoutes);
app.use("/jawabans", jawabanRoutes);
app.use("/matapelajarans", matapelajaranRoutes);
app.use("/soalmultiples", soalmultipleRoutes);
app.use("/ujians", ujianRoutes);
app.use("/hasilujians", hasilujianRoutes);
app.use("/soalessays", soalessayRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Express API running in port: " + PORT);
});
