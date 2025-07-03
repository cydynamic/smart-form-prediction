// 用户相关类型
export interface User {
    id: string;
    name: string;
    email?: string;
    isActive: boolean;
}

// 表单字段类型枚举
export enum FieldType {
    TEXT = 'text',
    NUMBER = 'number',
    SELECT = 'select',
    CHECKBOX = 'checkbox',
    PASSWORD = 'password',
}

// 表单字段定义
export interface FormField {
    id: string;
    name: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // 用于下拉框和多选框
    value?: string | string[] | number | boolean;
    order: number;
}

// 表单配置
export interface FormConfig {
    id: string;
    name: string;
    description?: string;
    fields: FormField[];
    createdAt: string;
    updatedAt: string;
}

// 表单提交数据
export interface FormSubmission {
    id: string;
    userId: string;
    formConfigId: string;
    data: Record<string, unknown>;
    timestamp: string;
}

// 预测候选项
export interface PredictionCandidate {
    value: string;
    confidence: number;
    source: 'history' | 'ml' | 'pattern';
}

// 预测结果
export interface PredictionResult {
    fieldId: string;
    candidates: PredictionCandidate[];
    isLoading: boolean;
    error?: string;
}

// 应用状态接口
export interface AppState {
    theme: 'light' | 'dark';
    locale: 'zh-CN' | 'en-US';
    isLoading: boolean;
    error: string | null;
}

// API 响应基础类型
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
} 