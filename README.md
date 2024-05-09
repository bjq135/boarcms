野猪API
=======

## 简介

BoarAPI 是一个基于 Node.js 开发，API 优先，提供一个开箱即用的后端框架。简洁的目录结构和项目规范，保持低规模的灵活应用程序框架。


## 特性

- 保持低规模的灵活应用程序框架
- 基于 Node.js 开发，性能优异
- 渐进式开发
- 内置用户管理、权限管理、日志系统等，快速构建自己的应用


## 项目结构

```
├── api                        # API 目录
|    ├── controllers           # 控制器
|    ├── middlewares           # 中间件
|    ├── services              # 服务
|    ├── utils                 # 工具程序
|    ├── config.js             # 配置文件
|    ├── main.js               # 入口文件
|    └── router.js             # 路由文件
├── bin                        # 控制台程序 (可选)
├── docs                       # 文档目录
├── logs                       # 日志目录
├── public                     # 日志目录
|    ├── assets                # 模块静态资源目录
|    ├── docs                  # 生成的文档
|    └── uploads               # 文件上传目录
├── tests                      # 测试目录
├── .env                       # 环境变量
└── README.md                  # 项目介绍
```

## 接口文档

- [接口文档](docs/index.md)
