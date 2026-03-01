---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
    ReservedCode1: 30460221008f3649d797018912bd1058debfcd3837b60d8483fdd4229bfe93623be2a82b3b022100c95f95940d09436c13282fca5eec1e5092ea780f803426a233fe8eb1de33652e
    ReservedCode2: 304402202edbc5c22820b2eba06061cba9117d4e729dfa132227dec283d7505d0663b00302205e3545f11bf60aa6cef7ef744ab4adf79cdac880297b9afbc9bf89f27d0d3126
---

# JobFit 产品结构设计

> 执行：小茹（AI产品经理）
> 日期：2026-03-01
> 基于：竞品调研 + 差异化分析

---

## 一、整体产品架构

### 1.1 系统架构图（文字版）

```
┌─────────────────────────────────────────────────────────────────┐
│                        JobFit 系统架构                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │   用户界面层     │  │   业务逻辑层      │  │   AI引擎层     │  │
│  │                 │  │                  │  │                │  │
│  │ • Web端         │  │ • 用户管理服务   │  │ • NLP解析引擎  │  │
│  │ • 移动端H5      │  │ • 信息采集服务   │  │ • 匹配算法引擎 │  │
│  │ • 微信小程序    │  │ • JD解析服务     │  │ • 简历生成引擎 │  │
│  │                 │  │ • 匹配计算服务   │  │ • 对话管理引擎 │  │
│  └────────┬────────┘  │ • 简历生成服务   │  │                │  │
│           │           │ • 通知服务       │  └────────┬───────┘  │
│           │           └────────┬─────────┘           │          │
│           │                    │                      │          │
│  ┌────────▼────────────────────▼──────────────────────▼───────┐  │
│  │                      API网关层                               │  │
│  │              统一认证 | 限流 | 日志 | 安全                   │  │
│  └────────────────────────────┬────────────────────────────────┘  │
│                               │                                   │
│  ┌────────────────────────────▼────────────────────────────────┐  │
│  │                      数据存储层                              │  │
│  │  MySQL（用户/简历数据）| Redis（缓存）| ES（JD语料搜索）     │  │
│  │  OSS（文件存储）| MongoDB（对话记录）                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 产品模块架构

```
JobFit 产品模块
│
├── 🔐 账户系统
│   ├── 注册/登录（手机号/微信/邮箱）
│   ├── 个人档案管理
│   └── 会员管理
│
├── 📋 信息采集模块（Module A）
│   ├── 对话式引导采集
│   │   ├── 基本信息采集
│   │   ├── 教育背景采集
│   │   ├── 工作经历采集
│   │   ├── 技能能力采集
│   │   └── 项目经历采集
│   ├── 简历文件导入
│   │   ├── PDF解析
│   │   ├── Word解析
│   │   └── 图片OCR解析（可选）
│   └── 个人档案存储与管理
│
├── 🔍 JD解析模块（Module B）
│   ├── JD文本/链接输入
│   ├── 结构化字段提取
│   │   ├── 岗位基本信息
│   │   ├── 技术技能要求
│   │   ├── 软技能要求
│   │   ├── 经验年限要求
│   │   ├── 学历要求
│   │   └── 关键词权重排序
│   └── JD历史管理
│
├── ⚖️ 匹配引擎模块（Module C）
│   ├── 多维度匹配评分
│   ├── 能力缺口可视化
│   ├── 竞争力分析
│   └── 投递建议输出
│
├── 📄 简历生成模块（Module D）
│   ├── ATS友好内容生成
│   ├── 成果量化改写
│   ├── 关键词植入策略
│   ├── 多版本简历管理
│   └── 导出（PDF/Word）
│
└── 📊 数据中心
    ├── 求职记录
    ├── 匹配历史
    └── 简历版本管理
