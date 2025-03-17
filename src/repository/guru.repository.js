// Berkomunikasi dengan database

const prisma = require("../db");

const findGurus = async () => {
  const gurus = await prisma.guru.findMany();

  return gurus;
};

const findGuruById = async (id) => {
  const guru = await prisma.guru.findUnique({
    where: {
      id_guru: id,
    },
  });

  return guru;
};

// const findGuruByNama = async (nama_guru) => {
//   const guru = await prisma.guru.findFirst({
//     where: {
//       nama_guru,
//     },
//   });

//   return guru;
// };

const insertGuru = async (guruData) => {
  const guru = await prisma.guru.create({
    data: {
      nama_guru: guruData.nama_guru,
      nip: guruData.nip,
      password: guruData.password,
    },
  });

  return guru;
};

const deleteGuru = async (id) => {
  await prisma.guru.delete({
    where: {
      id_guru: id, //mengubah string menjadi Int menggunakan parseInt
    },
  });
};

const editGuru = async (id, guruData) => {
  const guru = await prisma.guru.update({
    where: {
      id_guru: parseInt(id),
    },
    data: {
      nama_guru: guruData.nama_guru,
      nip: guruData.nip,
      password: guruData.password,
    },
  });

  return guru;
};

const saveImportedData = async (data) => {
  try {
    await prisma.guru.createMany({
      data: data.map((guru) => ({
        nama_guru: guru.nama_guru,
        nip: guru.nip,
        password: guru.nip.toString(), // Default password = NIP
      })),
      skipDuplicates: true,
    });

    return await prisma.guru.findMany({
      where: {
        nip: { in: data.map((guru) => guru.nip) },
      },
    });
  } catch (error) {
    console.error("❌ Gagal menyimpan data:", error);
    throw new Error("Gagal menyimpan data ke database");
  }
};

module.exports = {
  findGurus,
  findGuruById,
  insertGuru,
  deleteGuru,
  editGuru,
  saveImportedData,
  //   findGuruByNama,
};
