#!/usr/bin/env python3
"""
数据库初始化脚本
自动创建所有表并插入示例数据
"""

import os
import sys

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from backend.models.database import Base, User, UserProfile, Education, WorkExperience, Project, Skill, JobDescription, MatchResult, Resume, Application, Conversation
from datetime import datetime, timedelta
import json


# 数据库连接配置
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./jobfit.db")


def create_tables():
    """创建所有表"""
    print("📦 创建数据库表...")
    
    engine = create_engine(DATABASE_URL, echo=True)
    Base.metadata.create_all(bind=engine)
    
    print("✅ 表创建完成！")
    return engine


def insert_sample_data(engine):
    """插入示例数据"""
    print("📝 插入示例数据...")
    
    with engine.connect() as conn:
        # 插入示例用户
        conn.execute(text("""
            INSERT OR IGNORE INTO users (id, phone, email, created_at, updated_at, status)
            VALUES (1, '13800138000', 'zhangsan@example.com', datetime('now'), datetime('now'), 1)
        """))
        
        # 插入示例档案
        conn.execute(text("""
            INSERT OR IGNORE INTO user_profiles 
            (id, user_id, name, gender, birth_year, location, target_positions, self_introduction, created_at, updated_at)
            VALUES 
            (1, 1, '张三', '男', 1995, '北京', '["Python开发工程师"]', '5年后端开发经验', datetime('now'), datetime('now'))
        """))
        
        # 插入教育经历
        conn.execute(text("""
            INSERT OR IGNORE INTO educations
            (id, user_id, school_name, major, degree, gpa, start_date, end_date, created_at)
            VALUES
            (1, 1, '清华大学', '计算机科学与技术', 'bachelor', '3.8', '2013-09-01', '2017-06-01', datetime('now'))
        """))
        
        # 插入工作经历
        conn.execute(text("""
            INSERT OR IGNORE INTO work_experiences
            (id, user_id, company_name, company_scale, industry, position, start_date, is_current, achievements, created_at)
            VALUES
            (1, 1, '字节跳动', 'large', '互联网', '高级后端开发工程师', '2021-03-01', 1, '["负责用户增长系统", "QPS提升50%"]', datetime('now'))
        """))
        
        # 插入技能
        conn.execute(text("""
            INSERT OR IGNORE INTO skills
            (id, user_id, skill_type, skill_name, level, years, created_at)
            VALUES
            (1, 1, 'tech', 'Python', 'expert', 5, datetime('now')),
            (2, 1, 'tech', 'Django', 'proficient', 4, datetime('now')),
            (3, 1, 'tech', 'MySQL', 'proficient', 5, datetime('now')),
            (4, 1, 'tech', 'Redis', 'familiar', 3, datetime('now')),
            (5, 1, 'tech', 'Docker', 'familiar', 2, datetime('now')),
            (6, 1, 'soft', '团队协作', 'expert', 5, datetime('now')),
            (7, 1, 'soft', '沟通能力', 'proficient', 5, datetime('now'))
        """))
        
        # 插入JD
        conn.execute(text("""
            INSERT OR IGNORE INTO job_descriptions
            (id, user_id, input_type, job_title, company_name, location, salary_range_min, salary_range_max,
             required_skills, top_keywords, min_experience_years, education_requirement, created_at, updated_at)
            VALUES
            (1, 1, 'text', '高级Python开发工程师', '字节跳动', '北京', 25000, 45000,
             '[{"name":"Python","level":"expert","weight":0.95},{"name":"Django","level":"proficient","weight":0.9}]',
             '[{"keyword":"Python","importance":"critical"},{"keyword":"后端开发","importance":"critical"}]',
             3, 'bachelor', datetime('now'), datetime('now'))
        """))
        
        conn.commit()
    
    print("✅ 示例数据插入完成！")


def init_database():
    """初始化数据库"""
    print("=" * 50)
    print("🔧 JobFit 数据库初始化")
    print("=" * 50)
    
    # 创建表
    engine = create_tables()
    
    # 插入示例数据
    insert_sample_data(engine)
    
    print("=" * 50)
    print("🎉 数据库初始化完成！")
    print("=" * 50)
    print(f"数据库文件: {DATABASE_URL.split(':///')[-1]}")
    print("=" * 50)


if __name__ == "__main__":
    init_database()