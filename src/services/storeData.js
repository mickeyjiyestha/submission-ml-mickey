// src/services/storeData.js
const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();

const storeData = async (data) => {
  try {
    const docRef = firestore.collection("predictions").doc(data.id);
    await docRef.set(data);
    console.log("Data saved successfully:", data);
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
    throw error; // Lempar kembali kesalahan untuk ditangani di handler
  }
};

module.exports = storeData; // Pastikan ini ada
