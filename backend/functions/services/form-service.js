const admin = require('firebase-admin');
const { FieldValue } = require("firebase-admin/firestore");
const db = admin.firestore();

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
    
    const templates = snapshot.docs.map(doc => {
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
    });

    return templates;
  } catch (error) {
    console.error('获取模板列表失败:', error);
    throw error;
  }
}

module.exports = {
  getTemplates,
};