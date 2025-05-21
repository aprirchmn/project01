const { Router } = require("express");
const router = Router();

const dashboardController = require("../controllers/dashboard.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.get("/metrics", authenticateToken, dashboardController.metrics);

router.get("/chart", authenticateToken, dashboardController.chartNilai);

router.get("/calendar", authenticateToken, dashboardController.calendar);

router.get(
  "/getNilaiByMapel",
  authenticateToken,
  dashboardController.getNilaiByMapel,
);

router.get(
  "/getNilaiBySemester",
  authenticateToken,
  dashboardController.getNilaiBySemester,
);

router.get(
  "/getStatisikMapel/:idMapel",
  authenticateToken,
  dashboardController.getStatistikMapel,
);

router.get(
  "/:idMapel/getMataPelajaranSiswa",
  authenticateToken,
  dashboardController.getMataPelajaranSiswa,
);

module.exports = router;
