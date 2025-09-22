const admin = require('firebase-admin');
const path = require('path');

// 表单状态常量
const FORM_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  APPROVED: 'approved',
  DECLINED: 'declined'
};

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

// 模拟用户数据
const mockUsers = [
  {
    uid: 'grass-otter-309',
    email: 'grass.otter.309@example.com',
    name: 'Grass Otter',
    role: 'inspector'
  },
  {
    uid: 'admin-mocker-384', 
    email: 'raccoon.panda.384@thermoflo.co.nz',
    name: 'AdminMocker',
    role: 'admin'
  },
  {
    uid: 'tech-specialist-001',
    email: 'alex.tech@thermoflo.co.nz', 
    name: 'Alex Tech Specialist',
    role: 'inspector'
  }
];

// 测试数据生成器
function generateTestData(templateId, status, user, index) {
  const baseData = {
    inspector: `test-inspector-${status}-${index}`,
    inspectorMobile: `0400 ${String(index).padStart(3, '0')} ${String(index + 100).padStart(3, '0')}`,
    date: `${String(15 + index).padStart(2, '0')}/09/2025`,
    locationDetails: `test-location-${status}-${index} - ${templateId} inspection area`,
    contactPerson: `test-contact-${status}-${index}`,
    businessName: `TEST-${status.toUpperCase()}-${templateId.toUpperCase()}-${index}`,
    address: `${index} Test Street, ${status} District`,
    suburb: `Test-${status} QLD ${4000 + index}`,
    phone: `07 ${String(3000 + index).padStart(4, '0')} ${String(1000 + index).padStart(4, '0')}`,
    email: `test-${status}-${index}@${templateId}.test.com`
  };

  return baseData;
}

