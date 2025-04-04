const prisma = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        guru: true,
        siswa: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        profileId:
          user.role === "GURU" ? user.guru?.id_guru : user.siswa?.id_siswa,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
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
        role: user.role,
        profile: user.role === "GURU" ? user.guru : user.siswa,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
