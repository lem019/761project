const functions = require("firebase-functions");

// 一个最简单的 API
exports.helloApi = functions.https.onRequest((req, res) => {
  res.json({ message: "Hello from Firebase Functions (local)!" });
});
