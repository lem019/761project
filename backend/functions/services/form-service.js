const admin = require('firebase-admin');
const { FieldValue } = require("firebase-admin/firestore");
const db = admin.firestore();
const { FORM_STATUS } = require('../constants/formStatus');

// 将 Firestore 文档数据转换为模板对象
function mapTemplateData(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    type: data.type,
    icon: data.icon,
    color: data.color,
    gradient: data.gradient,
    isActive: data.isActive,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null
  };
}

// 获取模板列表
async function getTemplates(options = {}) {
  try {
    const { isActive = true } = options;

    let query = db.collection("formTemplates");

    // 如果指定了isActive参数，则按状态过滤
    if (isActive !== undefined) {
      query = query.where("isActive", "==", isActive === true);
    }

    // 按创建时间排序
    query = query.orderBy("createdAt", "asc");

    const snapshot = await query.get();

    if (snapshot.empty) {
      return [];
    }

    const templates = snapshot.docs.map(doc => mapTemplateData(doc));

    return templates;
  } catch (error) {
    console.error('获取模板列表失败:', error);
    throw error;
  }
}

// 获取特定模板详情
async function getTemplateById(templateId) {
  try {
    const doc = await db.collection("formTemplates").doc(templateId).get();

    if (!doc.exists) {
      return null;
    }

    const baseTemplate = mapTemplateData(doc);
    const data = doc.data();

    return {
      ...baseTemplate,
      // 模板详细配置 - 不强制校验字段名称和类型
      formFields: data.formFields || [],
      inspectionItems: data.inspectionItems || [],
      guidanceContent: data.guidanceContent || {}
    };
  } catch (error) {
    console.error('获取模板详情失败:', error);
    throw error;
  }
}

// 保存表单数据（创建或更新）
async function saveForm(uid, formData) {
  const {
    id, // 如果有ID则是更新，没有则是创建
    type = "a",
    templateId,
    templateName,
    metaData: formFields = {},
    inspectionData = {},
    status = FORM_STATUS.DRAFT // draft, pending, approved, declined
  } = formData;

  const now = FieldValue.serverTimestamp();
  const dataToSave = {
    type,
    templateId,
    templateName,
    metaData: formFields,
    inspectionData,
    status: status,
    creator: uid,
    updatedAt: now
  };

  let result;
  if (id) {
    // 更新现有表单
    const ref = db.collection("forms").doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      throw new Error('Form not found');
    }

    // 检查权限：只有创建者可以更新草稿状态或者被拒绝状态的表单
    const existingData = doc.data();
    if (existingData.creator !== uid) {
      throw new Error('You don\'t have permission to update this form');
    }

    if (existingData.status !== FORM_STATUS.DRAFT && existingData.status !== FORM_STATUS.DECLINED) {
      throw new Error('Only draft or declined forms can be updated');
    }

    await ref.update(dataToSave);
    const updatedDoc = await ref.get();
    result = { id: ref.id, ...updatedDoc.data() };
  } else {
    // 创建新表单
    dataToSave.createdAt = now;
    const ref = await db.collection("forms").add(dataToSave);
    const snap = await ref.get();
    result = { id: ref.id, ...snap.data() };
  }

  return {
    success: true,
    data: result,
    message: 'Form updated successfully'
  };
}

// 分配表单给管理员
async function assignForm(formId, adminUid) {
  try {
    const ref = db.collection("forms").doc(formId);
    const doc = await ref.get();

    if (!doc.exists) {
      throw new Error('Form not found');
    }

    const existingData = doc.data();

    // 只有 pending 状态的表单才能被分配
    if (existingData.status !== FORM_STATUS.PENDING) {
      throw new Error('Only pending forms can be assigned');
    }

    const updateData = {
      status: FORM_STATUS.ASSIGNED,
      assignedTo: adminUid,
      assignedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    await ref.update(updateData);
    const updatedDoc = await ref.get();

    return {
      success: true,
      data: { id: ref.id, ...updatedDoc.data() },
      message: 'Form assigned successfully'
    };
  } catch (error) {
    console.error('分配表单失败:', error);
    throw error;
  }
}

module.exports = {
  getTemplates,
  getTemplateById,
  saveForm,
  assignForm,
};