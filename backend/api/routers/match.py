"""
匹配路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api/match", tags=["匹配"])


# Request Models
class MatchRequest(BaseModel):
    user_id: int
    jd_id: int


# Response Models
class MatchResponse(BaseModel):
    id: int
    overall_score: int
    tech_skills_score: int
    tech_skills_max: int
    experience_score: int
    experience_max: int
    education_score: int
    education_max: int
    soft_skills_score: int
    soft_skills_max: int
    keywords_score: int
    keywords_max: int
    matched_items: List[dict]
    gap_items: List[dict]
    recommendation_level: str
    recommendation_label: str
    recommendation_reason: str
    action_items: List[str]


# 模拟数据存储
match_storage = {}


@router.post("/", response_model=MatchResponse)
async def calculate_match(request: MatchRequest):
    """
    计算人岗匹配度
    """
    from backend.services.match_service import MatchEngine
    
    # 模拟用户档案（实际应从数据库查询）
    user_profile = {
        "basic_info": {"name": "张三", "location": "北京"},
        "skills": [
            {"name": "Python", "level": "expert"},
            {"name": "Django", "level": "proficient"},
            {"name": "MySQL", "level": "proficient"},
            {"name": "团队协作", "level": "expert"}
        ],
        "work_experiences": [
            {
                "start_date": __import__("datetime").datetime(2021, 3, 1),
                "end_date": __import__("datetime").datetime.now(),
                "achievements": ["负责用户增长系统", "QPS提升50%"]
            }
        ],
        "educations": [
            {"degree": "bachelor", "school_name": "清华大学"}
        ],
        "projects": []
    }
    
    # 模拟JD数据（实际应从数据库查询）
    jd_data = {
        "job_title": "高级Python开发工程师",
        "required_skills": [
            {"name": "Python", "level": "expert", "weight": 0.95},
            {"name": "Django", "level": "proficient", "weight": 0.9},
            {"name": "MySQL", "level": "proficient", "weight": 0.85},
            {"name": "Docker", "level": "familiar", "weight": 0.75},
            {"name": "Redis", "level": "familiar", "weight": 0.7}
        ],
        "soft_skills": [
            {"name": "团队协作", "importance": "high"},
            {"name": "沟通能力", "importance": "medium"}
        ],
        "min_experience_years": 3,
        "education_requirement": "bachelor",
        "top_keywords": [
            {"keyword": "Python", "importance": "critical"},
            {"keyword": "后端开发", "importance": "critical"},
            {"keyword": "3年+经验", "importance": "important"},
            {"keyword": "微服务", "importance": "nice_to_have"}
        ]
    }
    
    # 计算匹配度
    engine = MatchEngine()
    result = engine.calculate_match(user_profile, jd_data)
    
    # 生成ID并存储
    import time
    match_id = int(time.time())
    result["id"] = match_id
    match_storage[match_id] = result
    
    return MatchResponse(**result)


@router.get("/{match_id}", response_model=MatchResponse)
async def get_match_result(match_id: int):
    """
    获取匹配结果
    """
    if match_id not in match_storage:
        raise HTTPException(status_code=404, detail="匹配结果不存在")
    
    return MatchResponse(**match_storage[match_id])


@router.get("/")
async def list_matches(user_id: int = 1):
    """
    获取用户的匹配列表
    """
    return [
        {
            "id": 1,
            "jd_title": "高级Python开发工程师",
            "company": "字节跳动",
            "overall_score": 85,
            "recommendation_level": "strong",
            "created_at": "2026-03-01"
        },
        {
            "id": 2,
            "jd_title": "后端开发工程师",
            "company": "阿里云",
            "overall_score": 72,
            "recommendation_level": "conditional",
            "created_at": "2026-03-01"
        }
    ]