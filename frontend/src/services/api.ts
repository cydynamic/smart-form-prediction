import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { User, FormConfig, FormSubmission, ApiResponse } from '../stores/types';

// 创建 axios 实例
const createApiInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 请求拦截器
    instance.interceptors.request.use(
        (config) => {
            // 可以在这里添加认证 token
            // const token = localStorage.getItem('auth_token');
            // if (token) {
            //   config.headers.Authorization = `Bearer ${token}`;
            // }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 响应拦截器
    instance.interceptors.response.use(
        (response: AxiosResponse<ApiResponse>) => {
            return response;
        },
        (error) => {
            // 统一错误处理
            const message = error.response?.data?.message || error.message || '网络错误';
            console.error('API Error:', message);
            return Promise.reject(new Error(message));
        }
    );

    return instance;
};

const api = createApiInstance();

// 用户相关 API
export const userApi = {
    // 获取用户列表
    getUsers: async (): Promise<ApiResponse<User[]>> => {
        const response = await api.get<ApiResponse<User[]>>('/users');
        return response.data;
    },

    // 获取单个用户
    getUser: async (userId: string): Promise<ApiResponse<User>> => {
        const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
        return response.data;
    },

    // 创建用户
    createUser: async (userData: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
        const response = await api.post<ApiResponse<User>>('/users', userData);
        return response.data;
    },

    // 更新用户
    updateUser: async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
        const response = await api.put<ApiResponse<User>>(`/users/${userId}`, userData);
        return response.data;
    },

    // 删除用户
    deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`/users/${userId}`);
        return response.data;
    },
};

// 表单相关 API
export const formApi = {
    // 获取表单配置列表
    getFormConfigs: async (): Promise<ApiResponse<FormConfig[]>> => {
        const response = await api.get<ApiResponse<FormConfig[]>>('/forms/configs');
        return response.data;
    },

    // 获取单个表单配置
    getFormConfig: async (formId: string): Promise<ApiResponse<FormConfig>> => {
        const response = await api.get<ApiResponse<FormConfig>>(`/forms/configs/${formId}`);
        return response.data;
    },

    // 创建表单配置
    createFormConfig: async (formData: Omit<FormConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<FormConfig>> => {
        const response = await api.post<ApiResponse<FormConfig>>('/forms/configs', formData);
        return response.data;
    },

    // 更新表单配置
    updateFormConfig: async (formId: string, updates: Partial<FormConfig>): Promise<ApiResponse<FormConfig>> => {
        const response = await api.put<ApiResponse<FormConfig>>(`/forms/configs/${formId}`, updates);
        return response.data;
    },

    // 删除表单配置
    deleteFormConfig: async (formId: string): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`/forms/configs/${formId}`);
        return response.data;
    },

    // 提交表单
    submitForm: async (submission: Omit<FormSubmission, 'id' | 'timestamp'>): Promise<ApiResponse<FormSubmission>> => {
        const response = await api.post<ApiResponse<FormSubmission>>('/forms/submit', submission);
        return response.data;
    },

    // 获取用户的表单提交历史
    getUserSubmissions: async (userId: string): Promise<ApiResponse<FormSubmission[]>> => {
        const response = await api.get<ApiResponse<FormSubmission[]>>(`/forms/submissions/user/${userId}`);
        return response.data;
    },

    // 获取表单的所有提交记录
    getFormSubmissions: async (formId: string): Promise<ApiResponse<FormSubmission[]>> => {
        const response = await api.get<ApiResponse<FormSubmission[]>>(`/forms/submissions/form/${formId}`);
        return response.data;
    },
};

// 预测相关 API
export const predictionApi = {
    // 获取字段预测
    predict: async (params: {
        userId: string;
        fieldId: string;
        fieldName: string;
        context: Record<string, unknown>;
    }): Promise<ApiResponse<{
        fieldId: string;
        candidates: Array<{
            value: string;
            confidence: number;
            source: string;
        }>;
    }>> => {
        const response = await api.post<ApiResponse<{
            fieldId: string;
            candidates: Array<{
                value: string;
                confidence: number;
                source: string;
            }>;
        }>>('/predictions/predict', params);
        return response.data;
    },

    // 训练模型
    trainModel: async (params: {
        userId: string;
        data: unknown[];
    }): Promise<ApiResponse<{
        modelVersion: number;
        trainingTime: number;
    }>> => {
        const response = await api.post<ApiResponse<{
            modelVersion: number;
            trainingTime: number;
        }>>('/predictions/train', params);
        return response.data;
    },

    // 记录用户选择
    recordSelection: async (params: {
        fieldId: string;
        selectedValue: string;
        confidence: number;
        source: string;
    }): Promise<ApiResponse<void>> => {
        const response = await api.post<ApiResponse<void>>('/predictions/feedback/selection', params);
        return response.data;
    },

    // 记录用户拒绝
    recordRejection: async (params: {
        fieldId: string;
        rejectedCandidates: Array<{
            value: string;
            confidence: number;
            source: string;
        }>;
        actualValue: string;
    }): Promise<ApiResponse<void>> => {
        const response = await api.post<ApiResponse<void>>('/predictions/feedback/rejection', params);
        return response.data;
    },

    // 获取模型统计信息
    getModelStats: async (userId: string): Promise<ApiResponse<{
        modelVersion: number;
        trainingDataCount: number;
        lastTrainingTime: string;
        accuracy: number;
    }>> => {
        const response = await api.get<ApiResponse<{
            modelVersion: number;
            trainingDataCount: number;
            lastTrainingTime: string;
            accuracy: number;
        }>>(`/predictions/stats/${userId}`);
        return response.data;
    },
};

export default api; 