const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const db = admin.firestore();
const { authMiddleware } = require('../middleware/auth');
const { getTemplates, getTemplateById, saveForm, operateForm, getFormList, getFormById } = require('../services/form-service');

// 应用认证中间件到所有路由
router.use(authMiddleware);

/**
 * todo
 * 1. get form template list ✓
 * 2. get specific form template detail ✓
 * 2.1 edit draft form item (与上面2不同的是，这里有 id 字段有数据)
 * 2.2 edit decline form item (与上面2和2.1不同的是，这里有 id 字段有数据 有评论)
 * 3. save form data (create or update)  ✓ (review also use this api - as we use NOSQL database)
 * 4. change form status (submit ✓, decline, approve) - name: form operate
 * 5. get inspector form list (all, draft, pending-inspector-view, pending-reviewer-view, declined, approved-inspector-view, reviewed-approved-reviewer-view)
 * 6. search form by text
 */

// todo 不要在 controller 这里使用 code:200 404 500 这种，使用业务自定义 code 应该，这不是 http 状态嘛

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

// 获取表单列表（支持按状态过滤：all, draft, pending, declined, approved）
router.get("/form-list", async (req, res) => {
  try {
    const uid = req.user.uid; // 从认证中间件获取真实用户ID
    const role = req.user.role; // 从认证中间件获取用户角色
    console.log("form list query", req.query, uid, role);
    const { status, page = 1, pageSize = 10, viewMode } = req.query;
    // 支持 status 为逗号分隔的列表，例如 "draft,pending"
    const normalizedStatus = typeof status === 'string'
      ? status.split(',').map(s => s.trim()).filter(Boolean)
      : 'all';
    
    const result = await getFormList(uid, role, {
      status: normalizedStatus || 'all',
      page: page || 1,
      pageSize: pageSize || 20,
      viewMode: viewMode || 'inspector'
    });
    
    return res.json({
      code: 200,
      message: 'Success',
      data: result.data
    });
  } catch (e) {
    console.error('获取检查员表单列表失败:', e);
    return res.status(500).json({ 
      code: 500,
      message: 'Internal Server Error',
      error: e.message 
    });
  }
});

// 获取单条
router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const form = await getFormById(id);
    if (!form) {
      return res.status(500).json({ 
        code: 500,
        message: 'Form not found',
        data: null
      });
    }
    return res.json({
      code: 200,
      message: 'Success',
      data: form
    });
  } catch (e) {
    console.error('获取表单详情失败:', e);
    return res.status(500).json({ 
      code: 500,
      message: 'Internal Server Error',
      error: e.message 
    });
  }
});

// 保存表单数据（创建或更新）
router.post("/save", async (req, res) => {
  try {
    const uid = req.user.uid; // 从认证中间件获取真实用户ID
    const userInfo = {
      email: req.user.email,
      name: req.user.name || req.user.email, // 如果没有name，使用email作为name
      role: req.user.role || 'primary'
    };
    const result = await saveForm(uid, req.body, userInfo);

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