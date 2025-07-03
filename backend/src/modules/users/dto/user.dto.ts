import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: '用户名称', example: '张三' })
    @IsNotEmpty({ message: '用户名称不能为空' })
    name: string;

    @ApiProperty({ description: '用户邮箱', example: 'zhangsan@example.com', required: false })
    @IsOptional()
    @IsEmail({}, { message: '邮箱格式不正确' })
    email?: string;

    @ApiProperty({ description: '是否活跃', example: true, default: true })
    @IsOptional()
    @IsBoolean({ message: '活跃状态必须是布尔值' })
    isActive?: boolean;
}

export class UpdateUserDto {
    @ApiProperty({ description: '用户名称', example: '张三', required: false })
    @IsOptional()
    @IsNotEmpty({ message: '用户名称不能为空' })
    name?: string;

    @ApiProperty({ description: '用户邮箱', example: 'zhangsan@example.com', required: false })
    @IsOptional()
    @IsEmail({}, { message: '邮箱格式不正确' })
    email?: string;

    @ApiProperty({ description: '是否活跃', example: true, required: false })
    @IsOptional()
    @IsBoolean({ message: '活跃状态必须是布尔值' })
    isActive?: boolean;
}

export class UserResponseDto {
    @ApiProperty({ description: '用户ID', example: 'user_1234567890' })
    id: string;

    @ApiProperty({ description: '用户名称', example: '张三' })
    name: string;

    @ApiProperty({ description: '用户邮箱', example: 'zhangsan@example.com', required: false })
    email?: string;

    @ApiProperty({ description: '是否活跃', example: true })
    isActive: boolean;

    @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;
} 