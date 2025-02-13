const express = require("express");
const siswaController = require("../controllers/siswa.controller");
const { verifyToken, siswaOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, siswaOnly, siswaController.getAll); // ✅ GET All Siswa
router.get("/:id", verifyToken, siswaOnly, siswaController.getById); // ✅ GET by ID
router.post("/", verifyToken, siswaOnly, siswaController.create); // ✅ POST (Tambah data siswa)
router.put("/:id", verifyToken, siswaOnly, siswaController.update); // ✅ PUT (Update siswa)
router.patch("/:id", verifyToken, siswaOnly, siswaController.patch); // ✅ PATCH (Patch siswa)
router.delete("/:id", verifyToken, siswaOnly, siswaController.delete); // ✅ DELETE (Hapus siswa)

module.exports = router;
