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

module.exports = authMiddleware;
