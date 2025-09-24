const admin = require('firebase-admin');
const { FieldValue } = require("firebase-admin/firestore");
const db = admin.firestore();
const { FORM_STATUS } = require('../constants/formStatus');
// const { debugFirestoreQuery } = require('../helper');

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
async function saveForm(uid, formData, userInfo = {}) {
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
    creatorName: userInfo.name || userInfo.email || 'Unknown User',
    creatorEmail: userInfo.email || '',
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
    if (!(existingData.status === FORM_STATUS.PENDING && userInfo.role === 'admin')) {
      if (existingData.creator !== uid) {
        throw new Error('You don\'t have permission to update this form');
      }

      if (existingData.status !== FORM_STATUS.DRAFT && existingData.status !== FORM_STATUS.DECLINED) {
        // admin can update pending form to approved or declined
        throw new Error('Only draft or declined forms can be updated');
      }
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

// 表单状态操作（提交、批准、拒绝等）
async function operateForm(formId, action, uid, role, comment = '') {
  const ref = db.collection("forms").doc(formId);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error('Form not found');
  }

  const formData = doc.data();
  const currentStatus = formData.status;
  let newStatus;
  let updateData = {
    updatedAt: FieldValue.serverTimestamp()
  };

  // 根据操作类型和当前状态确定新状态和权限验证
  switch (action) {
    case 'submit':
      // 只有创建者可以提交，且只能从草稿状态提交
      if (formData.creator !== uid) {
        throw new Error('Only the form creator can submit this form');
      }
      if (currentStatus !== FORM_STATUS.DRAFT) {
        throw new Error('Only draft forms can be submitted');
      }
      newStatus = FORM_STATUS.PENDING;
      updateData.status = newStatus;
      updateData.submittedAt = FieldValue.serverTimestamp();
      break;

    case 'approve':
      // 只有管理员可以批准
      if (role !== 'admin') {
        throw new Error('Only administrators can approve forms');
      }
      if (currentStatus !== FORM_STATUS.PENDING) {
        throw new Error('Only pending forms can be approved');
      }
      newStatus = FORM_STATUS.APPROVED;
      updateData.status = newStatus;
      updateData.reviewedBy = uid;
      updateData.reviewedAt = FieldValue.serverTimestamp();
      if (comment) {
        updateData.reviewComment = comment;
      }
      break;

    case 'decline':
      // 只有管理员可以拒绝
      if (role !== 'admin') {
        throw new Error('Only administrators can decline forms');
      }
      if (currentStatus !== FORM_STATUS.PENDING) {
        throw new Error('Only pending forms can be declined');
      }
      newStatus = FORM_STATUS.DECLINED;
      updateData.status = newStatus;
      updateData.reviewedBy = uid;
      updateData.reviewedAt = FieldValue.serverTimestamp();
      if (comment) {
        updateData.reviewComment = comment;
      }
      break;

    case 'assign':
      // 只有管理员可以分配
      if (role !== 'admin') {
        throw new Error('Only administrators can assign forms');
      }
      if (currentStatus !== FORM_STATUS.PENDING) {
        throw new Error('Only pending forms can be assigned');
      }
      newStatus = FORM_STATUS.ASSIGNED;
      updateData.status = newStatus;
      updateData.assignedTo = uid;
      updateData.assignedAt = FieldValue.serverTimestamp();
      break;

    default:
      throw new Error('Invalid action. Supported actions: submit, approve, decline, assign');
  }

  await ref.update(updateData);
  const updatedDoc = await ref.get();

  return {
    success: true,
    data: {
      formId: formId,
      oldStatus: currentStatus,
      newStatus: newStatus,
      action: action,
      ...updatedDoc.data()
    },
    message: `Form ${action} successfully`
  };
}

// 获取表单列表（支持按状态过滤：all, draft, pending, declined, approved）
async function getFormList(uid, role, options = {}) {
  try {
    const { status, page = 1, pageSize = 10, viewMode } = options;

    // 转换分页参数为数字
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);
    const offset = (pageNum - 1) * pageSizeNum;

    let q = db.collection("forms");

    // 1. 不管是什么角色 role 看 inprogress 状态的表单也就是 draft, pending, declined, approved 都是限定 creator == uid
    // 2. 只有 admin 角色可以看 to review 和 reviewed 的表单，也就是 to review 是 creator 是所有人，然后 状态是 pending。也就是 reviewed 是 reviewer 是 uid 自己，然后 状态是 approved。

    // 根据用户角色、状态和viewMode决定查询条件
    if (viewMode === 'reviewer' && role === 'admin') {
      // reviewer 模式：按照注释中的逻辑
      if (role === 'admin') {
        // 管理员在 reviewer 模式下
        if (status === 'pending') {
          // to review: creator 是所有人，状态是 pending
          q = q.where("status", "==", "pending");
        } else if (status === 'approved') {
          // reviewed: reviewer 是自己，状态是 approved
          q = q.where("status", "==", "approved").where("reviewedBy", "==", uid);
        }
      } else {
        // 检查员在 reviewer 模式下：只能看到自己创建的表单
        q = q.where("creator", "==", uid);
        if (status && status !== 'all') {
          q = q.where("status", "==", String(status));
        }
      }
    } else {
      // 检查员只能看到自己创建的表单
      q = q.where("creator", "==", uid);
      if (status && status !== 'all') {
        q = q.where("status", "==", String(status));
      }
    }

    // 调试查询条件
    // console.log("form query before debug firestore query", status, viewMode);
    // debugFirestoreQuery(q, { uid, role, status, viewMode, page: pageNum, pageSize: pageSizeNum });

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

    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        creatorName: data.creatorName || data.creatorEmail || 'Unknown User',
        createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : '',
        submittedAt: data.submittedAt ? data.submittedAt.toDate().toLocaleString() : '',
        reviewedAt: data.reviewedAt ? data.reviewedAt.toDate().toLocaleString() : ''
      };
    });

    return {
      success: true,
      data: {
        items,
        pagination: {
          current: pageNum,
          pageSize: pageSizeNum,
          total,
          totalPages: Math.ceil(total / pageSizeNum)
        }
      }
    };
  } catch (error) {
    console.error('获取检查员表单列表失败:', error);
    throw error;
  }
}

// 获取单个表单
async function getFormById(formId) {
  try {
    const doc = await db.collection("forms").doc(formId).get();
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      creatorName: data.creatorName || data.creatorEmail || 'Unknown User',
      createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : '',
      submittedAt: data.submittedAt ? data.submittedAt.toDate().toLocaleString() : '',
      reviewedAt: data.reviewedAt ? data.reviewedAt.toDate().toLocaleString() : ''
    };
  } catch (error) {
    console.error('获取表单详情失败:', error);
    throw error;
  }
}

module.exports = {
  getTemplates,
  getTemplateById,
  saveForm,
  assignForm,
  operateForm,
  getFormList,
  getFormById,
};