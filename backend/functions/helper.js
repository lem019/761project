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

/**
 * 调试 Firestore 查询对象，打印查询的详细信息
 * @param {Object} query - Firestore 查询对象
 * @param {Object} params - 查询参数
 * @param {string} params.uid - 用户ID
 * @param {string} params.role - 用户角色
 * @param {string} params.status - 状态过滤
 * @param {string} params.viewMode - 查看模式
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页大小
 */
function debugFirestoreQuery(query, params = {}) {
  console.log("=== Firestore Query Debug ===");
  console.log("Parameters:", params);
  console.log("Query conditions:");
  
  // 打印查询的 where 条件
  if (query._query && query._query.filters) {
    query._query.filters.forEach((filter, index) => {
      console.log(`  Filter ${index + 1}:`, {
        field: filter.field?.toString(),
        operator: filter.op,
        value: filter.value
      });
    });
  } else {
    console.log("  No filters applied");
  }
  
  // 打印排序条件
  if (query._query && query._query.orderBy) {
    console.log("Order by:", query._query.orderBy.map(order => ({
      field: order.field?.toString(),
      direction: order.dir
    })));
  } else {
    console.log("  No ordering applied");
  }
  
  // 打印分页条件
  if (query._query && query._query.offset !== undefined) {
    console.log("Offset:", query._query.offset);
  }
  if (query._query && query._query.limit !== undefined) {
    console.log("Limit:", query._query.limit);
  }
  
  // 打印集合名称
  if (query._query && query._query.from) {
    console.log("Collection:", query._query.from.map(ref => ref.toString()));
  }
  
  console.log("=============================");
}

module.exports = {
  validateEmail,
  toIso,
  debugFirestoreQuery
};


