import { InputError } from "../exceptions/InputError.js";
import * as tf from "@tensorflow/tfjs-node";

async function predictClassification(model, imageBuffer) {
  try {
    // Decode image buffer dan preprocessing
    const tensor = tf.node
      .decodeJpeg(imageBuffer)
      .resizeNearestNeighbor([224, 224]) // Ubah ukuran ke 224x224
      .expandDims(0) // Tambahkan dimensi batch
      .toFloat()
      .div(tf.scalar(255)); // Normalisasi nilai piksel

    // Lakukan prediksi
    const prediction = model.predict(tensor);
    const scores = await prediction.data(); // Ambil skor sebagai array

    tensor.dispose(); // Bebaskan memori tensor
    prediction.dispose(); // Bebaskan memori hasil prediksi

    // Log untuk melihat skor hasil prediksi
    console.log("Prediction Scores:", scores);

    // Proses hasil prediksi
    const resultScore = Math.max(...scores) * 100; // Skor tertinggi
    const roundedScore = parseFloat(resultScore.toFixed(1)); // Ambil satu angka di belakang koma
    let result, suggestion;

    // Logika klasifikasi berdasarkan score
    if (roundedScore <= 57.9) {
      result = "Non-cancer"; // Jika score <= 57.9
      suggestion = "Penyakit kanker tidak terdeteksi.";
    } else {
      result = "Cancer"; // Jika score > 57.9
      suggestion = "Segera periksa ke dokter!";
    }

    // Log untuk debugging
    console.log("Prediction Results:", { roundedScore, result });

    return { resultScore: roundedScore, result, suggestion };
  } catch (error) {
    console.error("Error in prediction:", error.message);
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}

export default predictClassification;
