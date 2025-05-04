const { Router } = require("express");
const router = Router();

const dashboardController = require("../controllers/dashboard.controller");
const {
  authenticateToken,
  isGuruOrAdmin,
} = require("../middleware/auth.middleware");

router.get(
  "/metrics",
  authenticateToken,
  isGuruOrAdmin,
  dashboardController.metrics,
);

router.get(
  "/chart",
  authenticateToken,
  isGuruOrAdmin,
  dashboardController.chartNilai,
);

router.get(
  "/calendar",
  authenticateToken,
  isGuruOrAdmin,
  dashboardController.calendar,
);

module.exports = router;
