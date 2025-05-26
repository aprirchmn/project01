const express = require("express");
const soalmultipleController = require("../controllers/soalmultiple.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticateToken, soalmultipleController.getAll);
router.get("/:id", authenticateToken, soalmultipleController.getById);
router.post(
  "/",
  authenticateToken,
  isGuruOrAdmin,
  soalmultipleController.create,
);
router.put("/:id", authenticateToken, soalmultipleController.update);

router.delete("/:id", authenticateToken, soalmultipleController.delete);

module.exports = router;
