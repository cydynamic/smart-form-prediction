import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { FormsService } from './forms.service';
import {
    CreateFormConfigDto,
    UpdateFormConfigDto,
    FormConfigResponseDto,
    SubmitFormDto,
    FormSubmissionResponseDto,
} from './dto/form.dto';

@ApiTags('表单管理')
@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) { }

    // 表单配置管理
    @Post('configs')
    @ApiOperation({ summary: '创建表单配置' })
    @ApiResponse({
        status: 201,
        description: '表单配置创建成功',
        type: FormConfigResponseDto,
    })
    @ApiResponse({ status: 400, description: '请求参数错误' })
    async createConfig(
        @Body() createFormConfigDto: CreateFormConfigDto,
    ): Promise<FormConfigResponseDto> {
        return this.formsService.createConfig(createFormConfigDto);
    }

    @Get('configs')
    @ApiOperation({ summary: '获取所有表单配置' })
    @ApiResponse({
        status: 200,
        description: '获取表单配置列表成功',
        type: [FormConfigResponseDto],
    })
    async findAllConfigs(): Promise<FormConfigResponseDto[]> {
        return this.formsService.findAllConfigs();
    }

    @Get('configs/:id')
    @ApiOperation({ summary: '根据ID获取表单配置' })
    @ApiParam({ name: 'id', description: '表单配置ID' })
    @ApiResponse({
        status: 200,
        description: '获取表单配置成功',
        type: FormConfigResponseDto,
    })
    @ApiResponse({ status: 404, description: '表单配置未找到' })
    async findConfigById(@Param('id') id: string): Promise<FormConfigResponseDto> {
        return this.formsService.findConfigById(id);
    }

    @Patch('configs/:id')
    @ApiOperation({ summary: '更新表单配置' })
    @ApiParam({ name: 'id', description: '表单配置ID' })
    @ApiResponse({
        status: 200,
        description: '表单配置更新成功',
        type: FormConfigResponseDto,
    })
    @ApiResponse({ status: 404, description: '表单配置未找到' })
    @ApiResponse({ status: 400, description: '请求参数错误' })
    async updateConfig(
        @Param('id') id: string,
        @Body() updateFormConfigDto: UpdateFormConfigDto,
    ): Promise<FormConfigResponseDto> {
        return this.formsService.updateConfig(id, updateFormConfigDto);
    }

    @Delete('configs/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '删除表单配置' })
    @ApiParam({ name: 'id', description: '表单配置ID' })
    @ApiResponse({ status: 204, description: '表单配置删除成功' })
    @ApiResponse({ status: 404, description: '表单配置未找到' })
    async removeConfig(@Param('id') id: string): Promise<void> {
        return this.formsService.removeConfig(id);
    }

    // 表单提交管理
    @Post('submit')
    @ApiOperation({ summary: '提交表单' })
    @ApiResponse({
        status: 201,
        description: '表单提交成功',
        type: FormSubmissionResponseDto,
    })
    @ApiResponse({ status: 400, description: '请求参数错误' })
    @ApiResponse({ status: 404, description: '表单配置未找到' })
    async submitForm(
        @Body() submitFormDto: SubmitFormDto,
    ): Promise<FormSubmissionResponseDto> {
        return this.formsService.submitForm(submitFormDto);
    }

    @Get('submissions')
    @ApiOperation({ summary: '获取所有表单提交' })
    @ApiQuery({ name: 'userId', description: '用户ID', required: false })
    @ApiQuery({ name: 'formConfigId', description: '表单配置ID', required: false })
    @ApiResponse({
        status: 200,
        description: '获取表单提交列表成功',
        type: [FormSubmissionResponseDto],
    })
    async findSubmissions(
        @Query('userId') userId?: string,
        @Query('formConfigId') formConfigId?: string,
    ): Promise<FormSubmissionResponseDto[]> {
        if (userId && formConfigId) {
            return this.formsService.findSubmissionsByUserAndForm(userId, formConfigId);
        } else if (userId) {
            return this.formsService.findSubmissionsByUser(userId);
        } else if (formConfigId) {
            return this.formsService.findSubmissionsByForm(formConfigId);
        } else {
            return this.formsService.findAllSubmissions();
        }
    }

    @Get('history/:userId/:fieldName')
    @ApiOperation({ summary: '获取用户字段历史数据' })
    @ApiParam({ name: 'userId', description: '用户ID' })
    @ApiParam({ name: 'fieldName', description: '字段名称' })
    @ApiResponse({
        status: 200,
        description: '获取字段历史数据成功',
        schema: {
            type: 'array',
            items: { type: 'string' },
        },
    })
    async getFieldHistory(
        @Param('userId') userId: string,
        @Param('fieldName') fieldName: string,
    ): Promise<any[]> {
        return this.formsService.getFieldHistory(userId, fieldName);
    }

    @Get('stats')
    @ApiOperation({ summary: '获取表单统计信息' })
    @ApiResponse({
        status: 200,
        description: '获取表单统计信息成功',
        schema: {
            type: 'object',
            properties: {
                totalConfigs: { type: 'number', description: '表单配置总数' },
                totalSubmissions: { type: 'number', description: '表单提交总数' },
                submissionsByUser: {
                    type: 'object',
                    description: '按用户分组的提交数量',
                },
                submissionsByForm: {
                    type: 'object',
                    description: '按表单分组的提交数量',
                },
            },
        },
    })
    async getStats(): Promise<{
        totalConfigs: number;
        totalSubmissions: number;
        submissionsByUser: Record<string, number>;
        submissionsByForm: Record<string, number>;
    }> {
        return this.formsService.getFormStats();
    }
} 