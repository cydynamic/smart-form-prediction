import { makeAutoObservable } from 'mobx';
import { AppState } from './types';

export class AppStore {
    // 状态
    theme: AppState['theme'] = 'light';
    locale: AppState['locale'] = 'zh-CN';
    isLoading = false;
    error: string | null = null;

    // 通知系统
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        timestamp: string;
        duration?: number;
    }> = [];

    // 侧边栏状态
    sidebarCollapsed = false;

    // 页面状态
    currentPage = '/';

    constructor() {
        makeAutoObservable(this);
        this.loadSettings();
    }

    // 加载本地设置
    private loadSettings(): void {
        try {
            const savedTheme = localStorage.getItem('app_theme') as AppState['theme'];
            const savedLocale = localStorage.getItem('app_locale') as AppState['locale'];
            const savedSidebarState = localStorage.getItem('sidebar_collapsed');

            if (savedTheme) {
                this.theme = savedTheme;
            }
            if (savedLocale) {
                this.locale = savedLocale;
            }
            if (savedSidebarState !== null) {
                this.sidebarCollapsed = JSON.parse(savedSidebarState);
            }
        } catch (error) {
            console.warn('加载本地设置失败:', error);
        }
    }

    // 保存设置到本地存储
    private saveSettings(): void {
        try {
            localStorage.setItem('app_theme', this.theme);
            localStorage.setItem('app_locale', this.locale);
            localStorage.setItem('sidebar_collapsed', JSON.stringify(this.sidebarCollapsed));
        } catch (error) {
            console.warn('保存设置失败:', error);
        }
    }

    // 主题相关
    setTheme(theme: AppState['theme']): void {
        this.theme = theme;
        this.saveSettings();
    }

    toggleTheme(): void {
        this.setTheme(this.theme === 'light' ? 'dark' : 'light');
    }

    // 语言相关
    setLocale(locale: AppState['locale']): void {
        this.locale = locale;
        this.saveSettings();
    }

    // 加载状态
    setLoading(loading: boolean): void {
        this.isLoading = loading;
    }

    // 错误处理
    setError(error: string | null): void {
        this.error = error;
        if (error) {
            this.showNotification('error', '错误', error);
        }
    }

    clearError(): void {
        this.error = null;
    }

    // 通知系统
    showNotification(
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string,
        duration = 4500
    ): string {
        const id = `notification_${Date.now()}_${Math.random()}`;
        const notification = {
            id,
            type,
            title,
            message,
            timestamp: new Date().toISOString(),
            duration,
        };

        this.notifications.push(notification);

        // 自动移除通知
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(id);
            }, duration);
        }

        return id;
    }

    removeNotification(id: string): void {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    clearAllNotifications(): void {
        this.notifications = [];
    }

    // 侧边栏状态
    setSidebarCollapsed(collapsed: boolean): void {
        this.sidebarCollapsed = collapsed;
        this.saveSettings();
    }

    toggleSidebar(): void {
        this.setSidebarCollapsed(!this.sidebarCollapsed);
    }

    // 页面导航
    setCurrentPage(page: string): void {
        this.currentPage = page;
    }

    // 便捷通知方法
    showSuccess(title: string, message: string): string {
        return this.showNotification('success', title, message);
    }

    showError(title: string, message: string): string {
        return this.showNotification('error', title, message, 6000);
    }

    showWarning(title: string, message: string): string {
        return this.showNotification('warning', title, message);
    }

    showInfo(title: string, message: string): string {
        return this.showNotification('info', title, message);
    }

    // 计算属性
    get isDarkTheme(): boolean {
        return this.theme === 'dark';
    }

    get isChineseLocale(): boolean {
        return this.locale === 'zh-CN';
    }

    get hasNotifications(): boolean {
        return this.notifications.length > 0;
    }

    get unreadNotifications(): number {
        return this.notifications.length;
    }

    get recentNotifications(): typeof this.notifications {
        return this.notifications.slice(-5);
    }

    // 应用状态
    get appState(): AppState {
        return {
            theme: this.theme,
            locale: this.locale,
            isLoading: this.isLoading,
            error: this.error,
        };
    }
} 