import * as tf from "@tensorflow/tfjs-node";

async function loadModel() {
  try {
    const modelUrl = process.env.MODEL_URL;
    if (!modelUrl) {
      throw new Error("MODEL_URL is not defined in environment variables.");
    }
    console.log(`Loading model from: ${modelUrl}`);
    const model = await tf.loadGraphModel(modelUrl);
    console.log("Model loaded successfully.");
    return model;
  } catch (error) {
    console.error("Error loading the model:", error.message);
    throw error;
  }
}

export { loadModel };
