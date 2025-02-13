const express = require("express");
const soalmultipleController = require("../controllers/soalmultiple.controller");

const router = express.Router();

router.get("/", soalmultipleController.getAll);
router.get("/:id", soalmultipleController.getById);
router.post("/", soalmultipleController.create);
router.put("/:id", soalmultipleController.update);
router.patch("/:id", soalmultipleController.patch);
router.delete("/:id", soalmultipleController.delete);

module.exports = router;
