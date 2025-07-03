import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
    CreateFormConfigDto,
    UpdateFormConfigDto,
    FormConfigResponseDto,
    SubmitFormDto,
    FormSubmissionResponseDto,
    FormFieldDto,
    FieldType
} from './dto/form.dto';

export interface FormConfig {
    id: string;
    name: string;
    description?: string;
    fields: FormFieldDto[];
    createdAt: string;
    updatedAt: string;
}

export interface FormSubmission {
    id: string;
    userId: string;
    formConfigId: string;
    data: Record<string, any>;
    timestamp: string;
}

@Injectable()
export class FormsService {
    private readonly dataDir = join(process.cwd(), 'data', 'forms');
    private readonly configsFile = join(this.dataDir, 'configs.json');
    private readonly submissionsFile = join(this.dataDir, 'submissions.json');

    constructor() {
        this.ensureDataDirectory();
    }

    private async ensureDataDirectory(): Promise<void> {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });

            // 初始化配置文件
            try {
                await fs.access(this.configsFile);
            } catch {
                await this.initializeDefaultForms();
            }

            // 初始化提交文件
            try {
                await fs.access(this.submissionsFile);
            } catch {
                await this.saveSubmissions([]);
            }
        } catch (error) {
            console.error('创建表单数据目录失败:', error);
        }
    }

    private async initializeDefaultForms(): Promise<void> {
        const defaultForms: FormConfig[] = [
            {
                id: 'form_default',
                name: '默认表单',
                description: '系统默认的示例表单',
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
            },
        ];

        await this.saveConfigs(defaultForms);
    }

    private async loadConfigs(): Promise<FormConfig[]> {
        try {
            const data = await fs.readFile(this.configsFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('读取表单配置文件失败:', error);
            return [];
        }
    }

    private async saveConfigs(configs: FormConfig[]): Promise<void> {
        try {
            await fs.writeFile(this.configsFile, JSON.stringify(configs, null, 2), 'utf-8');
        } catch (error) {
            console.error('保存表单配置文件失败:', error);
            throw new Error('保存表单配置失败');
        }
    }

    private async loadSubmissions(): Promise<FormSubmission[]> {
        try {
            const data = await fs.readFile(this.submissionsFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('读取表单提交文件失败:', error);
            return [];
        }
    }

    private async saveSubmissions(submissions: FormSubmission[]): Promise<void> {
        try {
            await fs.writeFile(this.submissionsFile, JSON.stringify(submissions, null, 2), 'utf-8');
        } catch (error) {
            console.error('保存表单提交文件失败:', error);
            throw new Error('保存表单提交失败');
        }
    }

    // 表单配置管理
    async findAllConfigs(): Promise<FormConfigResponseDto[]> {
        const configs = await this.loadConfigs();
        return configs.map(config => ({ ...config }));
    }

    async findConfigById(id: string): Promise<FormConfigResponseDto> {
        const configs = await this.loadConfigs();
        const config = configs.find(c => c.id === id);

        if (!config) {
            throw new NotFoundException(`表单配置 ${id} 未找到`);
        }

        return { ...config };
    }

    async createConfig(createFormConfigDto: CreateFormConfigDto): Promise<FormConfigResponseDto> {
        const configs = await this.loadConfigs();

        const newConfig: FormConfig = {
            id: `form_${Date.now()}`,
            name: createFormConfigDto.name,
            description: createFormConfigDto.description,
            fields: createFormConfigDto.fields.map((field, index) => ({
                ...field,
                order: field.order ?? index + 1,
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        configs.push(newConfig);
        await this.saveConfigs(configs);

        return { ...newConfig };
    }

    async updateConfig(id: string, updateFormConfigDto: UpdateFormConfigDto): Promise<FormConfigResponseDto> {
        const configs = await this.loadConfigs();
        const configIndex = configs.findIndex(c => c.id === id);

        if (configIndex === -1) {
            throw new NotFoundException(`表单配置 ${id} 未找到`);
        }

        const existingConfig = configs[configIndex]!;
        const updatedConfig: FormConfig = {
            id: existingConfig.id,
            name: updateFormConfigDto.name ?? existingConfig.name,
            description: updateFormConfigDto.description ?? existingConfig.description,
            fields: updateFormConfigDto.fields?.map((field, index) => ({
                ...field,
                order: field.order ?? index + 1,
            })) ?? existingConfig.fields,
            createdAt: existingConfig.createdAt,
            updatedAt: new Date().toISOString(),
        };

        configs[configIndex] = updatedConfig;
        await this.saveConfigs(configs);

        return { ...updatedConfig };
    }

    async removeConfig(id: string): Promise<void> {
        const configs = await this.loadConfigs();
        const configIndex = configs.findIndex(c => c.id === id);

        if (configIndex === -1) {
            throw new NotFoundException(`表单配置 ${id} 未找到`);
        }

        configs.splice(configIndex, 1);
        await this.saveConfigs(configs);
    }

    // 表单提交管理
    async submitForm(submitFormDto: SubmitFormDto): Promise<FormSubmissionResponseDto> {
        // 验证表单配置是否存在
        await this.findConfigById(submitFormDto.formConfigId);

        const submissions = await this.loadSubmissions();

        const newSubmission: FormSubmission = {
            id: `submission_${Date.now()}`,
            userId: submitFormDto.userId,
            formConfigId: submitFormDto.formConfigId,
            data: submitFormDto.data,
            timestamp: new Date().toISOString(),
        };

        submissions.push(newSubmission);
        await this.saveSubmissions(submissions);

        return { ...newSubmission };
    }

    async findAllSubmissions(): Promise<FormSubmissionResponseDto[]> {
        const submissions = await this.loadSubmissions();
        return submissions.map(submission => ({ ...submission }));
    }

    async findSubmissionsByUser(userId: string): Promise<FormSubmissionResponseDto[]> {
        const submissions = await this.loadSubmissions();
        return submissions
            .filter(s => s.userId === userId)
            .map(submission => ({ ...submission }));
    }

    async findSubmissionsByForm(formConfigId: string): Promise<FormSubmissionResponseDto[]> {
        const submissions = await this.loadSubmissions();
        return submissions
            .filter(s => s.formConfigId === formConfigId)
            .map(submission => ({ ...submission }));
    }

    async findSubmissionsByUserAndForm(userId: string, formConfigId: string): Promise<FormSubmissionResponseDto[]> {
        const submissions = await this.loadSubmissions();
        return submissions
            .filter(s => s.userId === userId && s.formConfigId === formConfigId)
            .map(submission => ({ ...submission }));
    }

    // 获取字段历史数据（用于预测）
    async getFieldHistory(userId: string, fieldName: string): Promise<any[]> {
        const submissions = await this.loadSubmissions();
        return submissions
            .filter(s => s.userId === userId)
            .map(s => s.data[fieldName])
            .filter(value => value !== undefined && value !== null && value !== '');
    }

    // 统计信息
    async getFormStats(): Promise<{
        totalConfigs: number;
        totalSubmissions: number;
        submissionsByUser: Record<string, number>;
        submissionsByForm: Record<string, number>;
    }> {
        const configs = await this.loadConfigs();
        const submissions = await this.loadSubmissions();

        const submissionsByUser: Record<string, number> = {};
        const submissionsByForm: Record<string, number> = {};

        submissions.forEach(submission => {
            submissionsByUser[submission.userId] = (submissionsByUser[submission.userId] || 0) + 1;
            submissionsByForm[submission.formConfigId] = (submissionsByForm[submission.formConfigId] || 0) + 1;
        });

        return {
            totalConfigs: configs.length,
            totalSubmissions: submissions.length,
            submissionsByUser,
            submissionsByForm,
        };
    }
} 