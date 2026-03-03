# 数据库设计

## 概述

本项目使用 MySQL 8.0 作为主数据库，Redis 7 作为缓存层。

---

## 核心表结构

### 1. users - 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键，自增 |
| openid | VARCHAR(64) | 第三方平台唯一标识 |
| nickname | VARCHAR(128) | 用户昵称 |
| avatar_url | VARCHAR(512) | 头像URL |
| phone | VARCHAR(20) | 手机号 |
| email | VARCHAR(128) | 邮箱 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 2. resumes - 简历表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键，自增 |
| user_id | BIGINT UNSIGNED | 外键，关联users |
| title | VARCHAR(128) | 简历标题 |
| content | JSON | 简历完整内容 |
| target_jd_id | BIGINT UNSIGNED | 目标JD（可选） |
| match_score | DECIMAL(5,2) | 匹配分数 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 3. job_descriptions - 职位描述表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键，自增 |
| source | VARCHAR(32) | 来源平台 |
| source_id | VARCHAR(128) | 源站ID |
| title | VARCHAR(256) | 职位名称 |
| company | VARCHAR(256) | 公司名称 |
| location | VARCHAR(128) | 工作地点 |
| salary_range | VARCHAR(64) | 薪资范围 |
| requirements | JSON | 技能要求 |
| raw_text | TEXT | 原始JD文本 |
| parsed_data | JSON | 解析后的结构化数据 |
| created_at | DATETIME | 创建时间 |

### 4. user_profiles - 用户画像表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键，自增 |
| user_id | BIGINT UNSIGNED | 外键，关联users |
| work_experience | JSON | 工作经历 |
| education | JSON | 教育背景 |
| skills | JSON | 技能列表 |
| project_experience | JSON | 项目经验 |
| updated_at | DATETIME | 更新时间 |

### 5. conversations - 对话记录表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键，自增 |
| user_id | BIGINT UNSIGNED | 外键，关联users |
| session_id | VARCHAR(64) | 会话ID |
| role | ENUM('user','assistant') | 角色 |
| content | TEXT | 消息内容 |
| metadata | JSON | 附加信息 |
| created_at | DATETIME | 创建时间 |

### 6. match_results - 匹配结果表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键，自增 |
| user_id | BIGINT UNSIGNED | 外键，关联users |
| jd_id | BIGINT UNSIGNED | 外键，关联job_descriptions |
| score | DECIMAL(5,2) | 匹配分数 |
| gaps | JSON | 能力差距分析 |
| recommendations | JSON | 改进建议 |
| created_at | DATETIME | 创建时间 |

---

## Redis 缓存设计

### 会话缓存
- Key: `session:{session_id}`
- TTL: 30分钟
- Value: 用户会话上下文

### 简历缓存
- Key: `resume:{resume_id}`
- TTL: 1小时
- Value: 简历JSON

### 限流
- Key: `rate_limit:{user_id}:{endpoint}`
- TTL: 1分钟
- Value: 请求计数

---

## 索引设计

- users: openid (唯一索引)
- resumes: user_id, target_jd_id
- job_descriptions: source, source_id (联合唯一索引)
- user_profiles: user_id (唯一索引)
- conversations: user_id, session_id, created_at
- match_results: user_id, jd_id, score

---

## 后续优化

- 分库分表：用户量增长后考虑水平分片
- 只读副本：分离读写请求
- 冷热分离：历史数据归档到归档库