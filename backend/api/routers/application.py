"""
投递管理路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/api/applications", tags=["投递管理"])

# 模拟数据存储
applications_storage = {}


class ApplicationCreate(BaseModel):
    jd_id: int
    resume_id: int
    company_name: str
    job_title: str
    match_score: int


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


@router.get("/")
async def list_applications(user_id: int = 1, status: Optional[str] = None):
    """获取投递列表"""
    # 返回模拟数据
    apps = [
        {
            "id": 1,
            "company": "字节跳动",
            "position": "高级Python开发工程师",
            "match_score": 85,
            "status": "interview",
            "resume_version": "v1.2",
            "sent_date": "2026-03-01",
            "last_update": "2026-03-02"
        },
        {
            "id": 2,
            "company": "阿里云",
            "position": "后端开发工程师",
            "match_score": 72,
            "status": "screening",
            "resume_version": "v1.0",
            "sent_date": "2026-03-01",
            "last_update": "2026-03-02"
        },
        {
            "id": 3,
            "company": "腾讯",
            "position": "全栈工程师",
            "match_score": 68,
            "status": "pending",
            "resume_version": "v1.1",
            "sent_date": "2026-02-28",
            "last_update": "2026-02-28"
        },
    ]
    
    if status:
        apps = [a for a in apps if a["status"] == status]
    
    return apps


@router.post("/")
async def create_application(user_id: int, app: ApplicationCreate):
    """创建投递记录"""
    import time
    app_id = int(time.time())
    
    new_app = {
        "id": app_id,
        "jd_id": app.jd_id,
        "resume_id": app.resume_id,
        "company": app.company_name,
        "position": app.job_title,
        "match_score": app.match_score,
        "status": "pending",
        "sent_date": datetime.now().strftime("%Y-%m-%d"),
        "last_update": datetime.now().strftime("%Y-%m-%d")
    }
    
    applications_storage[app_id] = new_app
    
    return new_app


@router.get("/{app_id}")
async def get_application(app_id: int):
    """获取投递详情"""
    if app_id not in applications_storage:
        raise HTTPException(status_code=404, detail="投递记录不存在")
    return applications_storage[app_id]


@router.put("/{app_id}")
async def update_application(app_id: int, update: ApplicationUpdate):
    """更新投递状态"""
    if app_id not in applications_storage:
        raise HTTPException(status_code=404, detail="投递记录不存在")
    
    app = applications_storage[app_id]
    
    if update.status:
        app["status"] = update.status
    if update.notes:
        app["notes"] = update.notes
    
    app["last_update"] = datetime.now().strftime("%Y-%m-%d")
    
    return app


@router.get("/stats/summary")
async def get_stats_summary(user_id: int = 1):
    """获取投递统计"""
    return {
        "total": 12,
        "pending": 3,
        "screening": 5,
        "interview": 2,
        "offer": 1,
        "rejected": 1,
        "avg_match_score": 72,
        "interview_rate": 25
    }