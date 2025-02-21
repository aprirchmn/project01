const prisma = require("../db");
const { findHasilujians, findHasilujianById, insertHasilujian, deleteHasilujian, editHasilujian } = require("../repository/hasilujian.repository");

const getAllHasilujians = async () => {
  return await findHasilujians();
};

const getHasilujianById = async (id) => {
  const hasilujian = await findHasilujianById(id);
  if (!hasilujian) throw Error("Hasil Ujian tidak ditemukan");
  return hasilujian;
};

const createHasilujian = async (newHasilujianData) => {
  return await insertHasilujian(newHasilujianData);
};

const deleteHasilujianById = async (id) => {
  await getHasilujianById(id);
  await deleteHasilujian(id);
};

const editHasilujianById = async (id, hasilujianData) => {
  await getHasilujianById(id);
  return await editHasilujian(id, hasilujianData);
};

module.exports = {
  getAllHasilujians,
  getHasilujianById,
  createHasilujian,
  deleteHasilujianById,
  editHasilujianById,
};
