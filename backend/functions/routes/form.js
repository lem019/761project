const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const db = admin.firestore();

/**
 * todo
 * 1. get form template list
 * 2. get specific form template detail
 * 3. save form data (create or update) (review also use this api - as we use NOSQL database)
 * 4. change form status (submit, decline, approve)
 * 5. get inspector form list (all, draft, pending, declined, approved)
 * 6. search form by text
 */

// 创建：status=draft, type=a, formId=docId
router.post("/add", async (req, res) => {
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
router.delete("/delete/:id", async (req, res) => {
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
router.get("/list", async (req, res) => {
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
router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("forms").doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    return res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;