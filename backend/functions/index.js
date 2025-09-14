/* eslint-disable no-console */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const express = require("express");
const cors = require("cors");

// 初始化 Firebase Admin
admin.initializeApp();

// 创建 Express 应用并启用 CORS 和 JSON 解析
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// 挂载业务路由
const routes = require('./routes');
app.use('/', routes);




const db = admin.firestore();


// 允许本地前端
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

// ---- 工具：从 Authorization 里解析并校验 idToken ----
async function decodeToken(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    const m = h.match(/^Bearer (.+)$/i);
    if (!m) return res.status(401).json({ error: "no_token" });
    const decoded = await admin.auth().verifyIdToken(m[1], true);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "invalid_token", detail: e.message });
  }
}

// ---- 工具：读取 users/{uid} 的角色 ----
async function getUserRole(uid) {
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const data = snap.data();
  return data?.role || null;
}

// ---- 健康检查 ----
app.get("/health", (_req, res) => res.json({ ok: true }));

// ======================= AUTH =======================
// 说明：我们用 Auth Emulator 的 REST 登录；注册走 admin.createUser + 建 users 文档，再自动登录一次返回 idToken
const AUTH_EMULATOR_HOST =
  process.env.FIREBASE_AUTH_EMULATOR_HOST || "localhost:9099";
const AUTH_REST_BASE = `http://${AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1`;

async function emulatorSignInWithPassword(email, password) {
  const url = `${AUTH_REST_BASE}/accounts:signInWithPassword?key=fake-key`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error?.message || "signIn_failed");
  }
  return data; // { idToken, refreshToken, localId, ... }
}



// ======================= FORMS =======================
// 创建：status=draft, type=a, formId=docId
app.post("/forms", async (req, res) => {
  try {
    // const uid = req.user.uid;
    const uid = "1234567890";
    const { type = "a" } = req.body || {};
    const now = Date.now();
    const ref = await db.collection("forms").add({
      type,
      creator: uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      status: 0,
    });
    const snap = await ref.get();
    return res.status(200).json({ id: ref.id, ...snap.data() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 删除（仅草稿且创建者）
app.delete("/forms/:id", async (req, res) => {
  try {
    // const uid = req.user.uid;
    const uid = "1234567890";
    const { id } = req.params;
    const ref = db.collection("forms").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(200).json({ 
      error: "FORM_NOT_FOUND",
      code: 1001,
      message: "The requested form does not exist"
    });
    const it = doc.data();
    if (it.creator !== uid) return res.status(200).json({ 
      error: "FORM_ACCESS_DENIED",
      code: 1002, 
      message: "You don't have permission to delete this form"
    });
    if (it.status !== 0) return res.status(200).json({ 
      error: "FORM_NOT_DRAFT",
      code: 1003,
      message: "Only draft forms can be deleted"
    });

    await ref.delete();
    return res.status(200).end();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 查询列表（支持 status & mine & 分页）
app.get("/forms", async (req, res) => {
  try {
    const uid = "1234567890";
    // const uid = req.user.uid;
    // const role = await getUserRole(uid);
    const { status, formType, page = 1, pageSize = 10 } = req.query;
    
    // 转换分页参数为数字
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);
    const offset = (pageNum - 1) * pageSizeNum;
    
    let q = db.collection("forms");

    if (status) q = q.where("status", "==", String(status));
    if (formType) q = q.where("type", "==", String(formType));
    q = q.where("creator", "==", uid);

    // 先获取总数（用于分页信息）
    const countQuery = q;
    const countSnap = await countQuery.get();
    const total = countSnap.size;

    // 获取分页数据
    const snap = await q
      .orderBy("createdAt", "desc")
      .offset(offset)
      .limit(pageSizeNum)
      .get();

    console.log(snap.docs);
    
    const items = snap.docs.map((d) => ({ 
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt.toDate().toLocaleString() 
    }));
    
    return res.json({
      items,
      pagination: {
        current: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum)
      }
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 获取单条
app.get("/forms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("forms").doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    return res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

exports.api = functions.https.onRequest(app);
