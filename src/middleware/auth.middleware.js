const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  req.headers.authorization = req.headers.authorization || req.get("Authorization");

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Akses ditolak, token tidak ada" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Tidak perlu return di sini
  } catch (error) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

// 🔹 Middleware untuk Guru
exports.guruOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Anda harus login!" });
  }

  if (req.user.role !== "guru") {
    return res.status(403).json({ message: "Akses terlarang, hanya untuk guru!" });
  }

  next();
};

// 🔹 Middleware untuk Siswa
exports.siswaOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Anda harus login!" });
  }

  if (req.user.role !== "siswa") {
    return res.status(403).json({ message: "Akses terlarang, hanya untuk siswa!" });
  }

  next();
};
