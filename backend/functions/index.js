/* eslint-disable no-console */
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");

// 初始化 Firebase Admin
admin.initializeApp();

/**
 * 导出 Firebase Function
 * 本项目相对简单, 使用单函数导出 express 比多函数分别导出多个 rest endpoint 有一些好处:
 * 1. 冷启动成本低（更快的响应时间）
 * 2. 内存使用效率高（共享资源）
 * 3. 维护成本低（只需管理一个函数）
 */
// 创建 Express 应用并启用 CORS 和 JSON 解析
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
// 挂载业务路由
const routes = require('./routes');
app.use('/', routes);
exports.api = functions.https.onRequest(app);
