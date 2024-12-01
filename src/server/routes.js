// src/server/routes.js
const { predictHandler } = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/predict",
    options: {
      payload: {
        multipart: true, // Mengizinkan multipart
        output: "stream", // Mengizinkan output stream
        parse: true, // Memungkinkan parsing payload
      },
    },
    handler: predictHandler,
  },
];

module.exports = routes;
