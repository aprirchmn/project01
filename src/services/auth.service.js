// const jwt = require("jsonwebtoken");
// const prisma = require("../db");

// const secretKey = "computerbasedtestaes";

// // Fungsi untuk generate token
// const generateToken = (user, role) => {
//   return jwt.sign({ id: role === "Guru" ? user.id_guru : user.id_siswa, role }, secretKey, { expiresIn: "1h" });
// };

// // Fungsi login Guru
// const loginGuru = async (nip, password) => {
//   const parsedNip = parseInt(nip, 10);

//   const guru = await prisma.guru.findUnique({
//     where: {
//       nip: parsedNip,
//     },
//   });

//   if (!guru) {
//     throw new Error("NIP atau password salah");
//   }

//   // Simple direct password comparison
//   if (password !== guru.password) {
//     throw new Error("Password salah");
//   }

//   const token = generateToken(guru, "Guru");

//   return {
//     token,
//     nama_guru: guru.nama_guru,
//     nip: guru.nip,
//     password: guru.password,
//     message: "Login Guru berhasil",
//   };
// };

// // Fungsi login Siswa
// const loginSiswa = async (nis, password) => {
//   const siswa = await prisma.siswa.findUnique({
//     where: { nis },
//   });

//   if (!siswa) {
//     throw new Error("NIS atau password salah");
//   }

//   // Simple direct password comparison
//   if (password !== siswa.password) {
//     throw new Error("Password salah");
//   }

//   const token = generateToken(siswa, "Siswa");

//   return {
//     token,
//     nama_siswa: siswa.nama_siswa,
//     nis: siswa.nis,
//     password: siswa.password,
//     message: "Login Siswa berhasil",
//   };
// };

// // Fungsi logout
// const logout = (token) => {
//   if (token) {
//     tokenBlacklist.add(token);
//   }
//   return { message: "Logout berhasil" };
// };

// // Fungsi untuk cek apakah token sudah di-blacklist
// const isTokenBlacklisted = (token) => {
//   return tokenBlacklist.has(token);
// };

// module.exports = { loginGuru, loginSiswa, logout, isTokenBlacklisted };
