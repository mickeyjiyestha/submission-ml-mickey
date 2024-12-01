import predictClassification from "../services/inferenceService.js";
import crypto from "crypto";
import { storeData, predictionsCollection } from "../services/storeData.js";
import { InputError } from "../exceptions/InputError.js";

async function postPredict(request, h) {
  const { image } = request.payload;

  // Validasi ukuran file gambar (max 1MB)
  if (image && image.bytes > 1000000) {
    console.log("Image size exceeds limit:", image.bytes); // Debug log untuk ukuran gambar
    return h
      .response({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000",
      })
      .code(413);
  }

  const { model } = request.server.app;

  try {
    // Prediksi menggunakan model
    const { resultScore, result } = await predictClassification(model, image);

    // Debug log hasil prediksi
    console.log("Model prediction result:", result);
    console.log("Model prediction score:", resultScore);

    // Validasi hasil prediksi
    if (!result || typeof resultScore !== "number") {
      console.log("Invalid result or score:", result, resultScore); // Debug log untuk hasil yang tidak valid
      throw new InputError("Hasil prediksi tidak valid");
    }

    // Menentukan pesan berdasarkan hasil prediksi
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    let message, suggestion;

    // Prediksi untuk "Cancer"
    if (result === "Cancer") {
      if (resultScore >= 50) {
        message = "Model is predicted successfully";
        suggestion = "Segera periksa ke dokter!";
      } else {
        message = "Model prediction uncertain";
        suggestion = "Coba upload gambar lain untuk prediksi lebih tepat.";
      }
    } else if (result === "Non-cancer") {
      // Prediksi untuk "Non-cancer"
      if (resultScore <= 99) {
        // Menyesuaikan batasan threshold untuk Non-cancer
        message = "Model is predicted successfully";
        suggestion = "Penyakit kanker tidak terdeteksi.";
      } else {
        message = "Model prediction uncertain";
        suggestion = "Coba upload gambar lain untuk prediksi lebih tepat.";
      }
    } else {
      console.log("Unknown result:", result); // Debug log untuk hasil yang tidak dikenal
      throw new InputError("Model prediction uncertain");
    }

    // Debug log alur penuh
    console.log("Full Prediction Flow:", {
      id,
      createdAt,
      result,
      resultScore,
      suggestion,
    });

    // Menyimpan data ke Firestore
    const data = { id, result, suggestion, createdAt };
    console.log("Storing data to Firestore:", data); // Debug log sebelum menyimpan data
    await storeData(id, data);

    return h
      .response({
        status: "success",
        message,
        data,
      })
      .code(201);
  } catch (error) {
    if (error instanceof InputError) {
      console.error("Input error:", error.message); // Debug log untuk InputError
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }

    console.error("Error during prediction:", error.message); // Debug log untuk kesalahan lainnya
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      })
      .code(400);
  }
}

async function getPredictHistories(request, h) {
  try {
    const histories = (await predictionsCollection.get()).docs.map((doc) =>
      doc.data()
    );
    const data = histories.map((item) => ({
      id: item.id,
      history: item,
    }));

    console.log("Fetched prediction histories:", data); // Debug log untuk hasil query histories
    return h.response({ status: "success", data }).code(200);
  } catch (error) {
    console.error("Error fetching histories:", error.message); // Debug log untuk kesalahan query
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam mengambil histori prediksi",
      })
      .code(500);
  }
}

export default { postPredict, getPredictHistories };
