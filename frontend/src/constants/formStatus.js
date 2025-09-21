/**
 * 表单状态常量 - 前端版本
 * 与后端保持一致，使用字符串常量替代数字
 */

export const FORM_STATUS = {
  DRAFT: 'draft',           // 草稿
  PENDING: 'pending',       // 待审核
  ASSIGNED: 'assigned',     // 已分配（管理员已领取）
  APPROVED: 'approved',     // 已批准
  DECLINED: 'declined'      // 已拒绝
};

// 状态显示名称映射
export const STATUS_LABELS = {
  [FORM_STATUS.DRAFT]: 'Draft (草稿)',
  [FORM_STATUS.PENDING]: 'Pending (待审核)',
  [FORM_STATUS.ASSIGNED]: 'Assigned (已分配)',
  [FORM_STATUS.APPROVED]: 'Approved (已批准)',
  [FORM_STATUS.DECLINED]: 'Declined (已拒绝)'
};

// 状态颜色映射
export const STATUS_COLORS = {
  [FORM_STATUS.DRAFT]: '#1890ff',      // 蓝色
  [FORM_STATUS.PENDING]: '#faad14',    // 橙色
  [FORM_STATUS.ASSIGNED]: '#722ed1',   // 紫色
  [FORM_STATUS.APPROVED]: '#52c41a',   // 绿色
  [FORM_STATUS.DECLINED]: '#ff4d4f'    // 红色
};

// 状态验证函数
export const isValidStatus = (status) => {
  return Object.values(FORM_STATUS).includes(status);
};

// 获取状态显示名称
export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || 'Unknown Status';
};

// 获取状态颜色
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#d9d9d9';
};