```

---

## 二、核心功能模块详细设计

### 2.1 Module A：信息采集模块

#### 功能目标
以最低认知成本收集用户完整、高质量的职业信息，支持"对话式引导"和"文件导入"两种方式，确保信息的准确性和完整性。

#### 设计原则
- **渐进式披露**：从简单到复杂，分步骤引导，避免信息过载
- **智能追问**：AI根据上一条回答判断是否需要追问（如工作经历中提到"负责X项目"，则追问"项目规模和成果如何？"）
- **实时保存**：对话进度实时保存，支持断点继续
- **可编辑**：所有信息可后续修改

#### 两种信息采集入口

```
选择采集方式
├── 方式A：对话式引导（推荐）
│   └── AI助手逐步引导填写，支持自然语言输入
└── 方式B：上传简历文件
    ├── 支持格式：PDF / Word（.doc/.docx）
    ├── AI自动解析提取结构化信息
    └── 用户确认和补充缺失信息
```

#### 对话式采集流程

```
开场白 → 基本信息 → 求职意向 → 教育背景 → 工作经历（循环）→ 项目经历 → 技能 → 自我评价 → 完成确认
```

---

### 2.2 Module B：JD解析模块

#### 功能目标
将非结构化的招聘JD文本转换为结构化的能力需求模型，提取关键信息，为匹配引擎提供标准化输入。

#### JD输入方式

```
JD输入入口
├── 方式1：粘贴JD文本
├── 方式2：输入招聘链接（爬取JD内容）
└── 方式3：上传JD文件（PDF/Word）
```

#### 解析输出结构

解析后输出标准化JD数据模型，包含：
- 岗位基本信息（职位名称、公司、行业、薪资范围、工作地点）
- 必要条件（Hard Requirements）
- 加分条件（Preferred Requirements）
- 核心技术技能清单（分权重排序）
- 软技能要求
- 经验年限要求
- 学历要求
- 行业背景要求
- 关键词词频分析（Top20关键词）
- 隐性要求识别（JD中隐含的潜在要求）

---

### 2.3 Module C：匹配引擎模块

#### 功能目标
基于用户个人信息档案和JD解析结果，计算多维度匹配评分，标记能力缺口，给出投递建议。

#### 评分维度与权重

| 评分维度 | 权重 | 说明 |
|---------|------|------|
| 技术技能匹配度 | 35% | 硬技能、工具、编程语言等的匹配程度 |
| 工作经验匹配度 | 25% | 行业经验、岗位相关性、年限匹配 |
| 教育背景匹配度 | 15% | 学历层次、专业相关性 |
| 软技能匹配度 | 15% | 沟通、领导力、协作等软技能 |
| 关键词覆盖率 | 10% | 简历中对JD关键词的覆盖程度 |

#### 匹配结果输出

```
匹配报告
├── 综合评分（0-100分）
├── 各维度评分详情
│   ├── 技术技能：XX/35
│   ├── 工作经验：XX/25
│   ├── 教育背景：XX/15
│   ├── 软技能：XX/15
│   └── 关键词：XX/10
├── 能力雷达图（可视化）
├── 匹配项清单（✓ 已具备）
├── 缺口项清单（✗ 缺失 / ⚡ 不足）
│   ├── 关键缺口（影响投递成功率）
│   └── 加分缺口（有则更好）
└── 投递建议
    ├── 强烈推荐投递（≥70分）
    ├── 优化后投递（50-69分）
    └── 暂不建议投递（<50分）
```

---

### 2.4 Module D：简历生成模块

#### 功能目标
根据用户信息档案和JD要求，生成一份ATS友好、突出成果、高度匹配目标岗位的简历内容。

#### 生成策略

1. **JD关键词植入**：将JD中的高权重关键词自然融入简历中相应模块
2. **成果量化改写**：将模糊描述转化为STAR法则+数据支撑的成果表述
3. **相关性排序**：将最匹配岗位的经历排在靠前位置
4. **动词升维**：将平淡动词替换为有力的行动词汇
5. **技能对齐**：技能栏与JD要求精准匹配

#### 生成输出

- 完整简历内容（各模块文字）
- 推荐简历模板（基于岗位类型推荐）
- 导出格式（PDF/Word）
- 版本管理（可保存多个版本）

---

## 三、用户流程设计

### 3.1 主流程图

```
[用户进入JobFit]
       │
       ▼
