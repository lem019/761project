const admin = require('firebase-admin');

/**
 * Firebase Admin 认证中间件
 * 验证前端发送的 Firebase ID Token
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        code: 401, 
        message: 'No authorization token provided' 
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // 验证 Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // 将用户信息添加到请求对象
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.email.endsWith('@thermoflo.co.nz') ? 'admin' : 'primary'
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      code: 401, 
      message: 'Invalid or expired token' 
    });
  }
};

/**
 * 管理员权限检查中间件
 * 必须在 authMiddleware 之后使用
 */
const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      code: 401,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      code: 403,
      message: 'Uncertified access.'
    });
  }

  next();
};

/**
 * 可选认证中间件 - 如果有token则验证，没有则跳过
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 没有token，跳过认证
      return next();
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // 验证 Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // 将用户信息添加到请求对象
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.email.endsWith('@thermoflo.co.nz') ? 'admin' : 'primary'
    };
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // 验证失败，但不阻止请求继续
    next();
  }
};

module.exports = {
  authMiddleware,
  checkAdmin,
  optionalAuth
};
