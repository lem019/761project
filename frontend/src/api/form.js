import { http } from '@/utils/request';

// 获取表单列表（支持查询参数：status、mine、page、pageSize）
const getForm = (params) => {
  return http.get('/forms', params);
};

// 创建表单：{ title, type?, data? }
const createForm = (data) => {
  return http.post('/forms', data);
};

// 删除表单：仅允许删除草稿
const deleteForm = (id) => {
  return http.delete(`/forms/${id}`);
};

export { getForm, createForm, deleteForm };
