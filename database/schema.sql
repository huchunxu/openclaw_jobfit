-- JobFit 数据库表结构
-- 按 PRD 第8章数据模型设计

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    openid VARCHAR(128) UNIQUE COMMENT '微信OpenID',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(255) COMMENT '邮箱',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status TINYINT DEFAULT 1 COMMENT '1:正常 0:禁用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户档案表
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    
    -- 基本信息
    name VARCHAR(50) COMMENT '姓名',
    gender VARCHAR(10) COMMENT '性别',
    birth_year INT COMMENT '出生年份',
    location VARCHAR(50) COMMENT '所在城市',
    target_locations JSON COMMENT '意向城市列表',
    linkedin_url VARCHAR(255) COMMENT 'LinkedIn链接',
    github_url VARCHAR(255) COMMENT 'GitHub链接',
    portfolio_url VARCHAR(255) COMMENT '作品集链接',
    
    -- 求职意向
    target_positions JSON COMMENT '目标岗位列表',
    target_industries JSON COMMENT '目标行业',
    salary_range_min INT COMMENT '期望薪资下限',
    salary_range_max INT COMMENT '期望薪资上限',
    job_type VARCHAR(20) COMMENT 'full_time/part_time/internship',
    available_date DATE COMMENT '可到岗日期',
    
    -- 自我介绍
    self_introduction TEXT COMMENT '自我介绍',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 教育背景表
CREATE TABLE IF NOT EXISTS educations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    school_name VARCHAR(255) COMMENT '学校名称',
    major VARCHAR(255) COMMENT '专业',
    degree VARCHAR(20) COMMENT 'bachelor/master/phd/associate/other',
    gpa VARCHAR(20) COMMENT 'GPA',
    start_date DATE COMMENT '开始时间',
    end_date DATE COMMENT '结束时间',
    honors JSON COMMENT '奖项列表',
    activities TEXT COMMENT '活动描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 工作经历表
CREATE TABLE IF NOT EXISTS work_experiences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(255) COMMENT '公司名称',
    company_scale VARCHAR(20) COMMENT 'startup/small/medium/large/enterprise',
    industry VARCHAR(50) COMMENT '行业',
    position VARCHAR(255) COMMENT '职位名称',
    department VARCHAR(255) COMMENT '部门',
    start_date DATE COMMENT '开始时间',
    end_date DATE COMMENT '结束时间',
    is_current TINYINT DEFAULT 0 COMMENT '是否在职',
    responsibilities JSON COMMENT '职责列表',
    achievements JSON COMMENT '成果列表（含数据）',
    tools_used JSON COMMENT '使用的工具/技术',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 项目经历表
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    project_name VARCHAR(255) COMMENT '项目名称',
    role VARCHAR(255) COMMENT '角色',
    start_date DATE COMMENT '开始时间',
    end_date DATE COMMENT '结束时间',
    team_size INT COMMENT '团队人数',
    description TEXT COMMENT '项目描述',
    tech_stack JSON COMMENT '技术栈',
    achievements TEXT COMMENT '项目成果',
    project_url VARCHAR(255) COMMENT '项目链接',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 技能表
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    skill_type VARCHAR(20) COMMENT 'tech/soft/language/certification',
    skill_name VARCHAR(100) COMMENT '技能名称',
    level VARCHAR(20) COMMENT 'expert/proficient/familiar/native/fluent/business/basic',
    years INT COMMENT '年限',
    issuer VARCHAR(255) COMMENT '颁发机构',
    expire_date DATE COMMENT '过期日期',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- JD表
CREATE TABLE IF NOT EXISTS job_descriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    
    -- 来源信息
    input_type VARCHAR(20) COMMENT 'text/url/file',
    original_url VARCHAR(512) COMMENT '原始链接',
    platform VARCHAR(50) COMMENT 'boss/zhilian/lagou/linkedin/other',
    
    -- 基本信息
    job_title VARCHAR(255) COMMENT '职位名称',
    company_name VARCHAR(255) COMMENT '公司名称',
    company_industry VARCHAR(50) COMMENT '行业',
    location VARCHAR(50) COMMENT '工作地点',
    salary_range_min INT COMMENT '薪资下限',
    salary_range_max INT COMMENT '薪资上限',
    job_type VARCHAR(20) COMMENT 'full_time/part_time/intern',
    
    -- 解析字段
    required_skills JSON COMMENT '必需技能列表',
    soft_skills JSON COMMENT '软技能列表',
    min_experience_years INT COMMENT '最低工作经验',
    education_requirement VARCHAR(20) COMMENT '学历要求',
    top_keywords JSON COMMENT 'Top20关键词',
    hidden_requirements TEXT COMMENT '隐性要求',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 匹配结果表
