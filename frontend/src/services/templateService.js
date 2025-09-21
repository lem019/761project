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

// 获取特定模板详情
export const getFormTemplateById = async (templateId) => {
  try {
    // 添加时间戳参数避免缓存问题
    const response = await http.get(`/form/templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('获取模板详情失败:', error);
    throw error;
  }
};

export default {
  getFormTemplates,
  getFormTemplateById
};
