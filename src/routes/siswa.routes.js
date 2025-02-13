const express = require("express");
const siswaController = require("../controllers/siswa.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, siswaController.getAll);
router.get("/:id", verifyToken, siswaController.getById);
router.post("/", verifyToken, siswaController.create);
router.put("/:id", verifyToken, siswaController.update);
router.delete("/:id", verifyToken, siswaController.delete);
router.patch("/:id", verifyToken, siswaController.patch);

module.exports = router;
