import { defineConfig } from 'vitepress'

export default defineConfig({
    title: '智能表单预测系统',
    description: '基于机器学习的智能表单自动填充MVP系统文档',

    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: 'API 文档', link: '/api/' },
            { text: '部署文档', link: '/deployment/' }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: '指南',
                    items: [
                        { text: '快速开始', link: '/guide/getting-started' },
                        { text: '项目结构', link: '/guide/project-structure' },
                        { text: '开发环境', link: '/guide/development' },
                        { text: '配置说明', link: '/guide/configuration' }
                    ]
                }
            ],
            '/api/': [
                {
                    text: 'API 文档',
                    items: [
                        { text: '概述', link: '/api/' },
                        { text: '表单 API', link: '/api/forms' },
                        { text: '用户 API', link: '/api/users' },
                        { text: '预测 API', link: '/api/predictions' }
                    ]
                }
            ],
            '/deployment/': [
                {
                    text: '部署文档',
                    items: [
                        { text: '概述', link: '/deployment/' },
                        { text: 'Docker 部署', link: '/deployment/docker' },
                        { text: 'Kubernetes 部署', link: '/deployment/kubernetes' },
                        { text: '环境变量', link: '/deployment/environment' }
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/your-org/smart-form-prediction' }
        ],

        footer: {
            message: '基于 MIT 许可发布',
            copyright: 'Copyright © 2024 Smart Form Team'
        }
    }
}) 