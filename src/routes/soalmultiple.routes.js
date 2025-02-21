const express = require("express");
const soalmultipleController = require("../controllers/soalmultiple.controller");
const { verifyToken, guruOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, soalmultipleController.getAll);
router.get("/:id", verifyToken, soalmultipleController.getById);
router.post("/", verifyToken, guruOnly, soalmultipleController.create);
router.put("/:id", verifyToken, soalmultipleController.update);
router.patch("/:id", verifyToken, soalmultipleController.patch);
router.delete("/:id", verifyToken, soalmultipleController.delete);

module.exports = router;
