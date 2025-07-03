# 变更日志

本文档记录了智能表单预测系统的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [1.0.0] - 2024-12-28

### 新增

- 🎉 项目初始化，完整的 Monorepo 架构
- ⚛️ React + TypeScript 前端框架集成
- 🔄 MobX 状态管理系统
- 🎨 Ant Design UI 组件库集成
- 🔧 NestJS + TypeScript 后端 API 框架
- 🦀 Rust + WASM 机器学习引擎框架
- 📚 VitePress 文档系统

### 架构

- **前端 (frontend/)**

  - React 18 + TypeScript 严格模式
  - MobX 响应式状态管理
  - Webpack 5 构建配置
  - Less 样式预处理器
  - ESLint + Prettier 代码规范

- **后端 (backend/)**

  - NestJS 模块化架构
  - Swagger API 文档集成
  - TypeScript 严格类型检查
  - 文件存储系统（预留数据库接口）

- **机器学习 (ml-engine/)**

  - Rust + WebAssembly 架构
  - 前端集成的 ML 预测引擎
  - 基于频率的初始算法

- **文档 (docs/)**
  - VitePress 静态文档生成
  - API 文档、部署指南、开发文档

### 核心功能模块

- **UserStore** - 用户选择和管理
- **FormStore** - 表单配置、字段管理、提交历史
- **PredictionStore** - 机器学习预测和训练
- **AppStore** - 主题、语言、通知、全局状态

### 部署和运维

- Docker + Docker Compose 容器化
- Kubernetes 部署配置
- 环境变量管理
- 生产和开发环境分离

### 开发工具

- pnpm workspace Monorepo 管理
- ESLint + Prettier 代码质量控制
- TypeScript 严格类型检查
- Git 版本控制和提交规范

---

### 约定说明

#### 版本类型

- **新增 (Added)** - 新功能
- **变更 (Changed)** - 对现有功能的变更
- **弃用 (Deprecated)** - 即将移除的功能
- **移除 (Removed)** - 已移除的功能
- **修复 (Fixed)** - 任何 bug 修复
- **安全 (Security)** - 安全相关的改进

#### 提交类型

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档变更
- `style:` - 代码格式化
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建过程或辅助工具的变动
