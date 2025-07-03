import { createContext, useContext } from 'react';
import { UserStore } from './UserStore';
import { FormStore } from './FormStore';
import { PredictionStore } from './PredictionStore';
import { AppStore } from './AppStore';

export class RootStore {
    userStore: UserStore;
    formStore: FormStore;
    predictionStore: PredictionStore;
    appStore: AppStore;

    constructor() {
        this.userStore = new UserStore();
        this.formStore = new FormStore();
        this.predictionStore = new PredictionStore();
        this.appStore = new AppStore();
    }

    // 重置所有 Store
    reset(): void {
        this.userStore = new UserStore();
        this.formStore = new FormStore();
        this.predictionStore = new PredictionStore();
        // AppStore 保留设置，不完全重置
        this.appStore.clearError();
        this.appStore.clearAllNotifications();
    }

    // 销毁方法（清理资源）
    destroy(): void {
        // 如果有需要清理的资源，在这里处理
        this.predictionStore.clearAllPredictions();
        this.appStore.clearAllNotifications();
    }
}

// 创建根 Store 实例
export const rootStore = new RootStore();

// 创建 React Context
export const StoreContext = createContext<RootStore>(rootStore);

// 创建 Hook 来使用 Store
export const useStore = (): RootStore => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return store;
};

// 创建各个子 Store 的专用 Hook
export const useUserStore = (): UserStore => useStore().userStore;
export const useFormStore = (): FormStore => useStore().formStore;
export const usePredictionStore = (): PredictionStore => useStore().predictionStore;
export const useAppStore = (): AppStore => useStore().appStore; 