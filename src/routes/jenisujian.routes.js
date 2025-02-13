const express = require("express");
const jenisujianController = require("../controllers/jenisujian.controller");

const router = express.Router();

router.get("/", jenisujianController.getAll);
router.get("/:id", jenisujianController.getById);
router.post("/", jenisujianController.create);
router.put("/:id", jenisujianController.update);
router.delete("/:id", jenisujianController.delete);
router.patch("/:id", jenisujianController.patch);

module.exports = router;