CREATE TABLE IF NOT EXISTS match_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    jd_id BIGINT NOT NULL,
    
    overall_score INT COMMENT '综合评分',
    tech_skills_score INT COMMENT '技术技能评分',
    tech_skills_max INT COMMENT '技术技能满分',
    experience_score INT COMMENT '工作经验评分',
    experience_max INT COMMENT '工作经验满分',
    education_score INT COMMENT '教育背景评分',
    education_max INT COMMENT '教育背景满分',
    soft_skills_score INT COMMENT '软技能评分',
    soft_skills_max INT COMMENT '软技能满分',
    keywords_score INT COMMENT '关键词评分',
    keywords_max INT COMMENT '关键词满分',
    
    matched_items JSON COMMENT '已匹配项',
    gap_items JSON COMMENT '缺口项',
    
    recommendation_level VARCHAR(20) COMMENT 'strong/conditional/not_recommended',
    recommendation_label VARCHAR(50) COMMENT '强烈推荐/优化后再投递/暂不建议',
    recommendation_reason TEXT COMMENT '建议原因',
    action_items JSON COMMENT '行动建议',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (jd_id) REFERENCES job_descriptions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 简历表
CREATE TABLE IF NOT EXISTS resumes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    match_id BIGINT,
    jd_id BIGINT,
    
    version INT DEFAULT 1 COMMENT '版本号',
    template_id VARCHAR(50) COMMENT '模板ID',
    
    -- 简历内容(JSON)
    header JSON COMMENT '头部信息',
    summary TEXT COMMENT '个人简介',
    experience JSON COMMENT '工作经历',
    education JSON COMMENT '教育背景',
    projects JSON COMMENT '项目经历',
    skills JSON COMMENT '技能',
    
    -- ATS优化日志
    optimization_log JSON COMMENT '优化日志',
    
    -- 导出
    pdf_url VARCHAR(512) COMMENT 'PDF链接',
    word_url VARCHAR(512) COMMENT 'Word链接',
    
    -- 元数据
    generation_strategy VARCHAR(50) DEFAULT 'default' COMMENT '生成策略',
    length_preference VARCHAR(20) DEFAULT 'standard' COMMENT '简历长度',
    status VARCHAR(20) DEFAULT 'draft' COMMENT 'draft/published',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES match_results(id) ON DELETE SET NULL,
    FOREIGN KEY (jd_id) REFERENCES job_descriptions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 投递记录表
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    resume_id BIGINT,
    jd_id BIGINT,
    
    company_name VARCHAR(255) COMMENT '公司名称',
    job_title VARCHAR(255) COMMENT '职位名称',
    match_score INT COMMENT '匹配分数',
    status VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/sent/screening/interview/offer/rejected/abandoned',
    
    -- 时间轴
    generated_at DATETIME COMMENT '简历生成时间',
    sent_at DATETIME COMMENT '投递时间',
    screening_passed_at DATETIME COMMENT '筛选通过时间',
    interview_at DATETIME COMMENT '面试时间',
    offer_at DATETIME COMMENT 'offer时间',
    rejected_at DATETIME COMMENT '被拒时间',
    
    -- 备注
    notes TEXT COMMENT '备注',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL,
    FOREIGN KEY (jd_id) REFERENCES job_descriptions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 对话记录表
CREATE TABLE IF NOT EXISTS conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    module VARCHAR(50) COMMENT '模块名称',
    messages JSON COMMENT '对话消息列表',
    status VARCHAR(20) DEFAULT 'active' COMMENT 'active/completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 索引优化
CREATE INDEX idx_users_openid ON users(openid);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_work_experiences_user_id ON work_experiences(user_id);
CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX idx_match_results_user_id ON match_results(user_id);
CREATE INDEX idx_match_results_jd_id ON match_results(jd_id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);