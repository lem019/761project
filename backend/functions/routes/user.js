const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const apiResponse = require('../middleware/apiResponse');
const { toIso, validateEmail } = require('../helper');

// todo 为什么要自己处理账户密码 完全没必要！ 完全没必要使用这种登录方式!!
// todo 仔细研究下登录流程

/**
 * 用户模块路由
 * 基础路径：/user
 */

/**
 * 登录接口
 * 方法：POST
 * 路径：/user/login
 * 请求体字段：
 * - email: string 用户邮箱（作为用户名）
 * - password: string 用户密码
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return apiResponse.error({ res, code: 400, message: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return apiResponse.error({ res, code: 400, message: 'Invalid email format' });
    }

    // todo 调用 user-service 处理 query
    const db = admin.firestore();
    const usersRef = db.collection('users');
    const query = await usersRef.where('email', '==', email).limit(1).get();

    if (query.empty) {
      return apiResponse.unauthorized({ res,code:400, message: 'Invalid email or password' });
    }

    const userDoc = query.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      return apiResponse.unauthorized({ res, code:400,message: 'Invalid email or password' });
    }


    // 使用 Firebase Custom Token，并确保角色与邮箱域一致

    const token = await admin.auth().createCustomToken(userDoc.id, {
      role: userData.role,
      email: userData.email
    });

    const userInfo = {
      id: userDoc.id,
      email: userData.email,
      role: userData.role,
      status: userData.status || 'active',
      createdAt: toIso(userData.createdAt),
      updatedAt: toIso(userData.updatedAt)
    };

    return apiResponse.success({ res, code: 200, message: 'Login successful', data: { token, user: userInfo } });
  } catch (error) {
    console.error('Login error:', error);
    return apiResponse.error({ res, code: 500, message: 'Internal server error' });
  }
});

/**
 * 注册接口
 * 方法：POST
 * 路径：/user/register
 * 请求体字段：
 * - email: string 用户邮箱
 * - password: string 用户密码（至少 6 位）
 * - username: string 用户名
 * - role:  'primary' | 'admin'（可选，默认 'primary'）
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, } = req.body || {};

    if (!email || !password) {
      return apiResponse.error({ res, code: 400, message: 'Email, password are required' });
    }

    if (!validateEmail(email)) {
      return apiResponse.error({ res, code: 400, message: 'Invalid email format' });
    }

    if (String(password).length < 6) {
      return apiResponse.error({ res, code: 400, message: 'Password must be at least 6 characters long' });
    }


    const db = admin.firestore();
    const usersRef = db.collection('users');

    const existingUser = await usersRef.where('email', '==', email).limit(1).get();
    if (!existingUser.empty) {
      return apiResponse.error({ res, code: 409, message: 'User with this email already exists' });
    }

    const { buildUserDoc } = require('../services/user-service');
    const newUser = buildUserDoc(email, password);

    const userRef = await usersRef.add(newUser);

    const userInfo = {
      id: userRef.id,
      email: newUser.email,
      role: newUser.role,
      createdAt: toIso(newUser.createdAt),
      updatedAt: toIso(newUser.updatedAt)
    };

    return apiResponse.success({ res, code: 200, message: 'User registered successfully', data: userInfo });
  } catch (error) {
    console.error('Registration error:', error);
    return apiResponse.error({ res, code: 500, message: 'Internal server error' });
  }
});

router.get('/list', async (req, res) => {
    return apiResponse.success({ res, code: 200, message: 'Internal server error' });
});

module.exports = router;


