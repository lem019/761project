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
 * 校验邮箱格式
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 将 Firestore Timestamp 或 Date 统一转换为 ISO 字符串
 * @param {any} value
 * @returns {string|null}
 */
function toIso(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

module.exports = {
  deriveRole,
  validateEmail,
  toIso
};


