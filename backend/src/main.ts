import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    // 启用全局验证管道
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    // 启用CORS
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });

    // API前缀
    app.setGlobalPrefix('api');

    // Swagger文档配置
    const config = new DocumentBuilder()
        .setTitle('智能表单预测系统 API')
        .setDescription('基于机器学习的表单自动填充系统API文档')
        .setVersion('1.0')
        .addTag('forms', '表单管理')
        .addTag('users', '用户管理')
        .addTag('predictions', '预测服务')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`🚀 应用运行在: http://localhost:${port}`);
    console.log(`📚 API文档地址: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
    console.error('应用启动失败:', error);
    process.exit(1);
}); 