[注册/登录]
       │
       ▼
[选择使用方式]
       ├── A. 新用户 → [对话式信息采集] → [档案建立完成]
       └── B. 已有简历 → [上传文件] → [AI解析] → [确认补充] → [档案建立完成]
              │
              ▼
       [个人档案已就绪]
              │
              ▼
       [输入目标JD]
       ├── 粘贴文本
       ├── 粘贴链接
       └── 上传文件
              │
              ▼
       [JD解析中（AI处理，3-10秒）]
              │
              ▼
       [查看JD解析结果]
       （职位要求结构化展示）
              │
              ▼
       [执行匹配分析]
              │
              ▼
       [查看匹配报告]
       ├── 综合评分展示
       ├── 能力雷达图
       ├── 缺口详情
       └── 投递建议
              │
       ┌──────┴──────────────────┐
       │                         │
       ▼                         ▼
[强烈推荐投递]           [优化后再投递]
       │                         │
       ▼                         ▼
[生成匹配简历]           [查看缺口改善建议]
       │                         │
       ▼                         ▼
[预览/编辑简历]          [用户完善信息]
       │                         │
       ▼                         └──→ [重新匹配]
[导出PDF/Word]
       │
       ▼
[任务完成 ✓]
```

### 3.2 分支流程

**分支A：对话式信息采集子流程**

```
[对话开始]
    │
    ▼
[AI：你好！请告诉我你的姓名？]
    │
    ▼
[用户输入] → [AI智能识别] → [追问/下一问]
    │
    ▼
[分模块采集：基本信息 → 教育 → 工作 → 项目 → 技能]
    │
    ▼
[AI归纳总结，展示档案] → [用户确认修改]
    │
    ▼
[档案保存完成]
```

**分支B：JD链接解析子流程**

```
[用户输入招聘链接]
    │
    ▼
[系统识别平台（BOSS/智联/拉勾/LinkedIn等）]
    │
    ▼
[抓取JD内容] → [失败] → [提示用户手动粘贴文本]
    │
    ▼
[NLP解析提取结构化信息]
    │
    ▼
[展示解析结果，用户确认]
```

**分支C：匹配分数低时的引导流程**

```
[匹配分数 < 50分]
    │
    ▼
[展示：暂不建议直接投递]
    │
    ▼
[详细说明：3个关键缺口导致分数低]
    │
    ▼
[提供两个选项]
    ├── 选项1：继续生成简历（发现此岗位仍有价值）
    └── 选项2：查看其他更匹配的岗位推荐
