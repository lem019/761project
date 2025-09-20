/**
 * 根据邮箱后缀推导用户角色
 * 规则：
 * - 邮箱以 @thermoflo.co.nz 结尾 => 'admin'
 * - 其他邮箱 => 'primary'
 * @param {string} email
 * @returns {'primary'|'admin'}
 */
function deriveRole(email) {
    const domain = String(email).split('@')[1] || '';
    return domain.toLowerCase() === 'thermoflo.co.nz' ? 'admin' : 'primary';
}

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