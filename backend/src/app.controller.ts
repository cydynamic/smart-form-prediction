import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('应用状态')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    @ApiOperation({ summary: '获取应用信息' })
    @ApiResponse({ status: 200, description: '应用信息获取成功' })
    getAppInfo(): { name: string; version: string; description: string } {
        return this.appService.getAppInfo();
    }

    @Get('health')
    @ApiOperation({ summary: '健康检查' })
    @ApiResponse({ status: 200, description: '应用健康状态正常' })
    healthCheck(): { status: string; timestamp: string } {
        return this.appService.healthCheck();
    }
} 