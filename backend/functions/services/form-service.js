const admin = require('firebase-admin');
const { FieldValue } = require("firebase-admin/firestore");
const db = admin.firestore();

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

module.exports = {
  getTemplates,
  getTemplateById,
};