import { http } from '@/utils/request';

// 获取表单模板列表
export const getFormTemplates = async () => {
  try {
    const response = await http.get('/form/templates');
    return response.data;
  } catch (error) {
    console.error('获取表单模板列表失败:', error);
    throw error;
  }
};

export default {
  getFormTemplates
};
