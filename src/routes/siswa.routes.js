const express = require("express");
const siswaController = require("../controllers/siswa.controller");
const { verifyToken, siswaOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, siswaOnly, siswaController.getAll);
router.get("/:id", verifyToken, siswaOnly, siswaController.getById);
router.post("/", verifyToken, siswaOnly, siswaController.create);
router.put("/:id", verifyToken, siswaOnly, siswaController.update);
router.patch("/:id", verifyToken, siswaOnly, siswaController.patch);
router.delete("/:id", verifyToken, siswaOnly, siswaController.delete);

module.exports = router;
