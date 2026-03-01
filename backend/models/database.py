"""
数据库模型 - SQLAlchemy
"""

from sqlalchemy import create_engine, Column, BigInteger, Integer, String, Text, Date, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import os

Base = declarative_base()


class User(Base):
    """用户表"""
    __tablename__ = 'users'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    openid = Column(String(128), unique=True, nullable=True, comment='微信OpenID')
    phone = Column(String(20), nullable=True, comment='手机号')
    email = Column(String(255), nullable=True, comment='邮箱')
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    status = Column(Integer, default=1, comment='1:正常 0:禁用')
    
    # 关系
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    educations = relationship("Education", back_populates="user")
    work_experiences = relationship("WorkExperience", back_populates="user")
    projects = relationship("Project", back_populates="user")
    skills = relationship("Skill", back_populates="user")
    job_descriptions = relationship("JobDescription", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    applications = relationship("Application", back_populates="user")


class UserProfile(Base):
    """用户档案表"""
    __tablename__ = 'user_profiles'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'), unique=True)
    
    # 基本信息
    name = Column(String(50), comment='姓名')
    gender = Column(String(10), comment='性别')
    birth_year = Column(Integer, comment='出生年份')
    location = Column(String(50), comment='所在城市')
    target_locations = Column(JSON, comment='意向城市列表')
    linkedin_url = Column(String(255), comment='LinkedIn链接')
    github_url = Column(String(255), comment='GitHub链接')
    portfolio_url = Column(String(255), comment='作品集链接')
    
    # 求职意向
    target_positions = Column(JSON, comment='目标岗位列表')
    target_industries = Column(JSON, comment='目标行业')
    salary_range_min = Column(Integer, comment='期望薪资下限')
    salary_range_max = Column(Integer, comment='期望薪资上限')
    job_type = Column(String(20), comment='full_time/part_time/internship')
    available_date = Column(Date, comment='可到岗日期')
    
    # 自我介绍
    self_introduction = Column(Text, comment='自我介绍')
    
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    user = relationship("User", back_populates="profile")


class Education(Base):
    """教育背景表"""
    __tablename__ = 'educations'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'))
    
    school_name = Column(String(255), comment='学校名称')
    major = Column(String(255), comment='专业')
    degree = Column(String(20), comment='bachelor/master/phd/associate/other')
    gpa = Column(String(20), comment='GPA')
    start_date = Column(Date, comment='开始时间')
    end_date = Column(Date, comment='结束时间')
    honors = Column(JSON, comment='奖项列表')
    activities = Column(Text, comment='活动描述')
    
    created_at = Column(DateTime, default=datetime.now)
    
    user = relationship("User", back_populates="educations")


class WorkExperience(Base):
    """工作经历表"""
    __tablename__ = 'work_experiences'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'))
    
    company_name = Column(String(255), comment='公司名称')
    company_scale = Column(String(20), comment='startup/small/medium/large/enterprise')
    industry = Column(String(50), comment='行业')
    position = Column(String(255), comment='职位名称')
    department = Column(String(255), comment='部门')
    start_date = Column(Date, comment='开始时间')
    end_date = Column(Date, comment='结束时间')
    is_current = Column(Integer, default=0, comment='是否在职')
    responsibilities = Column(JSON, comment='职责列表')
    achievements = Column(JSON, comment='成果列表')
    tools_used = Column(JSON, comment='使用的工具/技术')
    
    created_at = Column(DateTime, default=datetime.now)
    
    user = relationship("User", back_populates="work_experiences")


class Project(Base):
    """项目经历表"""
    __tablename__ = 'projects'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'))
    
    project_name = Column(String(255), comment='项目名称')
    role = Column(String(255), comment='角色')
    start_date = Column(Date, comment='开始时间')
    end_date = Column(Date, comment='结束时间')
    team_size = Column(Integer, comment='团队人数')
    description = Column(Text, comment='项目描述')
    tech_stack = Column(JSON, comment='技术栈')
    achievements = Column(Text, comment='项目成果')
    project_url = Column(String(255), comment='项目链接')
    
    created_at = Column(DateTime, default=datetime.now)
    
    user = relationship("User", back_populates="projects")


class Skill(Base):
    """技能表"""
    __tablename__ = 'skills'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'))
    
    skill_type = Column(String(20), comment='tech/soft/language/certification')
    skill_name = Column(String(100), comment='技能名称')
    level = Column(String(20), comment='expert/proficient/familiar')
    years = Column(Integer, comment='年限')
    issuer = Column(String(255), comment='颁发机构')
    expire_date = Column(Date, comment='过期日期')
    
    created_at = Column(DateTime, default=datetime.now)
    
    user = relationship("User", back_populates="skills")


class JobDescription(Base):
    """JD表"""
    __tablename__ = 'job_descriptions'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'))
    
    # 来源信息
    input_type = Column(String(20), comment='text/url/file')
    original_url = Column(String(512), comment='原始链接')
    platform = Column(String(50), comment='boss/zhilian/lagou')
    
    # 基本信息
    job_title = Column(String(255), comment='职位名称')
    company_name = Column(String(255), comment='公司名称')
    company_industry = Column(String(50), comment='行业')
    location = Column(String(50), comment='工作地点')
    salary_range_min = Column(Integer, comment='薪资下限')
    salary_range_max = Column(Integer, comment='薪资上限')
    job_type = Column(String(20), comment='full_time/part_time/intern')
    
    # 解析字段
    required_skills = Column(JSON, comment='必需技能列表')
    soft_skills = Column(JSON, comment='软技能列表')
    min_experience_years = Column(Integer, comment='最低工作经验')
    education_requirement = Column(String(20), comment='学历要求')
    top_keywords = Column(JSON, comment='Top20关键词')
    hidden_requirements = Column(Text, comment='隐性要求')
    
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    user = relationship("User", back_populates="job_descriptions")
    match_results = relationship("MatchResult", back_populates="jd")
    resumes = relationship("Resume", back_populates="jd")


class MatchResult(Base):
    """匹配结果表"""
    __tablename__ = 'match_results'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'))
    jd_id = Column(BigInteger, ForeignKey('job_descriptions.id', ondelete='CASCADE'))
    
    overall_score = Column(Integer, comment='综合评分')
    tech_skills_score = Column(Integer)
    tech_skills_max = Column(Integer)
    experience_score = Column(Integer)
    experience_max = Column(Integer)
    education_score = Column(Integer)
    education_max = Column(Integer)
    soft_skills_score = Column(Integer)
    soft_skills_max = Column(Integer)
    keywords_score = Column(Integer)
    keywords_max = Column(Integer)
    
    matched_items = Column(JSON, comment='已匹配项')
    gap_items = Column(JSON, comment='缺口项')
    
    recommendation_level = Column(String(20), comment='strong/conditional/not_recommended')
    recommendation_label = Column(String(50), comment='建议标签')
    recommendation_reason = Column(Text, comment='建议原因')
    action_items = Column(JSON, comment='行动建议')
    
    created_at = Column(DateTime, default=datetime.now)
    
    jd = relationship("JobDescription", back_populates="match_results")
    resumes = relationship("Resume", back_populates="match_result")


class Resume(Base):
    """简历表"""
    __tablename__ = 'resumes'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'))
    match_id = Column(BigInteger, ForeignKey('match_results.id', ondelete='SET NULL'), nullable=True)
    jd_id = Column(BigInteger, ForeignKey('job_descriptions.id', ondelete='SET NULL'), nullable=True)
    
    version = Column(Integer, default=1, comment='版本号')
    template_id = Column(String(50), comment='模板ID')
    
    # 简历内容
    header = Column(JSON, comment='头部信息')
    summary = Column(Text, comment='个人简介')
    experience = Column(JSON, comment='工作经历')
    education = Column(JSON, comment='教育背景')
    projects = Column(JSON, comment='项目经历')
    skills = Column(JSON, comment='技能')
    
    # ATS优化日志
    optimization_log = Column(JSON, comment='优化日志')
    
    # 导出
    pdf_url = Column(String(512), comment='PDF链接')
    word_url = Column(String(512), comment='Word链接')
    
    # 元数据
    generation_strategy = Column(String(50), default='default')
    length_preference = Column(String(20), default='standard')
    status = Column(String(20), default='draft')
    
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    user = relationship("User", back_populates="resumes")
    match_result = relationship("MatchResult", back_populates="resumes")
    jd = relationship("JobDescription", back_populates="resumes")


class Application(Base):
    """投递记录表"""
    __tablename__ = 'applications'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'))
    resume_id = Column(BigInteger, ForeignKey('resumes.id', ondelete='SET NULL'), nullable=True)
    jd_id = Column(BigInteger, ForeignKey('job_descriptions.id', ondelete='SET NULL'), nullable=True)
    
    company_name = Column(String(255))
    job_title = Column(String(255))
    match_score = Column(Integer)
    status = Column(String(20), default='pending')
    
    # 时间轴
    generated_at = Column(DateTime)
    sent_at = Column(DateTime)
    screening_passed_at = Column(DateTime)
    interview_at = Column(DateTime)
    offer_at = Column(DateTime)
    rejected_at = Column(DateTime)
    
    notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    user = relationship("User", back_populates="applications")


# 数据库连接
def get_engine(database_url: str = None):
    """获取数据库引擎"""
    if database_url is None:
        database_url = os.getenv(
            "DATABASE_URL", 
            "mysql+pymysql://root:password@localhost:3306/jobfit"
        )
    return create_engine(database_url, pool_pre_ping=True)


def get_session(engine=None):
    """获取数据库会话"""
    if engine is None:
        engine = get_engine()
    Session = sessionmaker(bind=engine)
    return Session()


def init_db(database_url: str = None):
    """初始化数据库"""
    engine = get_engine(database_url)
    Base.metadata.create_all(engine)
    return engine