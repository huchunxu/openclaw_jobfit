"""
JD路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api/jd", tags=["JD管理"])


# Request Models
class JDInput(BaseModel):
    input_type: str = "text"  # text/url/file
    content: str
    platform: Optional[str] = None


# Response Models
class SkillItem(BaseModel):
    name: str
    level: str
    weight: float


class KeywordItem(BaseModel):
    keyword: str
    importance: str


class JDResponse(BaseModel):
    id: int
    job_title: str
    company_name: Optional[str] = None
    location: Optional[str] = None
    salary_range_min: Optional[int] = None
    salary_range_max: Optional[int] = None
    job_type: str = "full_time"
    required_skills: List[SkillItem] = []
    soft_skills: List[dict] = []
    min_experience_years: int = 0
    education_requirement: str = "any"
    top_keywords: List[KeywordItem] = []
    hidden_requirements: str = ""


# 模拟数据存储
jd_storage = {}


@router.post("/parse", response_model=JDResponse)
async def parse_jd(jd_input: JDInput):
    """
    解析JD文本
    """
    from .services.jd_service import JDParser
    
    parser = JDParser()
    
    # 根据输入类型调用不同的解析方法
    if jd_input.input_type == "text":
        result = parser.parse(jd_input.content, jd_input.platform)
    elif jd_input.input_type == "url":
        from .services.jd_service import parse_jd_from_url
        jd_text = parse_jd_from_url(jd_input.content)
        result = parser.parse(jd_text, jd_input.platform)
    elif jd_input.input_type == "file":
        from .services.jd_service import parse_jd_from_file
        jd_text = parse_jd_from_file(jd_input.content, "txt")
        result = parser.parse(jd_text, jd_input.platform)
    else:
        raise HTTPException(status_code=400, detail="不支持的输入类型")
    
    # 生成ID并存储
    import time
    jd_id = int(time.time())
    result["id"] = jd_id
    jd_storage[jd_id] = result
    
    return JDResponse(**result)


@router.get("/{jd_id}", response_model=JDResponse)
async def get_jd(jd_id: int):
    """
    获取JD详情
    """
    if jd_id not in jd_storage:
        raise HTTPException(status_code=404, detail="JD不存在")
    
    return JDResponse(**jd_storage[jd_id])


@router.get("/")
async def list_jds(user_id: int = 1):
    """
    获取用户的JD列表
    """
    return [
        {"id": 1, "job_title": "高级Python开发工程师", "company_name": "字节跳动", "created_at": "2026-03-01"},
        {"id": 2, "job_title": "后端开发工程师", "company_name": "阿里云", "created_at": "2026-03-01"}
    ]


@router.delete("/{jd_id}")
async def delete_jd(jd_id: int):
    """
    删除JD
    """
    if jd_id in jd_storage:
        del jd_storage[jd_id]
    
    return {"message": "删除成功"}