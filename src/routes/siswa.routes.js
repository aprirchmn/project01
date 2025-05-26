const express = require("express");
const siswaController = require("../controllers/siswa.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
  isSiswaOrAdmin,
  isSuperAdmin,
} = require("../middleware/auth.middleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", authenticateToken, siswaController.getAll);
router.get("/:id", authenticateToken, siswaController.getById);
router.post("/", authenticateToken, isGuruOrAdmin, siswaController.create);
router.put("/:id", authenticateToken, isGuruOrAdmin, siswaController.update);
router.post(
  "/:id_siswa/join",
  authenticateToken,
  isSiswaOrAdmin,
  siswaController.join,
);
router.delete("/:id", authenticateToken, isGuruOrAdmin, siswaController.delete);
router.post(
  "/import",
  upload.single("file"),
  authenticateToken,
  isSuperAdmin,
  siswaController.importFromExcel,
);

module.exports = router;
