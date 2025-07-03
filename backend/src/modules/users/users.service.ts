import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';

export interface User {
    id: string;
    name: string;
    email?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

@Injectable()
export class UsersService {
    private readonly dataDir = join(process.cwd(), 'data', 'users');
    private readonly usersFile = join(this.dataDir, 'users.json');

    constructor() {
        this.ensureDataDirectory();
    }

    private async ensureDataDirectory(): Promise<void> {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });

            // 如果用户文件不存在，创建默认用户
            try {
                await fs.access(this.usersFile);
            } catch {
                await this.initializeDefaultUsers();
            }
        } catch (error) {
            console.error('创建数据目录失败:', error);
        }
    }

    private async initializeDefaultUsers(): Promise<void> {
        const defaultUsers: User[] = [
            {
                id: 'user_001',
                name: '张三',
                email: 'zhangsan@example.com',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'user_002',
                name: '李四',
                email: 'lisi@example.com',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'user_003',
                name: '王五',
                isActive: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];

        await this.saveUsers(defaultUsers);
    }

    private async loadUsers(): Promise<User[]> {
        try {
            const data = await fs.readFile(this.usersFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('读取用户文件失败:', error);
            return [];
        }
    }

    private async saveUsers(users: User[]): Promise<void> {
        try {
            await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2), 'utf-8');
        } catch (error) {
            console.error('保存用户文件失败:', error);
            throw new Error('保存用户数据失败');
        }
    }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.loadUsers();
        return users.map(user => ({ ...user }));
    }

    async findOne(id: string): Promise<UserResponseDto> {
        const users = await this.loadUsers();
        const user = users.find(u => u.id === id);

        if (!user) {
            throw new NotFoundException(`用户 ${id} 未找到`);
        }

        return { ...user };
    }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const users = await this.loadUsers();

        const newUser: User = {
            id: `user_${Date.now()}`,
            name: createUserDto.name,
            email: createUserDto.email || undefined,
            isActive: createUserDto.isActive ?? true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        users.push(newUser);
        await this.saveUsers(users);

        return { ...newUser };
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const users = await this.loadUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            throw new NotFoundException(`用户 ${id} 未找到`);
        }

        const existingUser = users[userIndex]!;
        const updatedUser: User = {
            id: existingUser.id,
            name: updateUserDto.name ?? existingUser.name,
            email: updateUserDto.email ?? existingUser.email,
            isActive: updateUserDto.isActive ?? existingUser.isActive,
            createdAt: existingUser.createdAt,
            updatedAt: new Date().toISOString(),
        };

        users[userIndex] = updatedUser;
        await this.saveUsers(users);

        return { ...updatedUser };
    }

    async remove(id: string): Promise<void> {
        const users = await this.loadUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            throw new NotFoundException(`用户 ${id} 未找到`);
        }

        users.splice(userIndex, 1);
        await this.saveUsers(users);
    }

    async getActiveUsers(): Promise<UserResponseDto[]> {
        const users = await this.loadUsers();
        return users.filter(user => user.isActive).map(user => ({ ...user }));
    }

    async getUserStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }> {
        const users = await this.loadUsers();
        const active = users.filter(user => user.isActive).length;

        return {
            total: users.length,
            active,
            inactive: users.length - active,
        };
    }
} 