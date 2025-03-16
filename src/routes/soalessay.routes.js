const express = require("express");
const soalEssayController = require("../controllers/soalessay.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, soalEssayController.getAll);
router.get("/:id", authenticateToken, soalEssayController.getById);
router.post("/", authenticateToken, soalEssayController.create);
router.put("/:id", authenticateToken, soalEssayController.update);
router.delete(
  "/:id",
  authenticateToken,
  isGuruOrAdmin,
  soalEssayController.delete,
);
router.patch("/:id", authenticateToken, soalEssayController.patch);

module.exports = router;
