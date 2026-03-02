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
- Tailwind CSS
- Framer Motion

---

## 🖥️ 本地部署测试指南

### 环境要求

| 组件 | 版本 | 说明 |
|------|------|------|
| Python | ≥3.9 | 后端运行环境 |
| Node.js | ≥18.0 | 前端运行环境 |
| MySQL | ≥8.0 | 数据库 (可选，使用SQLite) |
| npm | ≥9.0 | 前端包管理器 |

---

### 方式一：快速启动（推荐）

#### 1. 克隆项目

```bash
git clone https://github.com/huchunxu/openclaw_jobfit.git
cd openclaw_jobfit
```

#### 2. 启动后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境（可选）
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 启动服务（默认端口8000）
python -m uvicorn api.main:app --reload --port 8000
```

后端启动成功后，访问：
- API文档: http://localhost:8000/docs
- 健康检查: http://localhost:8000/health

#### 3. 启动前端

```bash
# 新开终端，进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器（默认端口3000）
npm run dev
```

前端启动成功后，访问：http://localhost:3000

---

### 方式二：Docker 部署（生产推荐）

```bash
# 克隆项目
git clone https://github.com/huchunxu/openclaw_jobfit.git
cd openclaw_jobfit

# 使用 Docker Compose 启动（需配置）
docker-compose up -d
```

---

### 依赖说明

#### 后端依赖 (backend/requirements.txt)

```
fastapi>=0.109.0
uvicorn>=0.27.0
sqlalchemy>=2.0.0
pydantic>=2.0.0
python-jose>=3.3.0
passlib>=1.7.4
python-multipart>=0.0.6
openai>=1.0.0
```

#### 前端依赖 (frontend/package.json)

```json
{
  "next": "14.1.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.7",
  "zustand": "^4.5.0",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^11.0.3"
}
```

---

### 配置说明

#### 后端环境变量 (backend/.env)

```bash
# 复制示例配置
cp backend/.env.example backend/.env

# 编辑配置
```

`.env` 配置项：

| 变量名 | 必填 | 说明 | 默认值 |
|--------|------|------|--------|
| `DATABASE_URL` | 否 | 数据库连接串 | sqlite:///./jobfit.db |
| `REDIS_URL` | 否 | Redis连接串 | redis://localhost:6379 |
| `DASHSCOPE_API_KEY` | 是 | 阿里云通义千问API Key | - |
| `OPENAI_API_KEY` | 否 | OpenAI API Key | - |
| `SECRET_KEY` | 否 | JWT密钥 | 自动生成 |

#### 前端环境变量

```bash
# 创建环境变量文件
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### 功能测试

#### 1. 测试后端API

启动后端后，访问 http://localhost:8000/docs

可测试的API：
- `POST /api/auth/send-code` - 发送验证码
- `POST /api/auth/login` - 验证码登录
- `POST /api/jd/parse` - 解析JD
- `POST /api/match` - 计算匹配度
- `POST /api/resumes/generate` - 生成简历

#### 2. 测试前端

1. 打开浏览器访问 http://localhost:3000
2. 可以体验：
   - 用户登录
   - 上传/解析JD
   - 查看匹配结果
   - 生成定制简历
   - 管理个人信息

---

### 常见问题

#### Q: 启动前端报错 `NEXT_PUBLIC_API_URL not defined`

A: 在 `frontend/.env.local` 文件中添加：
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Q: 调用API返回跨域错误

A: 后端已配置CORS，如仍有问题检查前端API地址配置

#### Q: AI功能无法使用

A: 需要配置 `DASHSCOPE_API_KEY` 或 `OPENAI_API_KEY`

#### Q: 数据库连不上

A: 可先使用SQLite（默认），无需安装MySQL

---

### 项目结构

```
openclaw_jobfit/
├── backend/                 # Python FastAPI 后端
│   ├── api/
│   │   ├── main.py        # 应用入口
│   │   └── routers/       # API路由模块
│   │       ├── auth.py    # 认证接口
│   │       ├── jd.py      # JD解析接口
│   │       ├── match.py   # 匹配接口
│   │       └── resume.py  # 简历接口
│   ├── models/            # SQLAlchemy模型
│   ├── services/          # 业务服务
│   │   ├── auth_service.py
│   │   ├── jd_service.py
│   │   ├── match_service.py
│   │   ├── resume_service.py
│   │   └── ai_service.py
│   ├── middleware.py      # 中间件
│   ├── utils.py           # 工具函数
│   └── requirements.txt   # Python依赖
│
├── frontend/               # Next.js 前端
│   ├── app/
│   │   ├── page.tsx       # 首页
│   │   ├── layout.tsx     # 根布局
│   │   ├── globals.css    # 全局样式
│   │   ├── dashboard/     # 工作台
│   │   ├── jd/           # JD管理
│   │   ├── match/        # 匹配结果
│   │   ├── resume/       # 简历
│   │   └── profile/      # 个人信息
│   ├── lib/
│   │   └── api.ts        # API客户端
│   ├── package.json
│   └── tailwind.config.ts
│
├── database/
│   └── schema.sql         # MySQL表结构
│
└── docs/
    ├── dev-log.md         # 开发日志
    └── PRD.md            # 产品需求文档
```

---

## 🚀 后续功能

- [ ] 微信小程序客户端
- [ ] 简历PDF导出
- [ ] 投递追踪提醒
- [ ] 面试题库
- [ ] 薪资谈判助手

---

## 开发团队

- 产品经理: 小茹
- 工程师: 小旭

## License

MIT