const prisma = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    let user = await prisma.user.findUnique({
      where: { username: identifier },
      include: {
        userRoles: true,
        guru: true,
        siswa: true,
      },
    });

    if (!user) {
      const guruByNip = await prisma.guru.findUnique({
        where: { nip: identifier },
        include: {
          user: {
            include: {
              guru: true,
              siswa: true,
            },
          },
        },
      });

      if (guruByNip) {
        user = guruByNip.user;
      }
    }

    if (!user) {
      const siswaByNis = await prisma.siswa.findUnique({
        where: { nis: identifier },
        include: {
          user: {
            include: {
              guru: true,
              siswa: true,
            },
          },
        },
      });

      if (siswaByNis) {
        user = siswaByNis.user;
      }
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Username/NIP/NIS atau password salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Username/NIP/NIS atau password salah" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.userRoles[0]?.role,
        profileId:
          user.role === "GURU" ? user.guru?.id_guru : user.siswa?.id_siswa,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.userRoles[0]?.role,
        profile: user.role === "GURU" ? user.guru : user.siswa,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        guru: true,
        siswa: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        role: req.user.role,
        profile: req.user.role === "GURU" ? user.guru : user.siswa,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
