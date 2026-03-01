# 开发文档

## 环境设置

### 后端

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 复制环境配置
cp .env.example .env
# 编辑 .env 填入实际配置

# 初始化数据库
python -c "from models.database import init_db; init_db()"

# 启动服务
python -m uvicorn api.main:app --reload --port 8000
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 微信小程序

```bash
cd app
npm install
npm run dev:weapp
```

## API 文档

启动后端后访问: http://localhost:8000/docs

### 主要接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/users | 创建用户 |
| GET | /api/users/{id} | 获取用户 |
| POST | /api/profiles | 创建档案 |
| GET | /api/profiles/{id} | 获取档案 |
| PUT | /api/profiles/{id} | 更新档案 |
| POST | /api/jd/parse | 解析JD |
| POST | /api/match | 计算匹配 |
| POST | /api/resumes/generate | 生成简历 |
| GET | /api/resumes/{id} | 获取简历 |
| GET | /api/applications | 投递列表 |
| PUT | /api/applications/{id} | 更新投递状态 |

## 目录结构

```
jobfit/
├── backend/
│   ├── api/          # API 路由
│   ├── models/       # 数据库模型
│   ├── services/     # 业务服务
│   ├── .env.example  # 环境配置示例
│   └── requirements.txt
│
├── frontend/         # Next.js 前端
│
├── app/              # 微信小程序
│   ├── pages/        # 页面
│   ├── app.js        # 应用入口
│   ├── app.json      # 应用配置
│   └── config.js     # Taro 配置
│
├── database/
│   └── schema.sql    # 数据库表结构
│
└── design/           # 产品设计文档
```

## 技术栈

- 后端: Python FastAPI + SQLAlchemy
- 前端: React + Next.js
- 小程序: Taro (React)
- 数据库: MySQL + Redis
- AI: 通义千问 / GPT-4o