# JobFit 后端 API
# 技术栈: Python FastAPI + SQLAlchemy

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from enum import Enum

# 导入路由（使用相对导入）
from backend.api.routers import auth, jd, match, resume, profile, application

app = FastAPI(title="JobFit API", version="1.0.0")

# 注册路由
app.include_router(auth.router)
app.include_router(jd.router)
app.include_router(match.router)
app.include_router(resume.router)
app.include_router(profile.router)
app.include_router(application.router)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============== Pydantic Models ==============

class JobType(str, Enum):
    full_time = "full_time"
    part_time = "part_time"
    internship = "intern"


class Degree(str, Enum):
    associate = "associate"
    bachelor = "bachelor"
    master = "master"
    phd = "phd"
    other = "other"


class SkillLevel(str, Enum):
    familiar = "familiar"
    proficient = "proficient"
    expert = "expert"


# 用户注册/登录
class UserCreate(BaseModel):
    openid: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    id: int
    openid: Optional[str]
    phone: Optional[str]
    email: Optional[str]


# 基本信息
class BasicInfo(BaseModel):
    name: str
    gender: Optional[str] = None
    birth_year: Optional[int] = None
    location: Optional[str] = None
    target_locations: Optional[List[str]] = []
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None


# 求职意向
class JobIntention(BaseModel):
    target_positions: List[str] = []
    target_industries: List[str] = []
    salary_range_min: Optional[int] = None
    salary_range_max: Optional[int] = None
    job_type: Optional[JobType] = None
    available_date: Optional[date] = None


# 教育背景
class Education(BaseModel):
    school_name: str
    major: str
    degree: Degree
    gpa: Optional[str] = None
    start_date: date
    end_date: date
    honors: List[str] = []
    activities: Optional[str] = None


# 工作经历
class WorkExperience(BaseModel):
    company_name: str
    company_scale: Optional[str] = None
    industry: Optional[str] = None
    position: str
    department: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    responsibilities: List[str] = []
    achievements: List[str] = []
    tools_used: List[str] = []


# 项目经历
class Project(BaseModel):
    project_name: str
    role: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    team_size: Optional[int] = None
    description: Optional[str] = None
    tech_stack: List[str] = []
    achievements: Optional[str] = None
    project_url: Optional[str] = None


# 技能
class Skill(BaseModel):
    skill_type: str  # tech/soft/language/certification
    skill_name: str
    level: Optional[str] = None
    years: Optional[int] = None
    issuer: Optional[str] = None
    expire_date: Optional[date] = None


# 用户档案
class UserProfile(BaseModel):
    basic_info: BasicInfo
    job_intention: JobIntention
    educations: List[Education] = []
    work_experiences: List[WorkExperience] = []
    projects: List[Project] = []
    skills: List[Skill] = []
    self_introduction: Optional[str] = None


# JD 输入
class JDInput(BaseModel):
    input_type: str = "text"  # text/url/file
    content: str  # JD文本或链接
    platform: Optional[str] = None


# JD 解析结果
class JDResponse(BaseModel):
    id: int
    job_title: str
    company_name: Optional[str] = None
    location: Optional[str] = None
    salary_range_min: Optional[int] = None
    salary_range_max: Optional[int] = None
    required_skills: List[dict] = []
    top_keywords: List[dict] = []


# 匹配结果
class MatchResponse(BaseModel):
    id: int
    overall_score: int
    tech_skills_score: int
    experience_score: int
    education_score: int
    soft_skills_score: int
    keywords_score: int
    matched_items: List[dict] = []
    gap_items: List[dict] = []
    recommendation_level: str
    recommendation_label: str
    action_items: List[str] = []


# 简历生成请求
class ResumeGenerateRequest(BaseModel):
    jd_id: int
    template_id: Optional[str] = "default"
    generation_strategy: Optional[str] = "default"
    length_preference: Optional[str] = "standard"


# ============== API Routes ==============

