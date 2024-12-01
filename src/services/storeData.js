import { Firestore } from "@google-cloud/firestore";

// Inisialisasi Firestore
const db = new Firestore();

// Referensi koleksi predictions
const predictionsCollection = db.collection("predictions");

// Fungsi untuk menyimpan data prediksi ke Firestore
async function storeData(id, data) {
  try {
    // Menyimpan data ke Firestore dengan id yang unik
    await predictionsCollection.doc(id).set(data);
    return { success: true };
  } catch (error) {
    // Menangani error dan memberikan informasi yang lebih jelas
    console.error("Error in storeData:", error);
    return {
      success: false,
      error: error.message || "Failed to store data", // Detail pesan error
    };
  }
}

// Ekspor predictionsCollection dan storeData untuk digunakan di file lain
export { predictionsCollection, storeData };
