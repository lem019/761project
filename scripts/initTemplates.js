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
    description: '',//删去中文
    type: 'pmr',
    icon: 'ToolOutlined',
    color: '#1890ff',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
    isActive: true,
    // 表单字段的配置
    formFields: [
      {
        name: 'inspector',
        label: 'Inspector',
        type: 'input',
        required: true,
        placeholder: 'Please enter inspector name',
        validation: { required: true, message: 'Please enter inspector name' }
      },
      {
        name: 'inspectorMobile',
        label: 'Inspector Mobile',
        type: 'input',
        required: false,
        placeholder: 'Please enter inspector mobile number',
        validation: { pattern: '^[0-9+\\-\\s()]+$', message: 'Please enter a valid mobile number' }
      },
      {
        name: 'date',
        label: 'Date',
        type: 'datePicker',
        required: true,
        placeholder: 'dd/mm/yyyy',
        format: 'DD/MM/YYYY',
        validation: { required: true, message: 'Please select inspection date' }
      },
      {
        name: 'locationDetails',
        label: 'Locations Details',
        type: 'textarea',
        required: false,
        placeholder: 'Please enter location details',
        rows: 3
      },
      {
        name: 'contactPerson',
        label: 'Contact Person',
        type: 'input',
        required: false,
        placeholder: 'Please enter contact person name'
      },
      {
        name: 'businessName',
        label: 'Business Name',
        type: 'input',
        required: false,
        placeholder: 'Please enter business name'
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: false,
        placeholder: 'Please enter business address',
        rows: 3
      },
      {
        name: 'suburb',
        label: 'Suburb',
        type: 'input',
        required: false,
        placeholder: 'Please enter suburb/area'
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'input',
        required: false,
        placeholder: 'Please enter phone number',
        validation: { pattern: '^[0-9+\\-\\s()]+$', message: 'Please enter a valid phone number' }
      },
      {
        name: 'email',
        label: 'Email',
        type: 'input',
        required: true,
        placeholder: 'Please enter email address',
        validation: { 
          required: true, 
          message: 'Please enter email address',
          type: 'email',
          message: 'Please enter a valid email address'
        }
      }
    ],
    // 检查项的配置
    inspectionItems: [
      {
        key: 'sprayBoothMake',
        name: 'Spray Booth Make',
        type: 'visual',
        tag: 'visual',
        required: true
      },
      {
        key: 'purgeCycles',
        name: 'Purge Cycles',
        type: 'operation',
        tag: 'Operation',
        required: true
      },
      {
        key: 'exhaustAirflow',
        name: 'Exhaust Airflow Spraybooth Downdraught spray booth',
        type: 'measurement',
        tag: 'hot wire probe',
        required: true
      }
    ],
    // 指导内容的配置
    guidanceContent: {
      sprayBoothMake: {
        checklist: [
          "Check the overall structure of the spray booth for integrity, confirm all panels are securely connected",
          "View inspection diagram",
          "Verify the ventilation system is working properly, check fan operation sounds",
          "Watch guidance video"
        ],
        image: "/api/placeholder/400/300"
      },
      purgeCycles: {
        checklist: [
          "Check purge cycle timing and frequency settings",
          "View purge system diagram",
          "Verify purge valve operation and pressure readings",
          "Watch purge cycle demonstration video"
        ],
        image: "/api/placeholder/400/300"
      },
      exhaustAirflow: {
        checklist: [
          "Check exhaust fan operation and airflow direction",
          "View airflow measurement diagram",
          "Verify downdraught system functionality",
          "Watch airflow testing video"
        ],
        image: "/api/placeholder/400/300"
      }
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'booth',
    name: 'Booth Maintenance Service Check',
    description: ' ',//删去中文
    type: 'booth',
    icon: 'SettingOutlined',
    color: '#52c41a',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
    isActive: true,
    // 表单字段的配置
    formFields: [
      {
        name: 'inspector',
        label: 'Inspector',
        type: 'input',
        required: true,
        placeholder: 'Please enter inspector name',
        validation: { required: true, message: 'Please enter inspector name' }
      },
      {
        name: 'inspectorMobile',
        label: 'Inspector Mobile',
        type: 'input',
        required: false,
        placeholder: 'Please enter inspector mobile number',
        validation: { pattern: '^[0-9+\\-\\s()]+$', message: 'Please enter a valid mobile number' }
      },
      {
        name: 'date',
        label: 'Date',
        type: 'datePicker',
        required: true,
        placeholder: 'dd/mm/yyyy',
        format: 'DD/MM/YYYY',
        validation: { required: true, message: 'Please select inspection date' }
      },
      {
        name: 'locationDetails',
        label: 'Locations Details',
        type: 'textarea',
        required: false,
        placeholder: 'Please enter location details',
        rows: 3
      },
      {
        name: 'contactPerson',
        label: 'Contact Person',
        type: 'input',
        required: false,
        placeholder: 'Please enter contact person name'
      },
      {
        name: 'businessName',
        label: 'Business Name',
        type: 'input',
        required: false,
        placeholder: 'Please enter business name'
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: false,
        placeholder: 'Please enter business address',
        rows: 3
      },
      {
        name: 'suburb',
        label: 'Suburb',
        type: 'input',
        required: false,
        placeholder: 'Please enter suburb/area'
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'input',
        required: false,
        placeholder: 'Please enter phone number',
        validation: { pattern: '^[0-9+\\-\\s()]+$', message: 'Please enter a valid phone number' }
      },
      {
        name: 'email',
        label: 'Email',
        type: 'input',
        required: true,
        placeholder: 'Please enter email address',
        validation: { 
          required: true, 
          message: 'Please enter email address',
          type: 'email',
          message: 'Please enter a valid email address'
        }
      }
    ],
    // 检查项的配置
    inspectionItems: [
      {
        key:"worksite",
        name: 'Worksite',
        type: 'visual',
        tag: 'visual',
        commentsAndDetails:[
          {key:"a1a1",type:"input",label:""},
        ],
        required: true
      },
      {
        key:"inletFan",
        name:"Inlet Fan",
        type:"visual",
        commentsAndDetails:[
          {key:"c1c1", type:"number",label:"Number of Fans"},
          {key:"c1c2", type:"radio",label:["Direct Drive","Belt Drive","Axial Fan","Centrifugal"]},
          {key:"c1c3", type:"checkbox",label:["Direct Drive","Belt Drive","Axial Fan","Centrifugal"]},
          {key:"c1c4", type:"input",label:["Direct Drive","Belt Drive","Axial Fan","Centrifugal"]},
        ],
        required: true
      },
    ],
    // 指导内容的配置
    guidanceContent: {
      worksite:[
        {key:"g1g1", type:"text",content:"Site sign-in. Clear access. Hazards identified. Personal protection. Isolation & tag out. Other O.H.S. issues."},
        {key:"g1g2", type:"text",content:"Check before commencing service:"},
      ],
      inletFan:[
        {key:"g2g1", type:"text",content:"Check for general condition & damage:"},
        {key:"g2g2", type:"video", content: "spray-booth-inspection-video.mp4"},
        {key:"g2g3", type:"text",content:"Please make sure the power isolator is switched off position"},
        {key:"g2g4", type:"text",content:"Vane and impeller, free rotation with no obstacles, fan cabin fixed, seal up, electrical connection, etc."},
        {key:"g2g5", type:"text",content:"Filters clean. Motors run. Belts intact."},
        {key:"g2g6", type:"image",content:"https://images.unsplash.com/photo-1606231495909-73c86d43ed0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJheSUyMGJvb3RoJTIwaW5kdXN0cmlhbCUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NTc5OTUyMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"},
      ],
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'dynapumps',
    name: 'Dynapumps Booth Maintenance Service Check',
    description: ' ',//删去中文
    type: 'dynapumps',
    icon: 'SafetyOutlined',
    color: '#722ed1',
    gradient: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
    isActive: true,
    // 表单的字段配置
    formFields: [
      {
        name: 'inspector',
        label: 'Inspector',
        type: 'input',
        required: true,
        placeholder: 'Please enter inspector name',
        validation: { required: true, message: 'Please enter inspector name' }
      },
      {
        name: 'inspectorMobile',
        label: 'Inspector Mobile',
        type: 'input',
        required: false,
        placeholder: 'Please enter inspector mobile number',
        validation: { pattern: '^[0-9+\\-\\s()]+$', message: 'Please enter a valid mobile number' }
      },
      {
        name: 'date',
        label: 'Date',
        type: 'datePicker',
        required: true,
        placeholder: 'dd/mm/yyyy',
        format: 'DD/MM/YYYY',
        validation: { required: true, message: 'Please select inspection date' }
      },
      {
        name: 'locationDetails',
        label: 'Locations Details',
        type: 'textarea',
        required: false,
        placeholder: 'Please enter location details',
        rows: 3
      },
      {
        name: 'contactPerson',
        label: 'Contact Person',
        type: 'input',
        required: false,
        placeholder: 'Please enter contact person name'
      },
      {
        name: 'businessName',
        label: 'Business Name',
        type: 'input',
        required: false,
        placeholder: 'Please enter business name'
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: false,
        placeholder: 'Please enter business address',
        rows: 3
      },
      {
        name: 'suburb',
        label: 'Suburb',
        type: 'input',
        required: false,
        placeholder: 'Please enter suburb/area'
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'input',
        required: false,
        placeholder: 'Please enter phone number',
        validation: { pattern: '^[0-9+\\-\\s()]+$', message: 'Please enter a valid phone number' }
      },
      {
        name: 'email',
        label: 'Email',
        type: 'input',
        required: true,
        placeholder: 'Please enter email address',
        validation: { 
          required: true, 
          message: 'Please enter email address',
          type: 'email',
          message: 'Please enter a valid email address'
        }
      }
    ],
    // 检查项配置
    inspectionItems: [
      {
        key: 'pumpSystem',
        name: 'Pump System Operation',
        type: 'mechanical',
        tag: 'mechanical',
        required: true
      },
      {
        key: 'controlPanel',
        name: 'Control Panel Check',
        type: 'electrical',
        tag: 'electrical',
        required: true
      },
      {
        key: 'safetyValves',
        name: 'Safety Valves Inspection',
        type: 'safety',
        tag: 'safety',
        required: true
      }
    ],
    // 指导内容配置
    guidanceContent: {
      pumpSystem: {
        checklist: [
          "Check pump operation and pressure readings",
          "Inspect pump motor and drive system",
          "Verify fluid levels and circulation",
          "Test pump performance under load"
        ],
        image: "/api/placeholder/400/300"
      },
      controlPanel: {
        checklist: [
          "Test control panel functionality",
          "Check alarm and indicator systems",
          "Verify pressure and flow sensors",
          "Test emergency stop systems"
        ],
        image: "/api/placeholder/400/300"
      },
      safetyValves: {
        checklist: [
          "Inspect pressure relief valves",
          "Check valve operation and settings",
          "Verify safety interlock systems",
          "Test emergency shutdown procedures"
        ],
        image: "/api/placeholder/400/300"
      }
    },
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
