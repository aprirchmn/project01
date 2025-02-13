// const express = require("express");
// const { loginGuru, loginSiswa } = require("./auth.service");
// const { verifyToken } = require("./auth.middleware");
// const router = express.Router();

// // Login Guru
// router.post("/login/guru", async (req, res) => {
//   try {
//     const { nip, password } = req.body;
//     const token = await loginGuru(nip, password);

//     res.send({ token, message: "Login Guru berhasil" });
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// // Login Siswa
// router.post("/login/siswa", async (req, res) => {
//   try {
//     const { nis, password } = req.body;
//     const token = await loginSiswa(nis, password);

//     res.send({ token, message: "Login Siswa berhasil" });
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// // Logout endpoint
// router.post("/logout", verifyToken, (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     const result = logout(token);
//     res.json(result);
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// module.exports = router;
