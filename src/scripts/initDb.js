const prisma = require("../db");
const bcrypt = require("bcrypt");

async function createSuperAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await prisma.user.create({
        data: {
          username: "admin",
          email: "superadmin123@mail.com",
          password: hashedPassword,
          role: "SUPER_ADMIN",
        },
      });

      console.log("Super Admin berhasil dibuat");
    } else {
      console.log("Super Admin sudah ada");
    }
  } catch (error) {
    console.error("Gagal membuat Super Admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
