const jwt = require("jsonwebtoken");
const prisma = require("../db");

require("dotenv").config();

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

exports.isGuruOrAdmin = (req, res, next) => {
  if (req.user.role !== "GURU" && req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

exports.isSiswaOrAdmin = (req, res, next) => {
  if (req.user.role !== "SISWA" && req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
