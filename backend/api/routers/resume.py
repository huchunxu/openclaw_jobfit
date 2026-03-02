"""
简历路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/resumes", tags=["简历"])


# Request Models
class GenerateResumeRequest(BaseModel):
    jd_id: int
    template_id: str = "default"
    generation_strategy: str = "default"
    length_preference: str = "standard"


# Response Models
class ResumeResponse(BaseModel):
    id: int
    jd_title: str
    template_id: str
    status: str = "draft"
    created_at: str


# 模拟数据存储
resume_storage = {}


@router.post("/generate", response_model=ResumeResponse)
async def generate_resume(user_id: int, request: GenerateResumeRequest):
    """
    生成简历
    """
    from .services.resume_service import ResumeGenerator
    
    # 模拟用户档案（实际应从数据库查询）
    user_profile = {
        "basic_info": {"name": "张三", "gender": "男", "birth_year": 1995, "location": "北京"},
        "phone": "138****8888",
        "email": "zhangsan@example.com",
        "job_intention": {"target_positions": ["高级Python开发工程师"]},
        "skills": [
            {"name": "Python", "level": "expert", "years": 5},
            {"name": "Django", "level": "proficient", "years": 4},
            {"name": "MySQL", "level": "proficient", "years": 5}
        ],
        "work_experiences": [
            {
                "company_name": "字节跳动",
                "position": "高级后端开发工程师",
                "start_date": __import__("datetime").datetime(2021, 3, 1),
                "end_date": None,
                "is_current": True,
                "responsibilities": ["负责用户增长系统后端开发", "负责微服务架构设计"],
                "achievements": ["QPS提升50%", "系统可用性99.9%"],
                "tools_used": ["Python", "Django", "MySQL", "Redis"]
            }
        ],
        "projects": [
            {
                "project_name": "电商平台后端重构",
                "role": "技术负责人",
                "tech_stack": ["Python", "Django", "MySQL", "Redis"]
            }
        ],
        "educations": [
            {
                "school_name": "清华大学",
                "major": "计算机科学与技术",
                "degree": "bachelor",
                "start_date": __import__("datetime").datetime(2013, 9, 1),
                "end_date": __import__("datetime").datetime(2017, 6, 1)
            }
        ]
    }
    
    # 模拟JD数据
    jd_data = {
        "job_title": "高级Python开发工程师",
        "required_skills": [
            {"name": "Python", "level": "expert", "weight": 0.95},
            {"name": "Django", "level": "proficient", "weight": 0.9}
        ],
        "top_keywords": [
            {"keyword": "Python", "importance": "critical"},
            {"keyword": "后端开发", "importance": "critical"}
        ]
    }
    
    # 生成简历
    generator = ResumeGenerator()
    result = generator.generate(
        user_profile=user_profile,
        jd_data=jd_data,
        template_id=request.template_id,
        generation_strategy=request.generation_strategy,
        length_preference=request.length_preference
    )
    
    # 生成ID并存储
    import time
    resume_id = int(time.time())
    resume_storage[resume_id] = {
        "id": resume_id,
        "jd_title": jd_data["job_title"],
        "template_id": request.template_id,
        "status": "generated",
        "data": result
    }
    
    return ResumeResponse(
        id=resume_id,
        jd_title=jd_data["job_title"],
        template_id=request.template_id,
        created_at=__import__("datetime").datetime.now().isoformat()
    )


@router.get("/{resume_id}")
async def get_resume(resume_id: int):
    """
    获取简历详情
    """
    if resume_id not in resume_storage:
        raise HTTPException(status_code=404, detail="简历不存在")
    
    return resume_storage[resume_id]


@router.get("/{resume_id}/export")
async def export_resume(resume_id: int, format: str = "pdf"):
    """
    导出简历
    """
    if resume_id not in resume_storage:
        raise HTTPException(status_code=404, detail="简历不存在")
    
    # 模拟导出
    return {
        "url": f"https://jobfit.example.com/resumes/{resume_id}.{format}",
        "format": format
    }


@router.get("/")
async def list_resumes(user_id: int = 1):
    """
    获取简历列表
    """
    return [
        {
            "id": 1,
            "jd_title": "高级Python开发工程师",
            "template_id": "default",
            "version": "v1.2",
            "created_at": "2026-03-01"
        },
        {
            "id": 2,
            "jd_title": "后端开发工程师",
            "template_id": "modern",
            "version": "v1.0",
            "created_at": "2026-02-28"
        }
    ]