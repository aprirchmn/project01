const express = require("express");
const siswaController = require("../controllers/siswa.controller");

const router = express.Router();

router.get("/", siswaController.getAll);
router.get("/:id", siswaController.getById);
router.post("/", siswaController.create);
router.put("/:id", siswaController.update);
router.delete("/:id", siswaController.delete);
router.patch("/:id", siswaController.patch);

module.exports = router;
