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

// 初始化表单数据
// template 需要对应 initTemplates.js 中的模板
const forms = [
  {
    // PMR 维护服务检查表单 - 草稿状态
    type: 'pmr',
    // template 需要对应 initTemplates.js 中的模板
    templateId: 'pmr',
    templateName: 'PMR Maintenance Service Check',
    metaData: {
      inspector: 'John Smith',
      inspectorMobile: '0408 742 659',
      date: '17/09/2025',
      locationDetails: 'Main workshop area, Building A',
      contactPerson: 'Andrew Buck',
      businessName: 'DYNAPUMPS',
      address: '22 Homestead Drive',
      suburb: 'StaplYton QLD 4207',
      phone: '0459 578 705',
      email: 'Andrew.Buck@dynapumps.com'
    },
    inspectionData: {
      sprayBoothMake: {
        status: 'completed',
        notes: 'Booth structure appears in good condition',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      purgeCycles: {
        status: 'completed', 
        notes: 'Purge cycles operating within normal parameters',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      exhaustAirflow: {
        status: 'completed',
        notes: 'Airflow measurements within acceptable range',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    },
    status: FORM_STATUS.DRAFT,
    creator: 'grass-otter-309',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    // 展位维护服务检查表单 - 待审核状态
    type: 'booth',
    templateId: 'booth', 
    templateName: 'Booth Maintenance Service Check',
    metaData: {
      inspector: 'Sarah Johnson',
      inspectorMobile: '0412 345 678',
      date: '16/09/2025',
      locationDetails: 'Production floor, Section B',
      contactPerson: 'Mike Wilson',
      businessName: 'AUTO SPRAY SOLUTIONS',
      address: '45 Industrial Way',
      suburb: 'Brisbane QLD 4000',
      phone: '07 3000 1234',
      email: 'mike.wilson@autospray.com.au'
    },
    inspectionData: {
      boothStructure: {
        status: 'completed',
        notes: 'Structural integrity verified, minor wear on door seals',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      electricalSystem: {
        status: 'completed',
        notes: 'All electrical systems functioning properly',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      safetyEquipment: {
        status: 'completed',
        notes: 'Safety equipment in place and functional',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    },
    status: FORM_STATUS.PENDING,
    creator: 'admin-mocker-384',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    // Dynapumps 展位维护服务检查表单 - 已批准状态
    type: 'dynapumps',
    templateId: 'dynapumps',
    templateName: 'Dynapumps Booth Maintenance Service Check', 
    metaData: {
      inspector: 'John Smith',
      inspectorMobile: '0408 742 659',
      date: '15/09/2025',
      locationDetails: 'Pump station area, Ground floor',
      contactPerson: 'Andrew Buck',
      businessName: 'DYNAPUMPS',
      address: '22 Homestead Drive',
      suburb: 'StaplYton QLD 4207',
      phone: '0459 578 705',
      email: 'Andrew.Buck@dynapumps.com'
    },
    inspectionData: {
      pumpSystem: {
        status: 'completed',
        notes: 'Pump system operating efficiently, pressure readings normal',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      controlPanel: {
        status: 'completed',
        notes: 'Control panel functioning correctly, all indicators green',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      safetyValves: {
        status: 'completed',
        notes: 'Safety valves tested and operating within specifications',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    },
    status: FORM_STATUS.APPROVED,
    creator: 'grass-otter-309',
    reviewedBy: 'admin-mocker-384',
    reviewComment: 'All inspections completed satisfactorily. System operating within normal parameters.',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    reviewedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    // PMR 维护服务检查表单 - 已拒绝状态
    type: 'pmr',
    templateId: 'pmr',
    templateName: 'PMR Maintenance Service Check',
    metaData: {
      inspector: 'Sarah Johnson',
      inspectorMobile: '0412 345 678',
      date: '14/09/2025',
      locationDetails: 'Secondary workshop, Building C',
      contactPerson: 'Lisa Brown',
      businessName: 'INDUSTRIAL MAINTENANCE CO',
      address: '78 Factory Street',
      suburb: 'Gold Coast QLD 4215',
      phone: '07 5555 9876',
      email: 'lisa.brown@indmaintenance.com.au'
    },
    inspectionData: {
      sprayBoothMake: {
        status: 'completed',
        notes: 'Booth structure shows signs of wear, panels need replacement',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      purgeCycles: {
        status: 'completed',
        notes: 'Purge cycle timing needs adjustment',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      exhaustAirflow: {
        status: 'completed',
        notes: 'Airflow below minimum requirements',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    },
    status: FORM_STATUS.DECLINED,
    creator: 'admin-mocker-384',
    reviewedBy: 'admin-mocker-384',
    reviewComment: 'Multiple issues identified requiring immediate attention. Please address structural concerns and airflow problems before resubmission.',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    reviewedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    // 展位维护服务检查表单 - 草稿状态（部分填写）
    type: 'booth',
    templateId: 'booth',
    templateName: 'Booth Maintenance Service Check',
    metaData: {
      inspector: 'John Smith',
      inspectorMobile: '0408 742 659',
      date: '18/09/2025',
      locationDetails: 'New installation area',
      contactPerson: 'Tom Anderson',
      businessName: 'PREMIUM AUTO SERVICES',
      address: '123 Service Road',
      suburb: 'Melbourne VIC 3000',
      phone: '03 9000 5555',
      email: 'tom.anderson@premiumauto.com.au'
    },
    inspectionData: {
      boothStructure: {
        status: 'in_progress',
        notes: 'Initial inspection started',
        images: [],
        completedAt: null
      },
      electricalSystem: {
        status: 'pending',
        notes: '',
        images: [],
        completedAt: null
      },
      safetyEquipment: {
        status: 'pending',
        notes: '',
        images: [],
        completedAt: null
      }
    },
    status: FORM_STATUS.DRAFT,
    creator: 'tech-specialist-001',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    // 展位维护服务检查表单 - 已分配状态
    type: 'booth',
    templateId: 'booth',
    templateName: 'Booth Maintenance Service Check',
    metaData: {
      inspector: 'Sarah Johnson',
      inspectorMobile: '0412 345 678',
      date: '19/09/2025',
      locationDetails: 'Maintenance workshop, Building D',
      contactPerson: 'David Wilson',
      businessName: 'INDUSTRIAL SERVICES LTD',
      address: '99 Factory Road',
      suburb: 'Sydney NSW 2000',
      phone: '02 9000 8888',
      email: 'david.wilson@industrialservices.com.au'
    },
    inspectionData: {
      boothStructure: {
        status: 'completed',
        notes: 'Initial inspection completed, awaiting detailed review',
        images: ['/api/placeholder/400/300'],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      electricalSystem: {
        status: 'pending',
        notes: '',
        images: [],
        completedAt: null
      },
      safetyEquipment: {
        status: 'pending',
        notes: '',
        images: [],
        completedAt: null
      }
    },
    status: FORM_STATUS.ASSIGNED,
    creator: 'admin-mocker-384',
    assignedTo: 'admin-mocker-384',
    assignedAt: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

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
    const existingForms = await db.collection('forms').get();
    existingForms.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // 添加新的表单数据
    forms.forEach(form => {
      const formRef = db.collection('forms').doc();
      batch.set(formRef, form);
    });
    
    await batch.commit();
    console.log('✅ 表单数据初始化成功！');
    console.log(`📝 已添加 ${forms.length} 个表单:`);
    
    // 按状态分组显示
    const statusGroups = {
      [FORM_STATUS.DRAFT]: 'Draft (草稿)',
      [FORM_STATUS.PENDING]: 'Pending (待审核)',
      [FORM_STATUS.ASSIGNED]: 'Assigned (已分配)',
      [FORM_STATUS.APPROVED]: 'Approved (已批准)',
      [FORM_STATUS.DECLINED]: 'Declined (已拒绝)'
    };
    
    const groupedForms = forms.reduce((acc, form, index) => {
      const status = form.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push({ index: index + 1, name: form.templateName, creator: form.creator });
      return acc;
    }, {});
    
    Object.keys(statusGroups).forEach(status => {
      if (groupedForms[status]) {
        console.log(`\n📋 ${statusGroups[status]} (${groupedForms[status].length} 个):`);
        groupedForms[status].forEach(form => {
          console.log(`   ${form.index}. ${form.name} - 创建者: ${form.creator}`);
        });
      }
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
  forms,
  mockUsers
};