// 生成检查项数据
function generateInspectionData(templateId, status, index, formCreatedAt) {
  const inspectionTemplates = {
    pmr: {
      sprayBoothMake: 'Spray Booth Make',
      purgeCycles: 'Purge Cycles',
      exhaustAirflow: 'Exhaust Airflow'
    },
    booth: {
      boothStructure: 'Booth Structure',
      electricalSystem: 'Electrical System',
      safetyEquipment: 'Safety Equipment'
    },
    dynapumps: {
      pumpSystem: 'Pump System',
      controlPanel: 'Control Panel',
      safetyValves: 'Safety Valves'
    }
  };

  const template = inspectionTemplates[templateId] || {};
  const inspectionData = {};

  Object.keys(template).forEach(key => {
    const statuses = ['completed', 'in_progress', 'pending'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    let completedAt = null;
    if (randomStatus === 'completed') {
      // 完成时间在表单创建时间之后1-5天
      const completedDaysAfter = Math.floor(Math.random() * 5) + 1;
      const completedDate = new Date(formCreatedAt.toDate());
      completedDate.setDate(completedDate.getDate() + completedDaysAfter);
      completedAt = admin.firestore.Timestamp.fromDate(completedDate);
    }
    
    inspectionData[key] = {
      status: randomStatus,
      notes: `test-${status}-notes-${index}: ${template[key]} inspection completed with ${randomStatus} status`,
      images: randomStatus === 'completed' ? ['/api/placeholder/400/300'] : [],
      completedAt: completedAt
    };
  });

  return inspectionData;
}

// 生成表单数据
function generateForms() {
  const forms = [];
  const templates = ['pmr', 'booth', 'dynapumps'];
  const statuses = [FORM_STATUS.DRAFT, FORM_STATUS.PENDING, FORM_STATUS.ASSIGNED, FORM_STATUS.APPROVED, FORM_STATUS.DECLINED];
  
  // 计算1-2个月前的时间范围
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  // 为每个用户生成表单
  mockUsers.forEach((user, userIndex) => {
    // 每个用户每种状态生成 2-3 个表单
    statuses.forEach(status => {
      const formCount = Math.floor(Math.random() * 2) + 2; // 2-3 个表单
      
      for (let i = 0; i < formCount; i++) {
        const templateId = templates[Math.floor(Math.random() * templates.length)];
        const formIndex = userIndex * 20 + statuses.indexOf(status) * 3 + i + 1;
        
        // 为每个表单生成不同的时间（1-2个月前的随机时间）
        const randomDaysAgo = Math.floor(Math.random() * 30); // 0-29天前
        const formCreatedAt = new Date(twoMonthsAgo);
        formCreatedAt.setDate(formCreatedAt.getDate() + randomDaysAgo);
        const formCreatedAtTimestamp = admin.firestore.Timestamp.fromDate(formCreatedAt);
        
        const form = {
          type: templateId,
          templateId: templateId,
          templateName: getTemplateName(templateId),
          metaData: generateTestData(templateId, status, user, formIndex),
          inspectionData: generateInspectionData(templateId, status, formIndex, formCreatedAtTimestamp),
          status: status,
          creator: user.uid,
          creatorName: user.name || user.email || 'Unknown User',
          creatorEmail: user.email || '',
          createdAt: formCreatedAtTimestamp,
          updatedAt: formCreatedAtTimestamp
        };

        // 根据状态添加额外字段
        if (status === FORM_STATUS.APPROVED || status === FORM_STATUS.DECLINED) {
          form.reviewedBy = 'admin-mocker-384';
          // 审核时间在创建时间之后1-7天
          const reviewDaysAfter = Math.floor(Math.random() * 7) + 1;
          const reviewDate = new Date(formCreatedAtTimestamp.toDate());
          reviewDate.setDate(reviewDate.getDate() + reviewDaysAfter);
          form.reviewedAt = admin.firestore.Timestamp.fromDate(reviewDate);
          form.reviewComment = status === FORM_STATUS.APPROVED 
            ? `test-approval-comment-${formIndex}: All inspections completed satisfactorily.`
            : `test-decline-comment-${formIndex}: Multiple issues identified requiring immediate attention.`;
        }

        if (status === FORM_STATUS.ASSIGNED) {
          form.assignedTo = 'admin-mocker-384';
          // 分配时间在创建时间之后1-3天
          const assignDaysAfter = Math.floor(Math.random() * 3) + 1;
          const assignDate = new Date(formCreatedAtTimestamp.toDate());
          assignDate.setDate(assignDate.getDate() + assignDaysAfter);
          form.assignedAt = admin.firestore.Timestamp.fromDate(assignDate);
        }

        forms.push(form);
      }
    });
  });

  return forms;
}

// 获取模板名称
function getTemplateName(templateId) {
  const templateNames = {
    pmr: 'PMR Maintenance Service Check',
    booth: 'Booth Maintenance Service Check',
    dynapumps: 'Dynapumps Booth Maintenance Service Check'
  };
  return templateNames[templateId] || 'Unknown Template';
}

// 初始化表单数据到数据库
async function initForms() {
  try {
    initializeFirebase();
    
    const db = admin.firestore();
    db.settings({
      host: 'localhost:8081',  // Firestore模拟器端口
      ssl: false
    });
    
    const batch = db.batch();
    
    // 清空现有的表单数据
    console.log('🗑️  清空现有表单数据...');
    const existingForms = await db.collection('forms').get();
    existingForms.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // 生成新的表单数据
    console.log('📝 生成测试表单数据...');
    const forms = generateForms();
    
    // 添加新的表单数据
    forms.forEach(form => {
      const formRef = db.collection('forms').doc();
      batch.set(formRef, form);
    });
    
    await batch.commit();
    console.log('✅ 表单数据初始化成功！');
    console.log(`📊 已添加 ${forms.length} 个表单`);
    
    // 按用户和状态分组显示
    const userGroups = {};
    forms.forEach((form, index) => {
      const user = mockUsers.find(u => u.uid === form.creator);
      const userName = user ? user.name : 'Unknown User';
      
      if (!userGroups[userName]) {
        userGroups[userName] = {};
      }
      
      if (!userGroups[userName][form.status]) {
        userGroups[userName][form.status] = [];
      }
      
      userGroups[userName][form.status].push({
        index: index + 1,
        templateName: form.templateName,
        inspector: form.metaData.inspector,
        businessName: form.metaData.businessName
      });
    });
    
    // 状态显示名称
    const statusNames = {
      [FORM_STATUS.DRAFT]: 'Draft (草稿)',
      [FORM_STATUS.PENDING]: 'Pending (待审核)',
      [FORM_STATUS.ASSIGNED]: 'Assigned (已分配)',
      [FORM_STATUS.APPROVED]: 'Approved (已批准)',
      [FORM_STATUS.DECLINED]: 'Declined (已拒绝)'
    };
    
    // 显示统计信息
    Object.keys(userGroups).forEach(userName => {
      console.log(`\n👤 ${userName}:`);
      Object.keys(statusNames).forEach(status => {
        if (userGroups[userName][status]) {
          const count = userGroups[userName][status].length;
          console.log(`   📋 ${statusNames[status]}: ${count} 个表单`);
          userGroups[userName][status].forEach(form => {
            console.log(`      ${form.index}. ${form.templateName} - ${form.inspector} (${form.businessName})`);
          });
        }
      });
    });
    
    // 总体统计
    console.log('\n📈 总体统计:');
    const statusCounts = {};
    forms.forEach(form => {
      statusCounts[form.status] = (statusCounts[form.status] || 0) + 1;
    });
    
    Object.keys(statusNames).forEach(status => {
      const count = statusCounts[status] || 0;
      console.log(`   ${statusNames[status]}: ${count} 个表单`);
    });
    
    return forms;
  } catch (error) {
    console.error('❌ 初始化表单数据失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initForms()
    .then(() => {
      console.log('\n✅ 表单初始化完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 表单初始化失败:', error);
      process.exit(1);
    });
}

module.exports = { 
  initForms, 
  generateForms,
  mockUsers
};