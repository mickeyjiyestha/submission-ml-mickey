const tf = require("@tensorflow/tfjs-node");

let model;

const loadModel = async () => {
  if (!model) {
    try {
      console.log("Loading model...");
      model = await tf.loadGraphModel(
        "https://storage.googleapis.com/model-ml-submission-mickey/model.json"
      );
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error); // Log kesalahan
      throw new Error("Model could not be loaded.");
    }
  }
  return model;
};

module.exports = loadModel;
