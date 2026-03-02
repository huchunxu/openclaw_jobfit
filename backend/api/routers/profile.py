"""
用户档案路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api/profiles", tags=["用户档案"])


# Request Models
class BasicInfo(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    birth_year: Optional[int] = None
    location: Optional[str] = None
    target_locations: Optional[List[str]] = []
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None


class JobIntention(BaseModel):
    target_positions: Optional[List[str]] = []
    target_industries: Optional[List[str]] = []
    salary_range_min: Optional[int] = None
    salary_range_max: Optional[int] = None
    job_type: Optional[str] = None
    available_date: Optional[str] = None


class Education(BaseModel):
    school_name: str
    major: str
    degree: str
    gpa: Optional[str] = None
    start_date: str
    end_date: str


class WorkExperience(BaseModel):
    company_name: str
    company_scale: Optional[str] = None
    industry: Optional[str] = None
    position: str
    department: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    responsibilities: List[str] = []
    achievements: List[str] = []
    tools_used: List[str] = []


class Project(BaseModel):
    project_name: str
    role: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    team_size: Optional[int] = None
    description: Optional[str] = None
    tech_stack: List[str] = []
    achievements: Optional[str] = None
    project_url: Optional[str] = None


class Skill(BaseModel):
    skill_type: str
    skill_name: str
    level: Optional[str] = None
    years: Optional[int] = None
    issuer: Optional[str] = None


class ProfileCreate(BaseModel):
    basic_info: Optional[BasicInfo] = None
    job_intention: Optional[JobIntention] = None
    educations: List[Education] = []
    work_experiences: List[WorkExperience] = []
    projects: List[Project] = []
    skills: List[Skill] = []
    self_introduction: Optional[str] = None


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    basic_info: dict = {}
    job_intention: dict = {}
    educations: List[dict] = []
    work_experiences: List[dict] = []
    projects: List[dict] = []
    skills: List[dict] = []
    self_introduction: str = ""


# 模拟数据存储
profile_storage = {1: {
    "id": 1,
    "user_id": 1,
    "basic_info": {
        "name": "张三",
        "gender": "男",
        "birth_year": 1995,
        "location": "北京",
        "github_url": "https://github.com/zhangsan"
    },
    "job_intention": {
        "target_positions": ["Python开发工程师"],
        "target_industries": ["互联网"],
        "salary_range_min": 30000,
        "salary_range_max": 50000,
        "job_type": "full_time"
    },
    "educations": [
        {"school_name": "清华大学", "major": "计算机科学", "degree": "bachelor", "gpa": "3.8", "start_date": "2013-09", "end_date": "2017-06"}
    ],
    "work_experiences": [
        {"company_name": "字节跳动", "position": "高级后端开发工程师", "start_date": "2021-03", "end_date": "至今", "achievements": ["QPS提升50%"]}
    ],
    "projects": [
        {"project_name": "电商平台", "tech_stack": ["Python", "Django"]}
    ],
    "skills": [
        {"skill_name": "Python", "level": "expert", "skill_type": "tech"},
        {"skill_name": "Django", "level": "proficient", "skill_type": "tech"}
    ],
    "self_introduction": "5年后端开发经验"
}}


@router.post("/{user_id}", response_model=ProfileResponse)
async def create_profile(user_id: int, profile: ProfileCreate):
    """
    创建用户档案
    """
    import time
    profile_id = int(time.time())
    
    new_profile = {
        "id": profile_id,
        "user_id": user_id,
        "basic_info": profile.basic_info.dict() if profile.basic_info else {},
        "job_intention": profile.job_intention.dict() if profile.job_intention else {},
        "educations": [e.dict() for e in profile.educations],
        "work_experiences": [w.dict() for w in profile.work_experiences],
        "projects": [p.dict() for p in profile.projects],
        "skills": [s.dict() for s in profile.skills],
        "self_introduction": profile.self_introduction or ""
    }
    
    profile_storage[user_id] = new_profile
    
    return ProfileResponse(**new_profile)


@router.get("/{user_id}", response_model=ProfileResponse)
async def get_profile(user_id: int):
    """
    获取用户档案
    """
    if user_id not in profile_storage:
        raise HTTPException(status_code=404, detail="档案不存在")
    
    return ProfileResponse(**profile_storage[user_id])


@router.put("/{user_id}", response_model=ProfileResponse)
async def update_profile(user_id: int, profile: ProfileCreate):
    """
    更新用户档案
    """
    if user_id in profile_storage:
        existing = profile_storage[user_id]
    else:
        existing = {"id": user_id, "user_id": user_id}
    
    # 合并更新
    if profile.basic_info:
        existing["basic_info"] = {**existing.get("basic_info", {}), **profile.basic_info.dict(exclude_unset=True)}
    if profile.job_intention:
        existing["job_intention"] = {**existing.get("job_intention", {}), **profile.job_intention.dict(exclude_unset=True)}
    if profile.educations:
        existing["educations"] = [e.dict() for e in profile.educations]
    if profile.work_experiences:
        existing["work_experiences"] = [w.dict() for w in profile.work_experiences]
    if profile.projects:
        existing["projects"] = [p.dict() for p in profile.projects]
    if profile.skills:
        existing["skills"] = [s.dict() for s in profile.skills]
    if profile.self_introduction:
        existing["self_introduction"] = profile.self_introduction
    
    profile_storage[user_id] = existing
    
    return ProfileResponse(**existing)


@router.delete("/{user_id}")
async def delete_profile(user_id: int):
    """
    删除用户档案
    """
    if user_id in profile_storage:
        del profile_storage[user_id]
    
    return {"message": "档案已删除"}


@router.get("/{user_id}/completion")
async def get_profile_completion(user_id: int):
    """
    获取档案完善度
    """
    if user_id not in profile_storage:
        return {"completion": 0, "missing": ["basic_info", "education", "work_experience", "skills"]}
    
    profile = profile_storage[user_id]
    completion = 0
    missing = []
    
    # 检查各项
    if profile.get("basic_info", {}).get("name"):
        completion += 25
    else:
        missing.append("基本信息")
    
    if profile.get("job_intention", {}).get("target_positions"):
        completion += 15
    else:
        missing.append("求职意向")
    
    if profile.get("educations"):
        completion += 20
    else:
        missing.append("教育背景")
    
    if profile.get("work_experiences"):
        completion += 25
    else:
        missing.append("工作经历")
    
    if profile.get("skills"):
        completion += 15
    else:
        missing.append("技能")
    
    return {"completion": completion, "missing": missing}