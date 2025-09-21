const admin = require('firebase-admin');
const path = require('path');

// 初始化Firebase Admin（如果还没有初始化）
function initializeFirebase() {
  if (!admin.apps.length) {
    // 使用相对路径指向backend/functions目录
    const serviceAccountPath = path.join(__dirname, '../backend/functions/serviceAccountKey.json');
    
    try {
      // 尝试加载服务账户密钥文件
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (error) {
      // 如果没有服务账户密钥文件，使用默认凭据（适用于本地开发）
      console.log('使用默认凭据初始化Firebase Admin...');
      admin.initializeApp({
        projectId: 'demo-project-id'
      });
    }
  }
}

// 初始化模板数据
const templates = [
  {
    id: 'pmr',
    name: 'PMR Maintenance Service Check',
    description: 'PMR维护服务检查表单',
    type: 'pmr',
    icon: 'ToolOutlined',
    color: '#1890ff',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'booth',
    name: 'Booth Maintenance Service Check',
    description: '展位维护服务检查表单',
    type: 'booth',
    icon: 'SettingOutlined',
    color: '#52c41a',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'dynapumps',
    name: 'Dynapumps Booth Maintenance Service Check',
    description: 'Dynapumps展位维护服务检查表单',
    type: 'dynapumps',
    icon: 'SafetyOutlined',
    color: '#722ed1',
    gradient: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

// 初始化模板数据到数据库
async function initTemplates() {
  try {
    initializeFirebase();
    
    const db = admin.firestore();
    db.settings({
      host: 'localhost:8081',  // Firestore模拟器端口
      ssl: false
    });
    const batch = db.batch();
    
    // 清空现有的模板数据
    const existingTemplates = await db.collection('formTemplates').get();
    existingTemplates.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // 添加新的模板数据
    templates.forEach(template => {
      const templateRef = db.collection('formTemplates').doc(template.id);
      batch.set(templateRef, template);
    });
    
    await batch.commit();
    console.log('✅ 模板数据初始化成功！');
    console.log(`📝 已添加 ${templates.length} 个模板:`);
    templates.forEach(template => {
      console.log(`   - ${template.name} (${template.id})`);
    });
    
    return templates;
  } catch (error) {
    console.error('❌ 初始化模板数据失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initTemplates()
    .then(() => {
      console.log('✅ 模板初始化完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 模板初始化失败:', error);
      process.exit(1);
    });
}

module.exports = { 
  initTemplates, 
  templates 
};
