import { makeAutoObservable, runInAction } from 'mobx';
import { PredictionResult, PredictionCandidate } from './types';
import { predictionApi } from '../services/api';

export class PredictionStore {
    // 状态
    predictions: Map<string, PredictionResult> = new Map();
    isTraining = false;
    trainingProgress = 0;
    modelVersion = 0;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // 获取字段预测
    async getPrediction(
        userId: string,
        fieldId: string,
        fieldName: string,
        context: Record<string, unknown> = {}
    ): Promise<void> {
        // 设置加载状态
        this.setPredictionLoading(fieldId, true);

        try {
            // 模拟机器学习预测API调用
            // const response = await predictionApi.predict({
            //   userId,
            //   fieldId,
            //   fieldName,
            //   context,
            // });

            // 模拟预测结果
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockCandidates: PredictionCandidate[] = this.generateMockCandidates(fieldName);

            runInAction(() => {
                this.predictions.set(fieldId, {
                    fieldId,
                    candidates: mockCandidates,
                    isLoading: false,
                });
            });
        } catch (error) {
            runInAction(() => {
                this.predictions.set(fieldId, {
                    fieldId,
                    candidates: [],
                    isLoading: false,
                    error: error instanceof Error ? error.message : '预测失败',
                });
            });
        }
    }

    // 生成模拟预测候选项
    private generateMockCandidates(fieldName: string): PredictionCandidate[] {
        const candidatesMap: Record<string, PredictionCandidate[]> = {
            username: [
                { value: 'admin', confidence: 0.9, source: 'history' },
                { value: 'user001', confidence: 0.8, source: 'history' },
                { value: 'test_user', confidence: 0.7, source: 'pattern' },
            ],
            email: [
                { value: 'admin@example.com', confidence: 0.85, source: 'history' },
                { value: 'user@company.com', confidence: 0.75, source: 'pattern' },
                { value: 'test@gmail.com', confidence: 0.65, source: 'ml' },
            ],
            age: [
                { value: '25', confidence: 0.8, source: 'history' },
                { value: '30', confidence: 0.7, source: 'ml' },
                { value: '28', confidence: 0.6, source: 'pattern' },
            ],
            gender: [
                { value: '男', confidence: 0.9, source: 'history' },
                { value: '女', confidence: 0.1, source: 'history' },
            ],
        };

        return candidatesMap[fieldName] ?? [];
    }

    // 训练模型
    async trainModel(userId: string, trainingData: unknown[]): Promise<void> {
        this.setTraining(true);
        this.setTrainingProgress(0);
        this.setError(null);

        try {
            // 模拟训练过程
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                runInAction(() => {
                    this.trainingProgress = i;
                });
            }

            // const response = await predictionApi.trainModel({
            //   userId,
            //   data: trainingData,
            // });

            runInAction(() => {
                this.modelVersion += 1;
                this.isTraining = false;
                this.trainingProgress = 100;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : '模型训练失败');
                this.isTraining = false;
                this.trainingProgress = 0;
            });
        }
    }

    // 清除字段预测
    clearPrediction(fieldId: string): void {
        this.predictions.delete(fieldId);
    }

    // 清除所有预测
    clearAllPredictions(): void {
        this.predictions.clear();
    }

    // 选择预测候选项
    selectCandidate(fieldId: string, candidate: PredictionCandidate): void {
        // 这里可以记录用户选择行为，用于改进模型
        console.log(`用户选择了候选项: ${candidate.value} (置信度: ${candidate.confidence})`);

        // 可以发送反馈给后端
        // predictionApi.recordSelection({
        //   fieldId,
        //   selectedValue: candidate.value,
        //   confidence: candidate.confidence,
        //   source: candidate.source,
        // });
    }

    // 记录用户拒绝预测
    rejectPrediction(fieldId: string, actualValue: string): void {
        // 记录用户拒绝预测的行为，用于模型改进
        console.log(`用户拒绝预测，实际输入: ${actualValue}`);

        // predictionApi.recordRejection({
        //   fieldId,
        //   rejectedCandidates: this.getPredictionResult(fieldId)?.candidates ?? [],
        //   actualValue,
        // });
    }

    // 辅助方法
    private setPredictionLoading(fieldId: string, loading: boolean): void {
        const current = this.predictions.get(fieldId);
        const updatedResult: PredictionResult = {
            fieldId,
            candidates: current?.candidates ?? [],
            isLoading: loading,
        };
        if (current?.error) {
            updatedResult.error = current.error;
        }
        this.predictions.set(fieldId, updatedResult);
    }

    private setTraining(training: boolean): void {
        this.isTraining = training;
    }

    private setTrainingProgress(progress: number): void {
        this.trainingProgress = progress;
    }

    private setError(error: string | null): void {
        this.error = error;
    }

    // 计算属性和getter方法
    getPredictionResult(fieldId: string): PredictionResult | undefined {
        return this.predictions.get(fieldId);
    }

    isPredictionLoading(fieldId: string): boolean {
        return this.getPredictionResult(fieldId)?.isLoading ?? false;
    }

    getPredictionCandidates(fieldId: string): PredictionCandidate[] {
        return this.getPredictionResult(fieldId)?.candidates ?? [];
    }

    hasPrediction(fieldId: string): boolean {
        const result = this.getPredictionResult(fieldId);
        return !!(result && result.candidates.length > 0);
    }

    get isModelTraining(): boolean {
        return this.isTraining;
    }

    get currentModelVersion(): number {
        return this.modelVersion;
    }

    get totalPredictions(): number {
        return this.predictions.size;
    }

    get activePredictions(): number {
        return Array.from(this.predictions.values()).filter(p => p.candidates.length > 0).length;
    }
} 