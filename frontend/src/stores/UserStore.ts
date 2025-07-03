import { makeAutoObservable, runInAction } from 'mobx';
import { User } from './types';
import { userApi } from '../services/api';

export class UserStore {
    // 状态
    users: User[] = [];
    currentUser: User | null = null;
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.initializeDefaultUsers();
    }

    // 初始化默认用户
    private initializeDefaultUsers(): void {
        this.users = [
            {
                id: 'user1',
                name: '张三',
                email: 'zhangsan@example.com',
                isActive: true,
            },
            {
                id: 'user2',
                name: '李四',
                email: 'lisi@example.com',
                isActive: true,
            },
            {
                id: 'user3',
                name: '王五',
                email: 'wangwu@example.com',
                isActive: true,
            },
        ];
        this.currentUser = this.users[0] ?? null;
    }

    // 获取所有用户
    async fetchUsers(): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            // const response = await userApi.getUsers();
            // 模拟 API 调用
            await new Promise(resolve => setTimeout(resolve, 500));

            runInAction(() => {
                // this.users = response.data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '获取用户列表失败');
                this.isLoading = false;
            });
        }
    }

    // 选择当前用户
    selectUser(userId: string): void {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.currentUser = user;
        }
    }

    // 添加用户
    async addUser(userData: Omit<User, 'id'>): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            const newUser: User = {
                ...userData,
                id: `user_${Date.now()}`,
            };

            // const response = await userApi.createUser(newUser);

            runInAction(() => {
                this.users.push(newUser);
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '添加用户失败');
                this.isLoading = false;
            });
        }
    }

    // 更新用户
    async updateUser(userId: string, userData: Partial<User>): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            // const response = await userApi.updateUser(userId, userData);

            runInAction(() => {
                const index = this.users.findIndex(u => u.id === userId);
                if (index !== -1) {
                    this.users[index] = { ...this.users[index]!, ...userData };
                    if (this.currentUser?.id === userId) {
                        this.currentUser = this.users[index]!;
                    }
                }
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '更新用户失败');
                this.isLoading = false;
            });
        }
    }

    // 删除用户
    async deleteUser(userId: string): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            // await userApi.deleteUser(userId);

            runInAction(() => {
                this.users = this.users.filter(u => u.id !== userId);
                if (this.currentUser?.id === userId) {
                    this.currentUser = this.users[0] ?? null;
                }
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '删除用户失败');
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
    get activeUsers(): User[] {
        return this.users.filter(user => user.isActive);
    }

    get currentUserName(): string {
        return this.currentUser?.name ?? '未选择用户';
    }

    get hasUsers(): boolean {
        return this.users.length > 0;
    }
} 