```

---

## 四、数据结构设计

### 4.1 用户信息数据模型（User Profile）

```json
{
  "user_id": "UUID",
  "basic_info": {
    "name": "姓名",
    "gender": "性别",
    "birth_year": "出生年份",
    "phone": "手机号",
    "email": "邮箱",
    "location": "所在城市",
    "target_location": ["意向城市列表"],
    "linkedin_url": "LinkedIn链接",
    "github_url": "GitHub链接",
    "portfolio_url": "作品集链接"
  },
  "job_intention": {
    "target_positions": ["目标岗位1", "目标岗位2"],
    "target_industries": ["目标行业"],
    "salary_range": {"min": 20000, "max": 35000, "currency": "CNY"},
    "job_type": "full_time|part_time|internship",
    "available_date": "到岗日期"
  },
  "education": [
    {
      "edu_id": "UUID",
      "school_name": "学校名称",
      "major": "专业",
      "degree": "bachelor|master|phd|associate|other",
      "gpa": "3.8/4.0",
      "start_date": "2018-09",
      "end_date": "2022-06",
      "honors": ["奖学金", "优秀毕业生"],
      "courses": ["核心课程1", "核心课程2"],
      "activities": "社团/活动描述"
    }
  ],
  "work_experience": [
    {
      "exp_id": "UUID",
      "company_name": "公司名称",
      "company_scale": "startup|small|medium|large|enterprise",
      "industry": "行业",
      "position": "职位名称",
      "department": "部门",
      "employment_type": "full_time|part_time|intern|freelance",
      "start_date": "2022-07",
      "end_date": "2024-12",
      "is_current": false,
      "responsibilities": ["职责描述1", "职责描述2"],
      "achievements": ["成果1（含数据）", "成果2（含数据）"],
      "tools_used": ["工具/技术1", "工具/技术2"]
    }
  ],
  "projects": [
    {
      "proj_id": "UUID",
      "project_name": "项目名称",
      "role": "角色",
      "start_date": "2023-01",
      "end_date": "2023-06",
      "team_size": 5,
      "description": "项目描述",
      "tech_stack": ["技术栈"],
      "achievements": "项目成果",
      "project_url": "项目链接"
    }
  ],
  "skills": {
    "tech_skills": [
      {"name": "Python", "level": "expert|proficient|familiar", "years": 3}
    ],
    "soft_skills": ["沟通能力", "项目管理"],
    "languages": [
      {"language": "English", "level": "native|fluent|business|basic"}
    ],
    "certifications": [
      {
        "name": "AWS Solutions Architect",
        "issuer": "Amazon",
        "issue_date": "2023-03",
        "expire_date": "2026-03",
        "credential_id": "XXXXXXXX"
      }
    ],
    "tools": ["Figma", "JIRA", "Git"]
  },
  "self_introduction": "自我介绍文本",
  "additional_info": {
    "publications": [],
    "awards": [],
    "volunteer": []
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 4.2 JD数据模型（Job Description）

```json
{
  "jd_id": "UUID",
  "user_id": "UUID（关联用户）",
  "source": {
    "input_type": "text|url|file",
    "original_url": "https://...",
    "raw_text": "原始JD全文",
    "platform": "boss|zhilian|lagou|linkedin|other"
  },
  "basic_info": {
    "job_title": "职位名称",
    "company_name": "公司名称",
    "company_industry": "行业",
    "company_scale": "规模",
    "location": "工作地点",
    "salary_range": {"min": 20000, "max": 35000},
    "job_type": "full_time|...",
    "posting_date": "发布日期"
  },
  "requirements": {
    "must_have": [
      {
        "type": "tech_skill|experience|education|certification",
        "content": "Python开发经验",
        "weight": 0.9,
        "is_critical": true
      }
    ],
    "nice_to_have": [
      {
        "type": "tech_skill|experience",
        "content": "有大数据处理经验",
        "weight": 0.5,
        "is_critical": false
      }
    ]
  },
  "extracted_fields": {
    "tech_skills": [
      {"name": "Python", "required_level": "proficient", "weight": 0.85}
    ],
    "soft_skills": ["沟通能力", "团队协作"],
    "min_experience_years": 3,
    "education_requirement": "bachelor",
    "major_preference": ["计算机", "软件工程"],
    "industry_preference": ["互联网", "金融科技"],
    "top_keywords": [
      {"keyword": "Python", "frequency": 5, "importance": "critical"},
      {"keyword": "微服务", "frequency": 3, "importance": "important"}
    ],
    "hidden_requirements": ["快速学习能力", "适应快节奏环境"]
  },
  "responsibilities": ["工作职责列表"],
  "benefits": ["薪资福利"],
  "parsed_at": "timestamp",
  "created_at": "timestamp"
}
```

### 4.3 匹配结果数据模型（Match Result）

```json
{
  "match_id": "UUID",
  "user_id": "UUID",
  "jd_id": "UUID",
  "profile_snapshot_id": "UUID（使用的档案快照版本）",
  "scores": {
    "overall_score": 73,
    "tech_skills_score": 28,
    "tech_skills_max": 35,
    "experience_score": 18,
    "experience_max": 25,
    "education_score": 12,
    "education_max": 15,
    "soft_skills_score": 10,
    "soft_skills_max": 15,
    "keywords_score": 5,
    "keywords_max": 10
  },
  "matched_items": [
    {"type": "tech_skill", "item": "Python", "match_level": "full|partial"}
  ],
  "gap_items": [
    {
      "type": "tech_skill|experience|certification",
      "item": "Docker/Kubernetes",
      "severity": "critical|important|optional",
      "improvement_suggestion": "建议学习容器化技术，可参考官方文档..."
    }
  ],
  "recommendation": {
    "level": "strong|conditional|not_recommended",
    "label": "强烈推荐投递|优化后再投递|暂不建议投递",
    "reason": "你的核心技能高度匹配，但缺少云原生经验...",
    "action_items": ["补充Docker经验描述", "在技能栏添加CI/CD"]
  },
  "ats_analysis": {
    "keyword_coverage": 0.65,
    "missing_keywords": ["Kubernetes", "CI/CD"],
    "format_score": 90
  },
  "created_at": "timestamp"
}
```

### 4.4 简历数据模型（Generated Resume）

```json
{
  "resume_id": "UUID",
  "user_id": "UUID",
  "match_id": "UUID（关联匹配记录）",
  "jd_id": "UUID（目标岗位）",
  "version": 1,
  "name": "简历版本名称",
  "template_id": "template_modern_001",
  "content": {
    "header": {
      "name": "张三",
      "contact": "138xxxx1234 | zhangsan@email.com",
      "location": "上海",
      "links": ["github.com/zhangsan"]
    },
    "summary": "AI生成的个人简介（针对目标岗位优化）",
    "experience": [
      {
        "company": "XX科技有限公司",
        "position": "后端工程师",
        "period": "2022.07 - 至今",
        "bullets": [
          "主导微服务架构重构，将系统响应时间缩短40%，支撑日均500万请求",
          "开发基于Python FastAPI的RESTful API，服务日活用户超过100万"
        ]
      }
    ],
    "education": [...],
    "skills": {
      "tech": "Python | FastAPI | MySQL | Redis | Docker",
      "soft": "项目管理 | 跨团队协作",
      "language": "英语（商务级别）"
    },
    "projects": [...]
  },
  "optimization_log": [
    {"action": "keyword_injection", "keyword": "微服务", "location": "experience[0].bullets[0]"},
    {"action": "quantify_result", "original": "提升了性能", "optimized": "将系统响应时间缩短40%"}
  ],
  "export_status": {
    "pdf_url": "https://oss.jobfit.com/resumes/xxx.pdf",
    "word_url": "https://oss.jobfit.com/resumes/xxx.docx"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 4.5 数据关系图

```
User
 ├── has_many → Profile (个人档案，版本化)
 ├── has_many → JD (保存的职位描述)
 ├── has_many → MatchResult (通过JD + Profile生成)
 └── has_many → GeneratedResume (通过MatchResult生成)

MatchResult
 ├── belongs_to → User
 ├── belongs_to → JD
 └── belongs_to → ProfileSnapshot

GeneratedResume
 ├── belongs_to → User
 ├── belongs_to → MatchResult
 └── belongs_to → JD
```

---

## 五、技术架构设计

### 5.1 技术栈建议

| 层次 | 技术选型 | 选型理由 |
|------|---------|---------|
| 前端框架 | React 18 / Next.js 14 | SSR支持SEO，生态成熟 |
| 移动端 | 微信小程序 + H5（Taro） | 覆盖国内主流移动场景 |
| 后端框架 | Python FastAPI | 高性能，AI生态友好 |
| 数据库 | MySQL 8.0 + Redis 7 | 关系型数据 + 高频缓存 |
| 文件存储 | 阿里云OSS | 国内稳定，价格合理 |
| 搜索引擎 | Elasticsearch 8 | JD语料全文检索 |
| AI服务 | GPT-4o / Claude 3.5 + 国内备用（文心/通义） | 主力AI能力 |
| 文档解析 | Apache Tika + PyMuPDF | PDF/Word解析 |
| 消息队列 | RocketMQ | 异步任务处理（AI生成等耗时任务） |
| 容器化 | Docker + Kubernetes | 弹性伸缩 |
| CI/CD | GitHub Actions | 自动化部署 |
