import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';

@ApiTags('用户管理')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: '创建用户' })
    @ApiResponse({
        status: 201,
        description: '用户创建成功',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 400, description: '请求参数错误' })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: '获取所有用户' })
    @ApiResponse({
        status: 200,
        description: '获取用户列表成功',
        type: [UserResponseDto],
    })
    async findAll(): Promise<UserResponseDto[]> {
        return this.usersService.findAll();
    }

    @Get('active')
    @ApiOperation({ summary: '获取活跃用户' })
    @ApiResponse({
        status: 200,
        description: '获取活跃用户列表成功',
        type: [UserResponseDto],
    })
    async findActive(): Promise<UserResponseDto[]> {
        return this.usersService.getActiveUsers();
    }

    @Get('stats')
    @ApiOperation({ summary: '获取用户统计' })
    @ApiResponse({
        status: 200,
        description: '获取用户统计成功',
        schema: {
            type: 'object',
            properties: {
                total: { type: 'number', description: '总用户数' },
                active: { type: 'number', description: '活跃用户数' },
                inactive: { type: 'number', description: '非活跃用户数' },
            },
        },
    })
    async getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }> {
        return this.usersService.getUserStats();
    }

    @Get(':id')
    @ApiOperation({ summary: '根据ID获取用户' })
    @ApiParam({ name: 'id', description: '用户ID' })
    @ApiResponse({
        status: 200,
        description: '获取用户成功',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: '用户未找到' })
    async findOne(@Param('id') id: string): Promise<UserResponseDto> {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: '更新用户' })
    @ApiParam({ name: 'id', description: '用户ID' })
    @ApiResponse({
        status: 200,
        description: '用户更新成功',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: '用户未找到' })
    @ApiResponse({ status: 400, description: '请求参数错误' })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '删除用户' })
    @ApiParam({ name: 'id', description: '用户ID' })
    @ApiResponse({ status: 204, description: '用户删除成功' })
    @ApiResponse({ status: 404, description: '用户未找到' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }
} 