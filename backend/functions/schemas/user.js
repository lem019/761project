const { deriveRole } = require('../helper');

/**
 * 构建用户文档对象
 * @param {string} email 用户邮箱
 * @param {string} password 明文密码（请在生产加密）
 * @returns {{email:string,password:string,role:'primary'|'admin',status:string,createdAt:Date,updatedAt:Date}}
 */
function buildUserDoc(email, password) {
  const now = new Date();
  const role = deriveRole(email);
  return {
    email,
    password, // 生产环境请加密存储
    role, // 仅支持 'primary' | 'admin'
    status: 'active', // 在未来可用于禁用用户
    createdAt: now,
    updatedAt: now
  };
}

module.exports = {
  buildUserDoc
};


