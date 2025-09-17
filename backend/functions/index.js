/* eslint-disable no-console */
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");

// 初始化 Firebase Admin
admin.initializeApp();

// 创建 Express 应用并启用 CORS 和 JSON 解析
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// 挂载业务路由
const routes = require('./routes');
app.use('/', routes);

// 导出 Firebase Function
exports.api = functions.https.onRequest(app);
