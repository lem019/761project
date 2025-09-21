const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const db = admin.firestore();
const { authMiddleware, checkAdmin } = require('../middleware/auth');
const { getTemplates, getTemplateById, saveForm, operateForm } = require('../services/form-service');
const { FORM_STATUS } = require('../constants/formStatus');

// 应用认证中间件到所有路由
router.use(authMiddleware);

/**
 * todo
 * 1. get form template list ✓
 * 2. get specific form template detail ✓
 * 2.1 edit draft form item (与上面2不同的是，这里有 id 字段有数据)
 * 2.2 edit decline form item (与上面2和2.1不同的是，这里有 id 字段有数据 有评论)
 * 3. save form data (create or update)  ✓ (review also use this api - as we use NOSQL database)
 * 4. change form status (submit, decline, approve) - name: form operate
 * 5. get inspector form list (all, draft, pending, declined, approved)
 * 6. search form by text
 */

// 获取表单模板列表
router.get("/templates", async (req, res) => {
  try {
    const { isActive } = req.query;
    
    const options = {};
    if (isActive !== undefined) {
      options.isActive = isActive === 'true';
    }
    
    const templates = await getTemplates(options);

    return res.json({
      code: 200,
      message: 'Success',
      data: templates
    });
  } catch (e) {
    console.error('获取模板列表失败:', e);
    return res.status(500).json({ 
      code: 500,
      message: 'Internal Server Error',
      error: e.message 
    });
  }
});

// 获取特定模板详情
router.get("/templates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await getTemplateById(id);
    
    if (!template) {
      return res.status(404).json({
        code: 404,
        message: 'Template not found',
        data: null
      });
    }

    return res.json({
      code: 200,
      message: 'Success',
      data: template
    });
  } catch (e) {
    console.error('获取模板详情失败:', e);
    return res.status(500).json({ 
      code: 500,
      message: 'Internal Server Error',
      error: e.message 
    });
  }
});

// 查询列表（支持 status & mine & 分页）
router.get("/list", async (req, res) => {
  try {
    const uid = req.user.uid; // 从认证中间件获取真实用户ID
    const role = req.user.role; // 从认证中间件获取用户角色
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

// 保存表单数据（创建或更新）
router.post("/save", async (req, res) => {
  try {
    const uid = req.user.uid; // 从认证中间件获取真实用户ID
    const result = await saveForm(uid, req.body);

    return res.json({
      code: 200,
      message: result.message,
      data: result.data
    });
  } catch (e) {
    console.error('保存表单数据失败:', e);

    return res.status(500).json({ 
      code: 500,
      message: e.message,
      error: e.message 
    });
  }
});

// 表单状态操作（提交、拒绝、批准等）
router.post("/operate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body;
    const uid = req.user.uid;
    const role = req.user.role;
    
    if (!action) {
      return res.status(400).json({ 
        code: 400, 
        message: "Action is required" 
      });
    }

    const result = await operateForm(id, action, uid, role, comment);
    
    return res.json({
      code: 200,
      message: result.message,
      data: result.data
    });
  } catch (e) {
    console.error('表单状态操作失败:', e);
    return res.status(500).json({ 
      code: 500,
      message: e.message,
      error: e.message 
    });
  }
});

module.exports = router;