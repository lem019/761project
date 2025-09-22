const express = require('express');
const admin = require('firebase-admin');
const { FieldValue } = require("firebase-admin/firestore");
const router = express.Router();
const db = admin.firestore();

/**
 * 测试环境管理接口（无需认证）
 * 注意：这些接口仅在模拟器环境使用，生产环境应该删除或禁用
 */

// 转移表单创建者
router.get("/transfer-forms", async (req, res) => {
  try {
    // 检查是否为模拟器环境
    const isTestEnv = process.env.FUNCTIONS_EMULATOR === 'true';
    
    if (!isTestEnv) {
      return res.status(403).json({
        code: 403,
        message: 'This endpoint is only available in emulator environment'
      });
    }

    const { fromUid, toUid } = req.query;
    
    if (!fromUid || !toUid) {
      return res.status(400).json({
        code: 400,
        message: 'Both fromUid and toUid are required'
      });
    }

    if (fromUid === toUid) {
      return res.status(400).json({
        code: 400,
        message: 'fromUid and toUid cannot be the same'
      });
    }

    console.log(`🔄 开始转移表单: ${fromUid} -> ${toUid}`);
    
    // 查询所有需要转移的表单
    const formsSnapshot = await db.collection('forms')
      .where('creator', '==', fromUid)
      .get();

    if (formsSnapshot.empty) {
      return res.json({
        code: 200,
        message: `No forms found for creator: ${fromUid}`,
        data: {
          transferredCount: 0,
          fromUid,
          toUid
        }
      });
    }

    // 批量更新表单
    const batch = db.batch();
    const formIds = [];
    
    formsSnapshot.forEach(doc => {
      const formRef = db.collection('forms').doc(doc.id);
      batch.update(formRef, {
        creator: toUid,
        updatedAt: FieldValue.serverTimestamp()
      });
      formIds.push(doc.id);
    });

    await batch.commit();

    console.log(`✅ 成功转移 ${formIds.length} 个表单: ${fromUid} -> ${toUid}`);
    console.log(`📋 转移的表单ID: ${formIds.join(', ')}`);

    return res.json({
      code: 200,
      message: `Successfully transferred ${formIds.length} forms`,
      data: {
        transferredCount: formIds.length,
        fromUid,
        toUid,
        formIds: formIds
      }
    });

  } catch (e) {
    console.error('转移表单失败:', e);
    return res.status(500).json({
      code: 500,
      message: e.message,
      error: e.message
    });
  }
});

module.exports = router;
