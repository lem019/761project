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

// 保存表单数据（创建或更新）
export const saveFormData = async (formData) => {
  try {
    const response = await http.post('/form/save', formData);
    return response.data;
  } catch (error) {
    console.error('保存表单数据失败:', error);
    throw error;
  }
};

// 获取表单数据
export const getFormData = async (formId) => {
  try {
    const response = await http.get(`/form/get/${formId}`);
    return response.data;
  } catch (error) {
    console.error('获取表单数据失败:', error);
    throw error;
  }
};

// 表单状态操作（提交、批准、拒绝等）
export const operateForm = async (formId, action, comment = '') => {
  try {
    const response = await http.post(`/form/operate/${formId}`, {
      action,
      comment
    });
    return response.data;
  } catch (error) {
    console.error('表单状态操作失败:', error);
    throw error;
  }
};

// 提交表单（先保存再提交）
export const submitForm = async (formData) => {
  try {
    // 先保存表单数据
    const saveResult = await saveFormData(formData);
    console.log('submitForm saveResult:', saveResult);
    
    // 如果保存成功且有formId，则提交表单
    if (saveResult && saveResult.id) {
      const submitResult = await operateForm(saveResult.id, 'submit');
      return {
        id: saveResult.id,
        message: submitResult.message,
        success: true
      };
    } else {
      return {
        id: saveResult.id,
        message: saveResult.message,
        success: false
      };
    } 
  } catch (error) {
    console.error('提交表单失败:', error);
    throw error;
  }
};

export default {
  getFormTemplates,
  getFormTemplateById,
  saveFormData,
  getFormData,
  operateForm,
  submitForm
};
