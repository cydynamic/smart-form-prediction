import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getAppInfo(): { name: string; version: string; description: string } {
        return {
            name: '智能表单预测系统',
            version: '1.0.0',
            description: '基于机器学习的表单自动填充系统API服务',
        };
    }

    healthCheck(): { status: string; timestamp: string } {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
}
