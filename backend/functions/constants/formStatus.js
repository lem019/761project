/**
 * 表单状态常量
 * 使用字符串常量替代数字，提高代码可读性和维护性
 */

const FORM_STATUS = {
  DRAFT: 'draft',           // 草稿
  PENDING: 'pending',       // 待审核
  ASSIGNED: 'assigned',     // 已分配（管理员已领取）
  APPROVED: 'approved',     // 已批准
  DECLINED: 'declined'      // 已拒绝
};

// 状态显示名称映射
const STATUS_LABELS = {
  [FORM_STATUS.DRAFT]: 'Draft (草稿)',
  [FORM_STATUS.PENDING]: 'Pending (待审核)',
  [FORM_STATUS.ASSIGNED]: 'Assigned (已分配)',
  [FORM_STATUS.APPROVED]: 'Approved (已批准)',
  [FORM_STATUS.DECLINED]: 'Declined (已拒绝)'
};

// 状态验证函数
const isValidStatus = (status) => {
  return Object.values(FORM_STATUS).includes(status);
};

// 获取状态显示名称
const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || 'Unknown Status';
};

module.exports = {
  FORM_STATUS,
  STATUS_LABELS,
  isValidStatus,
  getStatusLabel
};
