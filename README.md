# JobFit - AI 驱动职业生涯规划系统

[English](./README.md) | 中文

## 产品简介

JobFit 是一款 AI 驱动的智能职业生涯规划系统，帮助求职者快速生成高质量简历，提升面试邀约率。

## 核心功能

### 🔍 JD 智能解析
- 粘贴 JD 文本或招聘链接
- 自动提取关键技能、要求、关键词

### ⚖️ 精准匹配分析
- 五维度匹配评分（技术技能、工作经验、教育背景、软技能、关键词）
- 岗位类型自适应权重
- 三级投递建议（强烈推荐/优化后再投/暂不建议）

### 📄 AI 简历生成
- 基于用户档案和目标 JD 生成高度匹配的简历
- ATS 友好格式
- 多模板选择

### 📊 投递管理
- 追踪求职进展
- 面试提醒
- 简历多版本管理

## 技术架构

### 后端
- Python FastAPI
- MySQL 8.0
- Redis 7
- 大模型: GPT-4o / 通义千问

### 前端
- React 18 / Next.js 14
- 微信小程序 (MVP 主端)

## 快速开始

### 后端启动

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn api.main:app --reload
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

## 项目结构

```
openclaw_jobfit/
├── backend/           # 后端 API
│   ├── api/          # FastAPI 路由
│   ├── models/       # 数据模型
│   └── services/     # 业务服务
├── frontend/         # 前端 (Next.js)
├── database/         # 数据库脚本
├── design/           # 产品设计文档
├── docs/             # 开发文档
└── app/              # 微信小程序
```

## 开发团队

- 产品经理: 小茹
- 工程师: 小旭

## License

MIT