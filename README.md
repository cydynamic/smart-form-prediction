# 智能表单预测系统

基于机器学习的智能表单自动填充 MVP 系统，通过学习用户的表单填写行为，预测并推荐表单内容，提高重复性表单填写效率。

## 🎯 项目特性

- 🤖 **智能预测**：基于机器学习的表单内容预测
- 🎨 **动态表单**：支持多种表单控件类型，字段数量可自定义
- 🚀 **实时推荐**：用户输入时实时显示内容候选
- 📦 **Monorepo 架构**：前后端统一管理，易于维护
- 🐳 **容器化部署**：支持 Docker 和 Kubernetes 部署
- 💪 **类型安全**：全栈 TypeScript，严格类型检查

## 🏗️ 技术栈

### 前端

- **React 18** + **TypeScript**
- **Webpack 5** + **Less**
- **Ant Design** UI 组件库
- **WASM 机器学习引擎**

### 后端

- **NestJS** + **TypeScript**
- **文件存储**（预留数据库接口）
- **RESTful API**

### 机器学习

- **Rust** + **WebAssembly**
- **前端机器学习库**

### 开发工具

- **pnpm workspace**（Monorepo 管理）
- **ESLint** + **Prettier**（代码规范）
- **Docker** + **Kubernetes**（容器化部署）

## 📁 项目结构

```
smart-form-prediction/
├── frontend/             # React前端应用
│   ├── src/
│   ├── public/
│   ├── webpack.config.js
│   └── package.json
├── backend/              # NestJS后端服务
│   ├── src/
│   ├── test/
│   └── package.json
├── ml-engine/            # Rust + WASM机器学习引擎
│   ├── src/
│   ├── Cargo.toml
│   └── pkg/
├── docs/                 # 项目文档
│   ├── api/              # API文档
│   ├── deployment/       # 部署文档
│   └── development/      # 开发文档
├── requirements/         # 需求文档
├── docker/               # Docker配置
├── k8s/                  # Kubernetes配置
├── package.json          # 根package.json
├── pnpm-workspace.yaml   # pnpm workspace配置
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Rust >= 1.70.0 (用于 WASM 编译)
- Docker >= 20.0.0 (可选)

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd smart-form-prediction

# 安装所有依赖
pnpm install
```

### 开发环境启动

```bash
# 启动所有服务（前端+后端）
pnpm dev

# 或者分别启动
pnpm --filter frontend dev    # 前端开发服务器
pnpm --filter backend dev     # 后端开发服务器
```

### 构建项目

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm --filter frontend build
pnpm --filter backend build
pnpm --filter ml-engine build
```

## 🐳 Docker 部署

### 本地 Docker 开发

```bash
# 构建并启动所有服务
pnpm docker:build
pnpm docker:up

# 停止服务
pnpm docker:down
```

### 生产环境 Docker 部署

```bash
# 构建生产镜像
docker-compose -f docker-compose.prod.yml build

# 启动生产环境
docker-compose -f docker-compose.prod.yml up -d
```

## ☸️ Kubernetes 部署

```bash
# 应用K8s配置
pnpm k8s:deploy

# 删除K8s资源
pnpm k8s:delete
```

## 🧪 测试

```bash
# 运行所有测试
pnpm test

# 运行特定项目测试
pnpm --filter frontend test
pnpm --filter backend test
```

## 📊 代码质量

```bash
# 代码检查
pnpm lint

# 自动修复代码格式
pnpm lint:fix
```

## 🎮 使用指南

### 1. 选择用户

在页面顶部的下拉框中选择预置用户（用于区分不同用户的数据）

### 2. 配置表单

- 添加/删除表单字段（2-10 个字段）
- 选择字段类型：文本框、数字框、下拉框、多选框、密码框
- 至少保留一个文本框

### 3. 智能填写

- 填写表单字段
- 当焦点移到下一个字段时，系统会显示预测候选
- 使用键盘上下箭头 + 回车，或鼠标点击选择候选内容

### 4. 提交数据

- 提交表单后，数据会被用于训练机器学习模型
- 多次提交后，预测准确性会逐步提升

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📝 开发规范

- 使用 TypeScript，避免使用`any`类型
- 遵循 ESLint 和 Prettier 配置
- 编写单元测试和集成测试
- 提交信息遵循[约定式提交](https://conventionalcommits.org/)规范
- 代码审查必须通过才能合并

## 📖 文档

- [需求文档](./requirements/prompt.md)
- [API 文档](./docs/api/)
- [部署文档](./docs/deployment/)
- [开发文档](./docs/development/)

## 🐛 问题反馈

如果你发现任何问题或有功能建议，请创建[Issue](https://github.com/your-org/smart-form-prediction/issues)。

## 📄 许可证

本项目基于 [MIT](./LICENSE) 许可证开源。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

**版本**: v1.0.0  
**维护者**: Smart Form Team  
**更新时间**: 2024-12-28
