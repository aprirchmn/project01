const express = require("express");
const guruController = require("../controllers/guru.controller");
const { verifyToken, guruOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", verifyToken, guruOnly, guruController.getAll);
router.get("/:id", verifyToken, guruOnly, guruController.getById);
router.post("/", verifyToken, guruOnly, guruController.create);
router.put("/:id", verifyToken, guruOnly, guruController.update);
router.delete("/:id", verifyToken, guruOnly, guruController.delete);
router.patch("/:id", verifyToken, guruOnly, guruController.patch);
router.post("/import", verifyToken, guruOnly, upload.single("file"), guruController.importExcel);

module.exports = router;
