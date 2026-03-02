# JobFit 技术架构文档

## 1. 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户端                                 │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│   Web端     │   微信小程序  │    H5端    │    API调用         │
│  (Next.js)  │   (开发中)   │  (开发中)   │                   │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬──────────┘
       │             │             │               │
       └─────────────┴──────┬──────┴───────────────┘
                            │
                    ┌───────▼───────┐
                    │   FastAPI     │
                    │   后端服务     │
                    └───────┬───────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
┌──────▼──────┐    ┌────────▼────────┐    ┌───────▼──────┐
│  AI服务层   │    │   业务逻辑层    │    │   数据访问层  │
│ (通义千问)  │    │  (Services)    │    │ (SQLAlchemy)  │
└─────────────┘    └────────────────┘    └──────────────┘
                            │
                    ┌───────▼───────┐
                    │  MySQL/SQLite │
                    └───────────────┘
```

## 2. 技术栈

### 后端
- **框架**: FastAPI + Uvicorn
- **ORM**: SQLAlchemy
- **认证**: JWT (python-jose)
- **AI**: 通义千问 (dashscope)
- **数据库**: MySQL 8.0 / SQLite

### 前端
- **框架**: Next.js 14 + React 18
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态**: Zustand
- **HTTP**: Axios

## 3. 核心模块

### 3.1 认证模块 (auth_service.py)
- JWT Token生成验证
- 短信验证码发送
- 手机号/微信登录

### 3.2 JD解析模块 (jd_service.py)
- 文本/URL/文件解析
- 技能提取
- 关键词生成

### 3.3 匹配引擎 (match_service.py)
- 5维度评分算法
- 技能匹配
- 经验匹配
- 推荐建议生成

### 3.4 简历生成 (resume_service.py)
- AI定制化生成
- 多模板支持
- ATS优化

### 3.5 信息采集 (profile_collector.py)
- 15问对话流程
- 结构化数据提取

## 4. API路由

| 路由 | 功能 |
|------|------|
| `/api/auth/*` | 认证相关 |
| `/api/jd/*` | JD管理 |
| `/api/match/*` | 匹配计算 |
| `/api/resumes/*` | 简历管理 |
| `/api/profiles/*` | 档案管理 |
| `/api/applications/*` | 投递管理 |

## 5. 数据库表

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| user_profiles | 用户档案 |
| educations | 教育背景 |
| work_experiences | 工作经历 |
| projects | 项目经历 |
| skills | 技能证书 |
| job_descriptions | JD表 |
| match_results | 匹配结果 |
| resumes | 简历表 |
| applications | 投递记录 |
| conversations | 对话记录 |

## 6. 部署

### 开发环境
```bash
# 后端
cd backend && pip install -r requirements.txt
python -m uvicorn api.main:app --reload --port 8000

# 前端
cd frontend && npm install
npm run dev
```

### 一键启动
```bash
./start.sh  # Linux/Mac
start.bat   # Windows
```

---
*文档版本: V1.0*