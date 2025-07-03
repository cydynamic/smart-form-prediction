---
layout: home

hero:
  name: '智能表单预测系统'
  text: '基于机器学习的表单自动填充'
  tagline: '提高重复性表单填写效率，智能预测用户输入行为'
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看演示
      link: /demo

features:
  - icon: 🤖
    title: 智能预测
    details: 基于机器学习算法，分析用户历史输入行为，智能预测表单内容
  - icon: 🎨
    title: 动态表单
    details: 支持多种表单控件，字段数量可自定义，灵活配置表单结构
  - icon: 🚀
    title: 实时推荐
    details: 用户输入时实时显示内容候选，支持键盘和鼠标操作
  - icon: 📦
    title: 现代架构
    details: TypeScript + React + NestJS + Rust/WASM，全栈类型安全
  - icon: 🐳
    title: 容器化部署
    details: 支持Docker和Kubernetes部署，易于扩展和维护
  - icon: 💪
    title: 高质量代码
    details: 严格的代码规范，完整的测试覆盖，持续集成流程
---

## 快速体验

```bash
# 克隆项目
git clone <repository-url>
cd smart-form-prediction

# 安装依赖
pnpm install

# 启动开发环境
pnpm dev
```

## 核心特性

### 🎯 智能预测算法

系统通过机器学习算法分析用户的表单填写习惯，能够：

- 识别用户输入模式
- 预测下一个字段的可能内容
- 根据上下文提供智能推荐
- 随着使用次数增加，预测准确性持续提升

### 🎨 灵活的表单配置

支持多种表单控件类型：

- **文本框** - 用于输入文本内容
- **数字框** - 专门处理数字输入
- **下拉框** - 提供预设选项
- **多选框** - 支持多项选择
- **密码框** - 安全的密码输入

### 🚀 优秀的用户体验

- **实时预测** - 无需等待，即时响应
- **多种交互方式** - 键盘、鼠标都支持
- **美观的界面** - 基于 Ant Design 的现代 UI
- **响应式设计** - 适配各种屏幕尺寸

## 技术架构

```mermaid
graph TD
    A[前端 React + TypeScript] --> B[后端 NestJS API]
    A --> C[WASM 机器学习引擎]
    B --> D[文件存储系统]
    C --> E[Rust ML 算法]
    F[Docker 容器] --> A
    F --> B
    G[Kubernetes 集群] --> F
```

## 开源许可

本项目基于 [MIT 许可证](https://github.com/your-org/smart-form-prediction/blob/main/LICENSE) 开源。
