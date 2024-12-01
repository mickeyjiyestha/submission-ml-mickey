// src/services/inferenceService.js
const tf = require("@tensorflow/tfjs-node");
const loadModel = require("./loadModel");

const inferenceService = async (imageBuffer) => {
  try {
    const model = await loadModel();
    const tensor = tf.node
      .decodeImage(imageBuffer, 3)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat()
      .div(255);

    const predictions = model.predict(tensor);
    const scores = await predictions.data(); // Ambil semua skor prediksi
    console.log("Scores:", scores); // Log skor untuk debugging

    // Jika hanya ada satu skor, gunakan threshold untuk menentukan label
    let confidenceScore;
    let label;

    if (scores.length === 1) {
      confidenceScore = scores[0] * 100; // Konversi ke persen
      label = confidenceScore > 40 ? "Cancer" : "Non-cancer"; // Threshold 60%
    } else {
      confidenceScore = Math.max(...scores) * 100; // Ambil skor tertinggi dan konversi ke persen
      const classIndex = scores.indexOf(confidenceScore); // Indeks dari skor tertinggi

      const classes = [
        "Non-cancer", // Indeks 0
        "Cancer", // Indeks 1
      ];

      label = classes[classIndex]; // Ambil label berdasarkan indeks
    }

    console.log("Confidence Score:", confidenceScore);
    console.log("Label:", label);

    // Pastikan label tidak undefined
    if (label === undefined) {
      throw new Error("Label is undefined");
    }

    return { confidenceScore, label }; // Kembalikan confidenceScore dan label
  } catch (error) {
    console.error("Error in inferenceService:", error); // Log kesalahan
    throw new Error("Inference failed: " + error.message); // Lempar kesalahan dengan pesan yang lebih jelas
  }
};

module.exports = inferenceService;
