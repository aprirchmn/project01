const express = require("express");
const soalEssayController = require("../controllers/soalessay.controller");

const router = express.Router();

router.get("/", soalEssayController.getAll);
router.get("/:id", soalEssayController.getById);
router.post("/", soalEssayController.create);
router.put("/:id", soalEssayController.update);
router.delete("/:id", soalEssayController.delete);
router.patch("/:id", soalEssayController.patch);

module.exports = router;
