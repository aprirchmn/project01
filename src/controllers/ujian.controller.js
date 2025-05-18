const prisma = require("../db");

const ujianController = {
  getAll: async (req, res) => {
    const { status_ujian } = req.query;
    try {
      const ujians = await prisma.ujian.findMany({
        include: {
          soal_essay: true,
          soal_multiple: true,
        },
        where: {
          status_ujian,
        },
      });
      res.json(ujians);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const ujianId = parseInt(req.params.id);
      const user = req.user;

      const ujian = await prisma.ujian.findUnique({
        where: { id_ujian: ujianId },
        include: {
          soal_essay: true,
          soal_multiple: true,
        },
      });

      if (!ujian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      let totalBobot = 0;
      let totalSoal = 0;

      if (ujian.tipe_ujian === "MULTIPLE") {
        totalBobot = ujian.soal_multiple.reduce(
          (sum, soal) => sum + soal.bobot,
          0,
        );
        totalSoal = ujian.soal_multiple.length;
      } else if (ujian.tipe_ujian === "ESSAY") {
        totalBobot = ujian.soal_essay.reduce(
          (sum, soal) => sum + soal.bobot,
          0,
        );
        totalSoal = ujian.soal_essay.length;
      }

      if (user.role === "SISWA") {
        const hasil = await prisma.hasil_ujian.findUnique({
          where: {
            id_siswa_id_ujian: {
              id_siswa: user.profileId,
              id_ujian: ujianId,
            },
          },
          select: {
            is_selesai: true,
            waktu_selesai: true,
          },
        });

        const soalMultiple = ujian.soal_multiple.map((soal) => ({
          id_soal_multiple: soal.id_soal_multiple,
          pertanyaan: soal.pertanyaan,
          gambar_soal: soal.gambar_soal,
          pilihan_a: soal.pilihan_a,
          pilihan_b: soal.pilihan_b,
          pilihan_c: soal.pilihan_c,
          pilihan_d: soal.pilihan_d,
          pilihan_e: soal.pilihan_e,
        }));

        const soalEssay = ujian.soal_essay.map((soal) => ({
          id_soal_essay: soal.id_soal_essay,
          pertanyaan: soal.pertanyaan,
          gambar_soal: soal.gambar_soal,
        }));

        const dataSoal =
          ujian.tipe_ujian === "MULTIPLE"
            ? { soal_multiple: soalMultiple }
            : { soal_essay: soalEssay };

        return res.json({
          status: 200,
          message: "Berhasil Mendapatkan Soal",
          data: {
            id_mata_pelajaran: ujian.id_mata_pelajaran,
            id_guru: ujian.id_guru,
            id_ujian: ujian.id_ujian,
            tipe_ujian: ujian.tipe_ujian,
            tanggal_ujian: ujian.tanggal_ujian,
            durasi_ujian: ujian.durasi_ujian,
            acak_soal: ujian.acak_soal,
            tampilkan_jawaban: ujian.tampilkan_jawaban,
            is_selesai: hasil?.is_selesai || false,
            waktu_selesai: hasil?.waktu_selesai || null,
            totalBobot: totalBobot,
            totalSoal: totalSoal,
            ...dataSoal,
          },
        });
      }

      if (user.role === "GURU" || user.role === "SUPER_ADMIN") {
        const totalData = {
          totalBobot: totalBobot,
          totalSoal: totalSoal,
        };

        if (ujian.tipe_ujian === "MULTIPLE") {
          delete ujian.soal_essay;
        } else if (ujian.tipe_ujian === "ESSAY") {
          delete ujian.soal_multiple;
        }

        return res.json({
          status: 200,
          message: "Berhasil Mendapatkan Data",
          data: {
            ...ujian,
            ...totalData,
          },
        });
      }

      return res.status(403).json({ message: "Akses ditolak" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const {
        id_mata_pelajaran,
        id_guru,
        tanggal_ujian,
        durasi_ujian,
        deskripsi_ujian,
        status_ujian,
        nama_ujian,
        tipe_ujian,
        acak_soal,
        tampilkan_jawaban,
        soal_essay,
        soal_multiple,
      } = req.body;

      const ujian = await prisma.ujian.create({
        data: {
          id_mata_pelajaran,
          id_guru,
          tanggal_ujian,
          durasi_ujian,
          deskripsi_ujian,
          status_ujian: status_ujian,
          nama_ujian,
          tipe_ujian,
          acak_soal: acak_soal || false,
          tampilkan_jawaban: tampilkan_jawaban || false,
          soal_essay: {
            create: soal_essay || [],
          },
          soal_multiple: {
            create: soal_multiple || [],
          },
        },
        include: {
          mata_pelajaran: true,
          guru: true,
          soal_essay: true,
          soal_multiple: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Ujian berhasil dibuat",
        data: ujian,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Gagal membuat ujian",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        id_mata_pelajaran,
        id_guru,
        tanggal_ujian,
        durasi_ujian,
        deskripsi_ujian,
        status_ujian,
        nama_ujian,
        tipe_ujian,
        acak_soal,
        tampilkan_jawaban,
      } = req.body;

      const ujian = await prisma.ujian.update({
        where: {
          id_ujian: parseInt(id),
        },
        data: {
          id_mata_pelajaran: id_mata_pelajaran,
          id_guru: id_guru,
          tanggal_ujian: tanggal_ujian ? new Date(tanggal_ujian) : undefined,
          durasi_ujian: durasi_ujian,
          deskripsi_ujian: deskripsi_ujian,
          status_ujian: status_ujian,
          nama_ujian: nama_ujian,
          tipe_ujian: tipe_ujian,
          acak_soal: acak_soal,
          tampilkan_jawaban: tampilkan_jawaban,
        },
        include: {
          mata_pelajaran: true,
          guru: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Ujian berhasil diperbarui",
        data: ujian,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui ujian",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const ujianId = parseInt(req.params.id);

      const existingUjian = await prisma.ujian.findUnique({
        where: { id_ujian: ujianId },
      });

      if (!existingUjian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      await prisma.ujian.delete({
        where: {
          id_ujian: ujianId,
        },
      });

      res.status(200).json({ message: "Ujian berhasil dihapus" });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  startUjian: async (req, res) => {
    try {
      const id_ujian = parseInt(req.params.id_ujian);
      const user = req.user;

      if (user.role !== "SISWA") {
        return res
          .status(403)
          .json({ message: "Hanya siswa yang bisa memulai ujian" });
      }

      const ujian = await prisma.ujian.findUnique({
        where: { id_ujian },
      });

      if (!ujian) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }

      const existing = await prisma.hasil_ujian.findUnique({
        where: {
          id_siswa_id_ujian: {
            id_siswa: user.profileId,
            id_ujian,
          },
        },
      });

      if (existing) {
        if (existing.is_selesai) {
          return res.status(403).json({
            message: "Ujian sudah diselesaikan dan tidak bisa diulang",
            alreadyFinished: true,
          });
        }

        return res.status(200).json({
          message: "Ujian sudah dimulai sebelumnya",
          alreadyStarted: true,
        });
      }

      await prisma.hasil_ujian.create({
        data: {
          id_siswa: user.profileId,
          id_ujian,
        },
      });

      return res.status(201).json({
        message: "Ujian berhasil dimulai",
        alreadyStarted: false,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Terjadi kesalahan", error: error.message });
    }
  },

  submitUjian: async (req, res) => {
    try {
      const { id_siswa, id_ujian } = req.body;

      if (!id_siswa || !id_ujian) {
        return res
          .status(400)
          .json({ message: "id_siswa dan id_ujian wajib diisi" });
      }

      const hasilUjian = await prisma.hasil_ujian.findFirst({
        where: { id_siswa, id_ujian },
      });

      if (!hasilUjian) {
        return res.status(404).json({ message: "Hasil ujian tidak ditemukan" });
      }

      if (hasilUjian.is_selesai) {
        return res
          .status(400)
          .json({ message: "Ujian sudah diselesaikan sebelumnya" });
      }

      // Hitung ulang nilai
      const totalSkorMultiple = await prisma.jawaban.aggregate({
        where: {
          id_hasil_ujian: hasilUjian.id_hasil_ujian,
          id_soal_multiple: { not: null },
        },
        _sum: { skor: true },
      });

      const totalSkorEssay = await prisma.jawaban.aggregate({
        where: {
          id_hasil_ujian: hasilUjian.id_hasil_ujian,
          id_soal_essay: { not: null },
        },
        _sum: { skor: true },
      });

      const nilai_multiple = totalSkorMultiple._sum.skor || 0;
      const nilai_essay = totalSkorEssay._sum.skor || 0;
      const nilai_total = nilai_multiple + nilai_essay;

      await prisma.hasil_ujian.update({
        where: { id_hasil_ujian: hasilUjian.id_hasil_ujian },
        data: {
          nilai_multiple,
          nilai_essay,
          nilai_total,
          is_selesai: true,
          waktu_selesai: new Date(),
        },
      });

      return res.status(200).json({
        message: "Ujian berhasil disubmit",
        data: {
          nilai_multiple,
          nilai_essay,
          nilai_total,
          waktu_selesai: new Date(),
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  examCheating: async (req, res) => {
    const { id } = req.params;
    const { id_siswa } = req.body;

    try {
      const hasil = await prisma.hasil_ujian.findFirst({
        where: {
          id_ujian: parseInt(id),
          id_siswa: id_siswa,
        },
      });

      if (!hasil)
        return res.status(404).json({ error: "Hasil ujian tidak ditemukan" });

      const jawabanSiswa = await prisma.jawaban.findMany({
        where: {
          id_hasil_ujian: hasil.id_hasil_ujian,
        },
      });

      const nilai_multiple = jawabanSiswa
        .filter((j) => j.id_soal_multiple !== null)
        .reduce((total, j) => total + j.skor, 0);

      const nilai_essay = jawabanSiswa
        .filter((j) => j.id_soal_essay !== null)
        .reduce((total, j) => total + j.skor, 0);

      const nilai_total = nilai_multiple + nilai_essay;

      const hasilUpdate = await prisma.hasil_ujian.update({
        where: { id_hasil_ujian: hasil.id_hasil_ujian },
        data: {
          nilai_multiple,
          nilai_essay,
          nilai_total,
          is_selesai: true,
          waktu_selesai: new Date(),
        },
      });

      res.json({ success: true, hasil: hasilUpdate });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Gagal proses penalti kecurangan", detail: err });
    }
  },

  examResult: async (req, res) => {
    try {
      const guruId = req.user.id;

      const ujianList = await prisma.ujian.findMany({
        where: {
          id_guru: guruId,
          hasil_ujian: {
            some: {
              is_selesai: true,
            },
          },
        },
        select: {
          id_ujian: true,
          nama_ujian: true,
          tanggal_ujian: true,
          status_ujian: true,
          tipe_ujian: true,
          mata_pelajaran: {
            select: {
              nama_mata_pelajaran: true,
            },
          },
          _count: {
            select: {
              hasil_ujian: {
                where: {
                  is_selesai: true,
                },
              },
            },
          },
        },
        orderBy: {
          tanggal_ujian: "desc",
        },
      });

      const formattedUjianList = ujianList.map((ujian) => ({
        id_ujian: ujian.id_ujian,
        nama_ujian: ujian.nama_ujian,
        mata_pelajaran: ujian.mata_pelajaran.nama_mata_pelajaran,
        tanggal_ujian: ujian.tanggal_ujian,
        status_ujian: ujian.status_ujian,
        tipe_ujian: ujian.tipe_ujian,
        jumlah_peserta: ujian._count.hasil_ujian,
      }));

      return res.status(200).json({
        success: true,
        data: formattedUjianList,
      });
    } catch (error) {
      console.error("Error mendapatkan daftar ujian:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  },

  examDetailResult: async (req, res) => {
    try {
      const { id_ujian } = req.params;
      const guruId = req.user.id;

      const ujian = await prisma.ujian.findFirst({
        where: {
          id_ujian: parseInt(id_ujian),
          id_guru: guruId,
        },
      });

      const detailUjian = await prisma.ujian.findUnique({
        where: {
          id_ujian: parseInt(id_ujian),
        },
        select: {
          nama_ujian: true,
          tanggal_ujian: true,
          durasi_ujian: true,
          tipe_ujian: true,
          mata_pelajaran: {
            select: {
              nama_mata_pelajaran: true,
            },
          },
        },
      });

      const hasilUjianSiswa = await prisma.hasil_ujian.findMany({
        where: {
          id_ujian: parseInt(id_ujian),
          is_selesai: true,
        },
        select: {
          id_hasil_ujian: true,
          nilai_multiple: true,
          nilai_essay: true,
          nilai_total: true,
          waktu_selesai: true,
          siswa: {
            select: {
              id_siswa: true,
              nama_siswa: true,
              nis: true,
              jurusan: true,
            },
          },
        },
        orderBy: {
          nilai_total: "desc",
        },
      });

      const nilaiArray = hasilUjianSiswa.map((hasil) => hasil.nilai_total);
      const statistik =
        nilaiArray.length > 0
          ? {
              nilai_tertinggi: Math.max(...nilaiArray),
              nilai_terendah: Math.min(...nilaiArray),
              nilai_rata_rata:
                nilaiArray.reduce((a, b) => a + b, 0) / nilaiArray.length,
            }
          : {
              nilai_tertinggi: 0,
              nilai_terendah: 0,
              nilai_rata_rata: 0,
            };

      return res.status(200).json({
        success: true,
        data: {
          detail_ujian: detailUjian,
          statistik: statistik,
          hasil_siswa: hasilUjianSiswa.map((hasil) => ({
            id_hasil_ujian: hasil.id_hasil_ujian,
            id_siswa: hasil.siswa.id_siswa,
            nama_siswa: hasil.siswa.nama_siswa,
            nis: hasil.siswa.nis,
            jurusan: hasil.siswa.jurusan,
            nilai_multiple: hasil.nilai_multiple,
            nilai_essay: hasil.nilai_essay,
            nilai_total: hasil.nilai_total,
            waktu_selesai: hasil.waktu_selesai,
          })),
        },
      });
    } catch (error) {
      console.error("Error mendapatkan hasil ujian:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  },
};

module.exports = ujianController;
