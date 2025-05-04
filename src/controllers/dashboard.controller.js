const prisma = require("../db");

function handleBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

const dashboardController = {
  metrics: async (req, res) => {
    try {
      const totalGuru = await prisma.guru.count();
      const totalSiswa = await prisma.siswa.count();
      const totalMataPelajaran = await prisma.mata_pelajaran.count();
      const totalUjian = await prisma.ujian.count();

      const totalUjianAktif = await prisma.ujian.count({
        where: {
          status_ujian: "PUBLISHED",
        },
      });

      const totalMataPelajaranPerGuru = await prisma.$queryRaw`
      SELECT AVG(mp_count) as avg_subjects_per_teacher
      FROM (
        SELECT g.id_guru, COUNT(mp.id_mata_pelajaran) as mp_count
        FROM guru g
        LEFT JOIN mata_pelajaran mp ON g.id_guru = mp.id_guru
        GROUP BY g.id_guru
      ) as subquery
    `;

      return res.status(200).json({
        totalGuru,
        totalSiswa,
        totalMataPelajaran,
        totalUjian,
        totalUjianAktif,
        avgMataPelajaranPerGuru:
          totalMataPelajaranPerGuru[0]?.avg_subjects_per_teacher || 0,
      });
    } catch (error) {
      console.error("Metrics API Error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  chartNilai: async (req, res) => {
    try {
      const avgNilaiPerMataPelajaran = await prisma.$queryRawUnsafe(`
      SELECT 
        mp.id_mata_pelajaran,
        mp.nama_mata_pelajaran, 
        ROUND(AVG(hu.nilai_total)::numeric, 2) as rata_rata_nilai,
        COUNT(hu.id_hasil_ujian) as jumlah_peserta
      FROM mata_pelajaran mp
      JOIN ujian u ON mp.id_mata_pelajaran = u.id_mata_pelajaran
      JOIN hasil_ujian hu ON u.id_ujian = hu.id_ujian
      WHERE hu.is_selesai = true
      GROUP BY mp.id_mata_pelajaran, mp.nama_mata_pelajaran
      ORDER BY rata_rata_nilai DESC
    `);

      const detailNilaiPerMapel = await prisma.$queryRawUnsafe(`
      SELECT 
        mp.id_mata_pelajaran,
        mp.nama_mata_pelajaran,
        ROUND(AVG(hu.nilai_multiple)::numeric, 2) as rata_rata_nilai_multiple,
        ROUND(AVG(hu.nilai_essay)::numeric, 2) as rata_rata_nilai_essay,
        ROUND(AVG(hu.nilai_total)::numeric, 2) as rata_rata_nilai_total
      FROM mata_pelajaran mp
      JOIN ujian u ON mp.id_mata_pelajaran = u.id_mata_pelajaran
      JOIN hasil_ujian hu ON u.id_ujian = hu.id_ujian
      WHERE hu.is_selesai = true
      GROUP BY mp.id_mata_pelajaran, mp.nama_mata_pelajaran
      ORDER BY rata_rata_nilai_total DESC
    `);

      return res.status(200).json(
        handleBigInt({
          avgNilaiPerMataPelajaran,
          detailNilaiPerMapel,
        }),
      );
    } catch (error) {
      console.error("Chart Nilai API Error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  calendar: async (req, res) => {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate && endDate) {
      dateFilter.tanggal_ujian = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      dateFilter.tanggal_ujian = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      dateFilter.tanggal_ujian = {
        lte: new Date(endDate),
      };
    }

    try {
      const ujianSchedule = await prisma.ujian.findMany({
        where: dateFilter,
        select: {
          id_ujian: true,
          nama_ujian: true,
          tanggal_ujian: true,
          durasi_ujian: true,
          status_ujian: true,
          tipe_ujian: true,
          mata_pelajaran: {
            select: {
              id_mata_pelajaran: true,
              nama_mata_pelajaran: true,
            },
          },
          guru: {
            select: {
              nama_guru: true,
            },
          },
          hasil_ujian: {
            select: {
              id_hasil_ujian: true,
            },
          },
        },
        orderBy: {
          tanggal_ujian: "asc",
        },
      });

      const examDetails = ujianSchedule.map((ujian) => {
        const date = new Date(ujian.tanggal_ujian);
        return {
          id: ujian.id_ujian,
          title: ujian.nama_ujian,
          subject: ujian.mata_pelajaran.nama_mata_pelajaran,
          subjectId: ujian.mata_pelajaran.id_mata_pelajaran,
          teacher: ujian.guru.nama_guru,
          date: date.toISOString().split("T")[0], // Format: YYYY-MM-DD
          time: date.toISOString().split("T")[1].substring(0, 5), // Format: HH:MM
          fullDate: date.toISOString(),
          participants: ujian.hasil_ujian.length,
          status: ujian.status_ujian,
          type: ujian.tipe_ujian,
          duration: ujian.durasi_ujian,
        };
      });

      const examsByDate = {};
      examDetails.forEach((exam) => {
        if (!examsByDate[exam.date]) {
          examsByDate[exam.date] = {
            count: 0,
            subjects: new Set(),
            statuses: {},
          };
        }
        examsByDate[exam.date].count++;
        examsByDate[exam.date].subjects.add(exam.subject);

        if (!examsByDate[exam.date].statuses[exam.status]) {
          examsByDate[exam.date].statuses[exam.status] = 0;
        }
        examsByDate[exam.date].statuses[exam.status]++;
      });

      const heatmapData = Object.keys(examsByDate).map((date) => ({
        date,
        count: examsByDate[date].count,
        subjectCount: examsByDate[date].subjects.size,
        statuses: examsByDate[date].statuses,
        intensity:
          examsByDate[date].count >= 5
            ? "high"
            : examsByDate[date].count >= 3
              ? "medium"
              : "low",
      }));

      return res.status(200).json({
        examDetails,
        heatmapData,
      });
    } catch (error) {
      console.error("Calendar API Error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};

module.exports = dashboardController;