@app.get("/")
async def root():
    return {"message": "JobFit API is running!", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# 用户相关
@app.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    """创建/注册用户"""
    # TODO: 实现用户创建逻辑
    return UserResponse(id=1, openid=user.openid, phone=user.phone, email=user.email)


@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    """获取用户信息"""
    # TODO: 实现获取用户逻辑
    raise HTTPException(status_code=404, detail="User not found")


# 用户档案
@app.post("/api/profiles/{user_id}")
async def create_profile(user_id: int, profile: UserProfile):
    """创建用户档案"""
    # TODO: 实现档案创建逻辑
    return {"message": "Profile created", "user_id": user_id}


@app.get("/api/profiles/{user_id}")
async def get_profile(user_id: int):
    """获取用户档案"""
    # TODO: 实现获取档案逻辑
    raise HTTPException(status_code=404, detail="Profile not found")


@app.put("/api/profiles/{user_id}")
async def update_profile(user_id: int, profile: UserProfile):
    """更新用户档案"""
    # TODO: 实现档案更新逻辑
    return {"message": "Profile updated", "user_id": user_id}


# JD 相关
@app.post("/api/jd/parse")
async def parse_jd(jd_input: JDInput):
    """解析JD"""
    # TODO: 调用 AI 服务解析 JD
    return {
        "id": 1,
        "job_title": "高级产品经理",
        "company_name": "字节跳动",
        "location": "北京",
        "salary_range_min": 30000,
        "salary_range_max": 50000,
        "required_skills": [
            {"name": "产品规划", "level": "proficient", "weight": 0.9},
            {"name": "用户研究", "level": "proficient", "weight": 0.85},
            {"name": "数据分析", "level": "familiar", "weight": 0.8}
        ],
        "top_keywords": [
            {"keyword": "产品规划", "importance": "critical"},
            {"keyword": "用户增长", "importance": "important"}
        ]
    }


@app.get("/api/jd/{jd_id}", response_model=JDResponse)
async def get_jd(jd_id: int):
    """获取JD详情"""
    # TODO: 实现获取 JD 逻辑
    raise HTTPException(status_code=404, detail="JD not found")


# 匹配相关
@app.post("/api/match")
async def calculate_match(user_id: int, jd_id: int):
    """计算匹配度"""
    # TODO: 调用匹配引擎计算
    return {
        "id": 1,
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
        "keywords_max": 10,
        "matched_items": [
            {"type": "tech_skill", "item": "Python", "match_level": "full"}
        ],
        "gap_items": [
            {"type": "tech_skill", "item": "Docker", "severity": "important", 
             "improvement_suggestion": "建议学习容器化技术"}
        ],
        "recommendation_level": "strong",
        "recommendation_label": "强烈推荐投递",
        "recommendation_reason": "你的核心技能高度匹配...",
        "action_items": ["补充Docker经验描述", "在技能栏添加CI/CD"]
    }


# 简历相关
@app.post("/api/resumes/generate")
async def generate_resume(user_id: int, request: ResumeGenerateRequest):
    """生成简历"""
    # TODO: 调用 AI 生成简历
    return {
        "id": 1,
        "message": "Resume generated successfully",
        "pdf_url": "/api/resumes/1/export?format=pdf",
        "word_url": "/api/resumes/1/export?format=word"
    }


@app.get("/api/resumes/{resume_id}")
async def get_resume(resume_id: int):
    """获取简历详情"""
    # TODO: 实现获取简历逻辑
    raise HTTPException(status_code=404, detail="Resume not found")


@app.get("/api/resumes/{resume_id}/export")
async def export_resume(resume_id: int, format: str = "pdf"):
    """导出简历"""
    # TODO: 实现导出逻辑
    return {"url": f"https://example.com/resumes/{resume_id}.{format}"}


# 投递管理
@app.get("/api/applications")
async def list_applications(user_id: int, status: Optional[str] = None):
    """获取投递列表"""
    # TODO: 实现获取投递列表逻辑
    return []


@app.put("/api/applications/{application_id}")
async def update_application(application_id: int, status: str):
    """更新投递状态"""
    # TODO: 实现更新投递状态逻辑
    return {"message": "Application updated", "id": application_id, "status": status}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)