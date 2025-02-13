// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const secretKey = process.env.JWT_SECRET;

// // Simpan token yang di-blacklist (gunakan database atau Redis di produksi)
// const blacklistedTokens = new Set();

// const isTokenBlacklisted = (token) => {
//   return blacklistedTokens.has(token);
// };

// const blacklistToken = (token) => {
//   blacklistedTokens.add(token);
// };

// // Middleware untuk verifikasi token
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).send("Token tidak ditemukan");
//   }

//   if (isTokenBlacklisted(token)) {
//     return res.status(401).send("Token tidak valid Sudah Logout");
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).send("Token tidak valid");
//   }
// };

// // Middleware untuk cek role
// const authorizeRole = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       return res.status(403).send("Anda tidak memiliki akses");
//     }
//     next();
//   };
// };

// module.exports = { verifyToken, authorizeRole, blacklistToken };
