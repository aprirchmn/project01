const express = require("express");
const guruController = require("../controllers/guru.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
  isSuperAdmin,
} = require("../middleware/auth.middleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", authenticateToken, isGuruOrAdmin, guruController.getAll);
router.get("/:id", authenticateToken, isGuruOrAdmin, guruController.getById);
router.post("/", authenticateToken, isGuruOrAdmin, guruController.create);
router.put("/:id", authenticateToken, isGuruOrAdmin, guruController.update);
router.delete("/:id", authenticateToken, isGuruOrAdmin, guruController.delete);
router.patch("/:id", authenticateToken, isGuruOrAdmin, guruController.patch);
router.post(
  "/import",
  upload.single("file"),
  authenticateToken,
  isSuperAdmin,
  guruController.importFromExcel,
);

module.exports = router;
