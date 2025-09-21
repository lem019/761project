const express = require('express');
const router = express.Router();

/**
 * 用户模块路由 - 现在只提供用户信息接口
 * 基础路径：/user
 * 注意：用户注册和登录现在通过 Firebase Auth 处理
 */

/**
 * 获取当前用户信息接口
 * 方法：GET
 * 路径：/user/me
 * 需要认证：是
 */
router.get('/me', (req, res) => {
  // 用户信息已经通过认证中间件添加到 req.user
  res.json({
    code: 200,
    message: 'User info retrieved successfully',
    data: {
      uid: req.user.uid,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;


