/* eslint-disable no-console */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require('express');
const cors = require('cors');

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
app.post("/forms", decodeToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { title = "", type = "a", data = {} } = req.body || {};
    const now = Date.now();
    const ref = await db.collection("forms").add({
      formId: "", // 占位，下面写 docId
      title,
      status: "draft",
      type,
      creatorUid: uid,
      reviewerUid: "",
      createdAt: now,
      submitAt: 0,
      data,
    });
    await ref.update({ formId: ref.id });
    const snap = await ref.get();
    return res.status(201).json({ id: ref.id, ...snap.data() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 修改（提交前编辑草稿）
app.patch("/forms/:id", decodeToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;
    const { title, data, type } = req.body || {};
    const ref = db.collection("forms").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    const it = doc.data();
    if (it.creatorUid !== uid) return res.status(403).json({ error: "forbidden" });
    if (it.status !== "draft") return res.status(400).json({ error: "only_edit_draft" });

    const patch = {};
    if (title !== undefined) patch.title = title;
    if (type !== undefined) patch.type = type;
    if (data !== undefined) patch.data = data;
    await ref.update(patch);
    const fresh = await ref.get();
    return res.json({ id, ...fresh.data() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 提交：draft -> toReview
app.post("/forms/:id/submit", decodeToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;
    const ref = db.collection("forms").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    const it = doc.data();
    if (it.creatorUid !== uid) return res.status(403).json({ error: "forbidden" });
    if (it.status !== "draft") return res.status(400).json({ error: "only_submit_draft" });

    await ref.update({ status: "toReview", submitAt: Date.now() });
    const fresh = await ref.get();
    return res.json({ id, ...fresh.data() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 审核：toReview -> approved/rejected
app.post("/forms/:id/review", decodeToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const role = await getUserRole(uid);
    if (role !== "admin") return res.status(403).json({ error: "admin_only" });

    const { id } = req.params;
    const { action } = req.body || {}; // "approve" | "reject"
    if (!["approve", "reject"].includes(action))
      return res.status(400).json({ error: "invalid_action" });

    const ref = db.collection("forms").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    const it = doc.data();
    if (it.status !== "toReview") return res.status(400).json({ error: "only_review_toreview" });

    const to = action === "approve" ? "approved" : "rejected";
    await ref.update({ status: to, reviewerUid: uid });
    const fresh = await ref.get();
    return res.json({ id, ...fresh.data() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 删除（仅草稿且创建者）
app.delete("/forms/:id", decodeToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;
    const ref = db.collection("forms").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    const it = doc.data();
    if (it.creatorUid !== uid) return res.status(403).json({ error: "forbidden" });
    if (it.status !== "draft") return res.status(400).json({ error: "only_delete_draft" });

    await ref.delete();
    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 查询列表（支持 status & mine）
app.get("/forms", decodeToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const role = await getUserRole(uid);
    const { status, mine } = req.query;
    let q = db.collection("forms");

    if (status) q = q.where("status", "==", String(status));
    if (mine === "true" || role === "primary") {
      q = q.where("creatorUid", "==", uid);
    }

    const snap = await q.orderBy("createdAt", "desc").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.json(items);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// 获取单条
app.get("/forms/:id", decodeToken, async (req, res) => {
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
