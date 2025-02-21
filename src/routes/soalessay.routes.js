const express = require("express");
const soalEssayController = require("../controllers/soalessay.controller");
const { verifyToken, guruOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, soalEssayController.getAll);
router.get("/:id", verifyToken, soalEssayController.getById);
router.post("/", verifyToken, soalEssayController.create);
router.put("/:id", verifyToken, soalEssayController.update);
router.delete("/:id", verifyToken, guruOnly, soalEssayController.delete);
router.patch("/:id", verifyToken, soalEssayController.patch);

module.exports = router;
