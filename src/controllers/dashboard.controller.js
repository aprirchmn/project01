const prisma = require("../db");

function handleBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

function determineSemester(date) {
  const month = date.getMonth() + 1;

  if (month >= 1 && month <= 6) {
    return {
      semester: "Genap",
      tahunAjaran: `${date.getFullYear() - 1}/${date.getFullYear()}`,
    };
  } else {
    return {
      semester: "Ganjil",
      tahunAjaran: `${date.getFullYear()}/${date.getFullYear() + 1}`,
    };
  }
}

const dashboardController = {
  metrics: async (req, res) => {
    try {
      const user = req.user;
      let totalGuru = 0;
      let totalSiswa = 0;
      let totalMataPelajaran = 0;
      let totalUjian = 0;
      let totalUjianAktif = 0;
      let totalMataPelajaranPerGuru = [{ avg_subjects_per_teacher: 0 }];

      if (user.role === "SUPER_ADMIN") {
        // Super Admin melihat semua data
        totalGuru = await prisma.guru.count();
        totalSiswa = await prisma.siswa.count();
        totalMataPelajaran = await prisma.mata_pelajaran.count();
        totalUjian = await prisma.ujian.count();
        totalUjianAktif = await prisma.ujian.count({
          where: { status_ujian: "PUBLISHED" },
        });
        totalMataPelajaranPerGuru = await prisma.$queryRaw`
          SELECT AVG(mp_count) as avg_subjects_per_teacher
          FROM (
                 SELECT g.id_guru, COUNT(mp.id_mata_pelajaran) as mp_count
                 FROM guru g
                        LEFT JOIN mata_pelajaran mp ON g.id_guru = mp.id_guru
                 GROUP BY g.id_guru
               ) as subquery
        `;
      } else if (user.role === "GURU") {
        totalGuru = 1;

        totalSiswa = await prisma.siswa.count({
          where: {
            mata_pelajaran_siswa: {
              some: {
                mata_pelajaran: {
                  id_guru: user.profileId,
                },
              },
            },
          },
        });

        totalMataPelajaran = await prisma.mata_pelajaran.count({
          where: {
            id_guru: user.profileId,
          },
        });

        totalUjian = await prisma.ujian.count({
          where: {
            id_guru: user.profileId,
          },
        });

        totalUjianAktif = await prisma.ujian.count({
          where: {
            id_guru: user.profileId,
            status_ujian: "PUBLISHED",
          },
        });
      } else if (user.role === "SISWA") {
        totalSiswa = 1;

        totalGuru = await prisma.guru.count({
          where: {
            mata_pelajaran: {
              some: {
                siswa: {
                  some: {
                    id_siswa: user.profileId,
                  },
                },
              },
            },
          },
        });

        totalMataPelajaran = await prisma.mata_pelajaran.count({
          where: {
            siswa: {
              some: {
                id_siswa: user.profileId,
              },
            },
          },
        });

        totalUjian = await prisma.ujian.count({
          where: {
            mata_pelajaran: {
              siswa: {
                some: {
                  id_siswa: user.profileId,
                },
              },
            },
          },
        });

        totalUjianAktif = await prisma.ujian.count({
          where: {
            status_ujian: "PUBLISHED",
            mata_pelajaran: {
              siswa: {
                some: {
                  id_siswa: user.profileId,
                },
              },
            },
          },
        });
      }

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

      const distribusiNilai = await prisma.$queryRawUnsafe(`
        SELECT
          CASE
            WHEN nilai_total >= 0 AND nilai_total < 10 THEN '0-9'
            WHEN nilai_total >= 10 AND nilai_total < 20 THEN '10-19'
            WHEN nilai_total >= 20 AND nilai_total < 30 THEN '20-29'
            WHEN nilai_total >= 30 AND nilai_total < 40 THEN '30-39'
            WHEN nilai_total >= 40 AND nilai_total < 50 THEN '40-49'
            WHEN nilai_total >= 50 AND nilai_total < 60 THEN '50-59'
            WHEN nilai_total >= 60 AND nilai_total < 70 THEN '60-69'
            WHEN nilai_total >= 70 AND nilai_total < 80 THEN '70-79'
            WHEN nilai_total >= 80 AND nilai_total < 90 THEN '80-89'
            WHEN nilai_total >= 90 AND nilai_total <= 100 THEN '90-100'
            ELSE 'Other'
            END as rentang_nilai,
          COUNT(*) as jumlah_siswa
        FROM hasil_ujian
        WHERE is_selesai = true
        GROUP BY
          CASE
            WHEN nilai_total >= 0 AND nilai_total < 10 THEN '0-9'
            WHEN nilai_total >= 10 AND nilai_total < 20 THEN '10-19'
            WHEN nilai_total >= 20 AND nilai_total < 30 THEN '20-29'
            WHEN nilai_total >= 30 AND nilai_total < 40 THEN '30-39'
            WHEN nilai_total >= 40 AND nilai_total < 50 THEN '40-49'
            WHEN nilai_total >= 50 AND nilai_total < 60 THEN '50-59'
            WHEN nilai_total >= 60 AND nilai_total < 70 THEN '60-69'
            WHEN nilai_total >= 70 AND nilai_total < 80 THEN '70-79'
            WHEN nilai_total >= 80 AND nilai_total < 90 THEN '80-89'
            WHEN nilai_total >= 90 AND nilai_total <= 100 THEN '90-100'
            ELSE 'Other'
            END
      `);

      return res.status(200).json(
        handleBigInt({
          // avgNilaiPerMataPelajaran,
          // detailNilaiPerMapel,
          distribusiNilai,
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

  getNilaiByMapel: async (req, res) => {
    try {
      const idSiswa = req.user.id;

      console.log(req.user);

      const nilaiByMapel = await prisma.$queryRaw`
        SELECT 
          mp.id_mata_pelajaran,
          mp.nama_mata_pelajaran,
          mp.kode_mata_pelajaran,
          AVG(hu.nilai_total) as nilai_rata_rata,
          COUNT(hu.id_hasil_ujian) as jumlah_ujian,
          MAX(hu.nilai_total) as nilai_tertinggi,
          MIN(hu.nilai_total) as nilai_terendah
        FROM 
          hasil_ujian hu
        JOIN 
          ujian u ON hu.id_ujian = u.id_ujian
        JOIN 
          mata_pelajaran mp ON u.id_mata_pelajaran = mp.id_mata_pelajaran
        WHERE 
          hu.id_siswa = ${idSiswa}
          AND hu.is_selesai = true
        GROUP BY 
          mp.id_mata_pelajaran
        ORDER BY 
          nilai_rata_rata DESC
      `;

      res.json({
        success: true,
        data: nilaiByMapel,
      });
    } catch (error) {
      console.error("Error getting nilai by mata pelajaran:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data nilai",
      });
    }
  },

  getNilaiBySemester: async (req, res) => {
    try {
      const idSiswa = req.user.id_siswa;

      const allResults = await prisma.hasil_ujian.findMany({
        where: {
          id_siswa: idSiswa,
          is_selesai: true,
        },
        include: {
          ujian: {
            include: {
              mata_pelajaran: true,
            },
          },
        },
      });

      const semesterData = {};

      allResults.forEach((result) => {
        const { semester, tahunAjaran } = determineSemester(
          result.ujian.tanggal_ujian,
        );
        const semesterKey = `${tahunAjaran} ${semester}`;

        if (!semesterData[semesterKey]) {
          semesterData[semesterKey] = {
            tahunAjaran,
            semester,
            nilai: [],
            mapel: new Set(),
          };
        }

        semesterData[semesterKey].nilai.push(result.nilai_total);
        semesterData[semesterKey].mapel.add(
          result.ujian.mata_pelajaran.nama_mata_pelajaran,
        );
      });

      const result = Object.keys(semesterData)
        .map((key) => {
          const data = semesterData[key];
          const nilai = data.nilai;

          return {
            periode: key,
            tahunAjaran: data.tahunAjaran,
            semester: data.semester,
            jumlahMapel: data.mapel.size,
            jumlahUjian: nilai.length,
            nilaiRataRata:
              nilai.length > 0
                ? nilai.reduce((a, b) => a + b, 0) / nilai.length
                : 0,
            nilaiTertinggi: nilai.length > 0 ? Math.max(...nilai) : 0,
            nilaiTerendah: nilai.length > 0 ? Math.min(...nilai) : 0,
          };
        })
        .sort((a, b) => {
          const [tahunA] = a.tahunAjaran.split("/").map(Number);
          const [tahunB] = b.tahunAjaran.split("/").map(Number);

          if (tahunA !== tahunB) return tahunB - tahunA;

          return a.semester === "Ganjil" ? -1 : 1;
        });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error getting nilai by semester:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data nilai",
      });
    }
  },

  getStatistikMapel: async (req, res) => {
    try {
      const idSiswa = req.user.id;
      const idMapel = parseInt(req.params.idMapel);

      const ujianResults = await prisma.hasil_ujian.findMany({
        where: {
          id_siswa: idSiswa,
          is_selesai: true,
          ujian: {
            id_mata_pelajaran: idMapel,
          },
        },
        include: {
          ujian: {
            include: {
              mata_pelajaran: true,
            },
          },
        },
        orderBy: {
          ujian: {
            tanggal_ujian: "asc",
          },
        },
      });

      const mataPelajaran = await prisma.mata_pelajaran.findUnique({
        where: {
          id_mata_pelajaran: idMapel,
        },
        include: {
          guru: true,
        },
      });

      const detailUjian = ujianResults.map((result) => ({
        id_hasil_ujian: result.id_hasil_ujian,
        id_ujian: result.id_ujian,
        nama_ujian: result.ujian.nama_ujian,
        tanggal_ujian: result.ujian.tanggal_ujian,
        nilai_total: result.nilai_total,
        nilai_multiple: result.nilai_multiple,
        nilai_essay: result.nilai_essay,
      }));

      const statistik = {
        jumlah_ujian: detailUjian.length,
        nilai_rata_rata:
          detailUjian.length > 0
            ? detailUjian.reduce((sum, item) => sum + item.nilai_total, 0) /
              detailUjian.length
            : 0,
        nilai_tertinggi:
          detailUjian.length > 0
            ? Math.max(...detailUjian.map((item) => item.nilai_total))
            : 0,
        nilai_terendah:
          detailUjian.length > 0
            ? Math.min(...detailUjian.map((item) => item.nilai_total))
            : 0,
      };

      res.json({
        success: true,
        data: {
          mata_pelajaran: mataPelajaran,
          statistik,
          detail_ujian: detailUjian,
        },
      });
    } catch (error) {
      console.error("Error getting statistik mapel:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil statistik mata pelajaran",
      });
    }
  },

  getMataPelajaranSiswa: async (req, res) => {
    try {
      const idSiswa = req.user.id_siswa;

      const mataPelajaran = await prisma.mata_pelajaran_siswa.findMany({
        where: {
          id_siswa: idSiswa,
        },
        include: {
          mata_pelajaran: {
            include: {
              guru: true,
            },
          },
        },
      });

      const formattedData = mataPelajaran.map((mp) => ({
        id_mata_pelajaran: mp.mata_pelajaran.id_mata_pelajaran,
        nama_mata_pelajaran: mp.mata_pelajaran.nama_mata_pelajaran,
        kode_mata_pelajaran: mp.mata_pelajaran.kode_mata_pelajaran,
        deskripsi_mata_pelajaran: mp.mata_pelajaran.deskripsi_mata_pelajaran,
        nama_guru: mp.mata_pelajaran.guru.nama_guru,
      }));

      res.json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      console.error("Error getting mata pelajaran siswa:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data mata pelajaran",
      });
    }
  },
};

module.exports = dashboardController;
