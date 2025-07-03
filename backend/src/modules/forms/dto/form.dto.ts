import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsArray, IsString, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum FieldType {
    TEXT = 'text',
    NUMBER = 'number',
    SELECT = 'select',
    CHECKBOX = 'checkbox',
    PASSWORD = 'password',
}

export class FormFieldDto {
    @ApiProperty({ description: '字段ID', example: 'field_1' })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: '字段名称', example: 'username' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: '字段类型', enum: FieldType, example: FieldType.TEXT })
    @IsEnum(FieldType)
    type: FieldType;

    @ApiProperty({ description: '字段标签', example: '用户名' })
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiProperty({ description: '占位符', example: '请输入用户名', required: false })
    @IsOptional()
    @IsString()
    placeholder?: string;

    @ApiProperty({ description: '是否必填', example: true })
    @IsBoolean()
    required: boolean;

    @ApiProperty({ description: '选项列表（用于下拉框和多选框）', type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    options?: string[];

    @ApiProperty({ description: '字段顺序', example: 1 })
    @IsOptional()
    order?: number;
}

export class CreateFormConfigDto {
    @ApiProperty({ description: '表单名称', example: '用户注册表单' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: '表单描述', example: '用于用户注册的表单', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: '表单字段', type: [FormFieldDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormFieldDto)
    fields: FormFieldDto[];
}

export class UpdateFormConfigDto {
    @ApiProperty({ description: '表单名称', example: '用户注册表单', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({ description: '表单描述', example: '用于用户注册的表单', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: '表单字段', type: [FormFieldDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormFieldDto)
    fields?: FormFieldDto[];
}

export class FormConfigResponseDto {
    @ApiProperty({ description: '表单ID', example: 'form_1234567890' })
    id: string;

    @ApiProperty({ description: '表单名称', example: '用户注册表单' })
    name: string;

    @ApiProperty({ description: '表单描述', example: '用于用户注册的表单', required: false })
    description?: string;

    @ApiProperty({ description: '表单字段', type: [FormFieldDto] })
    fields: FormFieldDto[];

    @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;
}

export class SubmitFormDto {
    @ApiProperty({ description: '用户ID', example: 'user_001' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: '表单配置ID', example: 'form_001' })
    @IsString()
    @IsNotEmpty()
    formConfigId: string;

    @ApiProperty({
        description: '表单数据',
        example: { username: '张三', email: 'zhangsan@example.com' },
        type: 'object'
    })
    @IsNotEmpty()
    data: Record<string, any>;
}

export class FormSubmissionResponseDto {
    @ApiProperty({ description: '提交ID', example: 'submission_1234567890' })
    id: string;

    @ApiProperty({ description: '用户ID', example: 'user_001' })
    userId: string;

    @ApiProperty({ description: '表单配置ID', example: 'form_001' })
    formConfigId: string;

    @ApiProperty({
        description: '表单数据',
        example: { username: '张三', email: 'zhangsan@example.com' }
    })
    data: Record<string, any>;

    @ApiProperty({ description: '提交时间', example: '2024-01-01T00:00:00.000Z' })
    timestamp: string;
} 