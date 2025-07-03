import { makeAutoObservable, runInAction } from 'mobx';
import { FormConfig, FormField, FormSubmission, FieldType } from './types';
import { formApi } from '../services/api';

export class FormStore {
    // 状态
    formConfigs: FormConfig[] = [];
    currentFormConfig: FormConfig | null = null;
    formData: Record<string, unknown> = {};
    submissions: FormSubmission[] = [];
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.initializeDefaultForm();
    }

    // 初始化默认表单配置
    private initializeDefaultForm(): void {
        const defaultForm: FormConfig = {
            id: 'default_form',
            name: '默认表单',
            description: '示例表单配置',
            fields: [
                {
                    id: 'field_1',
                    name: 'username',
                    type: FieldType.TEXT,
                    label: '用户名',
                    placeholder: '请输入用户名',
                    required: true,
                    order: 1,
                },
                {
                    id: 'field_2',
                    name: 'email',
                    type: FieldType.TEXT,
                    label: '邮箱',
                    placeholder: '请输入邮箱地址',
                    required: true,
                    order: 2,
                },
                {
                    id: 'field_3',
                    name: 'age',
                    type: FieldType.NUMBER,
                    label: '年龄',
                    placeholder: '请输入年龄',
                    required: false,
                    order: 3,
                },
                {
                    id: 'field_4',
                    name: 'gender',
                    type: FieldType.SELECT,
                    label: '性别',
                    required: false,
                    options: ['男', '女', '其他'],
                    order: 4,
                },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.formConfigs = [defaultForm];
        this.currentFormConfig = defaultForm;
    }

    // 获取表单配置列表
    async fetchFormConfigs(): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            // const response = await formApi.getFormConfigs();
            // 模拟 API 调用
            await new Promise(resolve => setTimeout(resolve, 300));

            runInAction(() => {
                // this.formConfigs = response.data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '获取表单配置失败');
                this.isLoading = false;
            });
        }
    }

    // 创建新表单配置
    async createFormConfig(formData: Omit<FormConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            const newForm: FormConfig = {
                ...formData,
                id: `form_${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // const response = await formApi.createFormConfig(newForm);

            runInAction(() => {
                this.formConfigs.push(newForm);
                this.currentFormConfig = newForm;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '创建表单配置失败');
                this.isLoading = false;
            });
        }
    }

    // 更新表单配置
    async updateFormConfig(formId: string, updates: Partial<FormConfig>): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            // const response = await formApi.updateFormConfig(formId, updates);

            runInAction(() => {
                const index = this.formConfigs.findIndex(f => f.id === formId);
                if (index !== -1) {
                    this.formConfigs[index] = {
                        ...this.formConfigs[index]!,
                        ...updates,
                        updatedAt: new Date().toISOString(),
                    };
                    if (this.currentFormConfig?.id === formId) {
                        this.currentFormConfig = this.formConfigs[index]!;
                    }
                }
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '更新表单配置失败');
                this.isLoading = false;
            });
        }
    }

    // 选择当前表单配置
    selectFormConfig(formId: string): void {
        const form = this.formConfigs.find(f => f.id === formId);
        if (form) {
            this.currentFormConfig = form;
            this.resetFormData();
        }
    }

    // 添加字段
    addField(field: Omit<FormField, 'id' | 'order'>): void {
        if (!this.currentFormConfig) return;

        const newField: FormField = {
            ...field,
            id: `field_${Date.now()}`,
            order: this.currentFormConfig.fields.length + 1,
        };

        const updatedFields = [...this.currentFormConfig.fields, newField];
        this.updateFormConfig(this.currentFormConfig.id, { fields: updatedFields });
    }

    // 更新字段
    updateField(fieldId: string, updates: Partial<FormField>): void {
        if (!this.currentFormConfig) return;

        const updatedFields = this.currentFormConfig.fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
        );

        this.updateFormConfig(this.currentFormConfig.id, { fields: updatedFields });
    }

    // 删除字段
    removeField(fieldId: string): void {
        if (!this.currentFormConfig) return;

        const updatedFields = this.currentFormConfig.fields
            .filter(field => field.id !== fieldId)
            .map((field, index) => ({ ...field, order: index + 1 }));

        this.updateFormConfig(this.currentFormConfig.id, { fields: updatedFields });
    }

    // 重新排序字段
    reorderFields(fieldIds: string[]): void {
        if (!this.currentFormConfig) return;

        const fieldMap = new Map(this.currentFormConfig.fields.map(f => [f.id, f]));
        const updatedFields = fieldIds
            .map(id => fieldMap.get(id))
            .filter((field): field is FormField => field !== undefined)
            .map((field, index) => ({ ...field, order: index + 1 }));

        this.updateFormConfig(this.currentFormConfig.id, { fields: updatedFields });
    }

    // 设置表单数据
    setFormValue(fieldName: string, value: unknown): void {
        this.formData[fieldName] = value;
    }

    // 重置表单数据
    resetFormData(): void {
        this.formData = {};
    }

    // 提交表单
    async submitForm(userId: string): Promise<void> {
        if (!this.currentFormConfig) {
            throw new Error('没有选择表单配置');
        }

        this.setLoading(true);
        this.setError(null);

        try {
            const submission: FormSubmission = {
                id: `submission_${Date.now()}`,
                userId,
                formConfigId: this.currentFormConfig.id,
                data: { ...this.formData },
                timestamp: new Date().toISOString(),
            };

            // const response = await formApi.submitForm(submission);

            runInAction(() => {
                this.submissions.push(submission);
                this.resetFormData();
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '提交表单失败');
                this.isLoading = false;
            });
        }
    }

    // 获取用户的表单提交历史
    async fetchUserSubmissions(userId: string): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            // const response = await formApi.getUserSubmissions(userId);
            // 模拟 API 调用
            await new Promise(resolve => setTimeout(resolve, 300));

            runInAction(() => {
                // this.submissions = response.data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '获取提交历史失败');
                this.isLoading = false;
            });
        }
    }

    // 辅助方法
    private setLoading(loading: boolean): void {
        this.isLoading = loading;
    }

    private setError(error: string | null): void {
        this.error = error;
    }

    // 计算属性
    get sortedFields(): FormField[] {
        return this.currentFormConfig?.fields.slice().sort((a, b) => a.order - b.order) ?? [];
    }

    get isFormValid(): boolean {
        if (!this.currentFormConfig) return false;

        const requiredFields = this.currentFormConfig.fields.filter(f => f.required);
        return requiredFields.every(field => {
            const value = this.formData[field.name];
            return value !== undefined && value !== null && value !== '';
        });
    }

    get fieldCount(): number {
        return this.currentFormConfig?.fields.length ?? 0;
    }

    get canAddField(): boolean {
        return this.fieldCount < 10;
    }

    get canRemoveField(): boolean {
        return this.fieldCount > 2;
    }

    getUserSubmissions(userId: string): FormSubmission[] {
        return this.submissions.filter(s => s.userId === userId);
    }

    getFieldSubmissionHistory(userId: string, fieldName: string): unknown[] {
        return this.getUserSubmissions(userId)
            .map(s => s.data[fieldName])
            .filter(value => value !== undefined && value !== null && value !== '');
    }
} 