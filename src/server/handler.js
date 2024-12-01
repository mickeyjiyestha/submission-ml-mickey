// src/server/handler.js
const inferenceService = require("../services/inferenceService");
const storeData = require("../services/storeData");
const { v4: uuidv4 } = require("uuid");

const predictHandler = async (request, h) => {
  const { image } = request.payload;

  if (!image) {
    return h
      .response({
        status: "fail",
        message: "Image is required",
      })
      .code(400);
  }

  // Ambil buffer dari file yang diupload
  const imageBuffer = await new Promise((resolve, reject) => {
    const buffers = [];
    image.on("data", (data) => buffers.push(data)); // Menyimpan data ke dalam array
    image.on("end", () => resolve(Buffer.concat(buffers))); // Menggabungkan buffer saat stream selesai
    image.on("error", reject); // Menangani error
  });

  // Lanjutkan dengan inferensi
  const predictionResult = await inferenceService(imageBuffer);
  const result = predictionResult > 0.5 ? "Cancer" : "Non-cancer";
  const suggestion =
    result === "Cancer"
      ? "Segera periksa ke dokter!"
      : "Penyakit kanker tidak terdeteksi.";

  const responseData = {
    id: uuidv4(), // Ganti dengan ID unik yang sesuai
    result,
    suggestion,
    createdAt: new Date().toISOString(),
  };

  await storeData(responseData); // Simpan data ke Firestore

  return h.response({
    status: "success",
    message: "Model is predicted successfully",
    data: responseData,
  });
};

module.exports = { predictHandler };
