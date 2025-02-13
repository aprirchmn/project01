const express = require("express");
const hasilujianController = require("../controllers/hasilujian.controller");

const router = express.Router();

router.get("/", hasilujianController.getAll);
router.get("/:id", hasilujianController.getById);
router.post("/", hasilujianController.create);
router.put("/:id", hasilujianController.update);
router.patch("/:id", hasilujianController.patch);
router.delete("/:id", hasilujianController.delete);

module.exports = router;
