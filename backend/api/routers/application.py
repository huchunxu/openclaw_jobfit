"""
投递管理路由
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/api/applications", tags=["投递管理"])


# Request Models
class ApplicationCreate(BaseModel):
    jd_id: int
    resume_id: int
    company_name: str
    job_title: str
    match_score: int = 0
    notes: Optional[str] = None


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    screening_passed_at: Optional[str] = None
    interview_at: Optional[str] = None
    offer_at: Optional[str] = None
    rejected_at: Optional[str] = None


# Response Models
class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    jd_id: int
    resume_id: int
    company_name: str
    job_title: str
    match_score: int
    status: str
    notes: Optional[str] = None
    generated_at: str
    sent_at: Optional[str] = None
    screening_passed_at: Optional[str] = None
    interview_at: Optional[str] = None
    offer_at: Optional[str] = None
    rejected_at: Optional[str] = None
    created_at: str
    updated_at: str


# 模拟数据存储
application_storage = {
    1: [
        {
            "id": 1,
            "user_id": 1,
            "jd_id": 1,
            "resume_id": 1,
            "company_name": "字节跳动",
            "job_title": "高级Python开发工程师",
            "match_score": 85,
            "status": "interview",
            "notes": "",
            "generated_at": "2026-03-01T10:00:00Z",
            "sent_at": "2026-03-01T14:00:00Z",
            "screening_passed_at": "2026-03-02T10:00:00Z",
            "interview_at": "2026-03-05T15:00:00Z",
            "offer_at": None,
            "rejected_at": None,
            "created_at": "2026-03-01T10:00:00Z",
            "updated_at": "2026-03-02T10:00:00Z"
        },
        {
            "id": 2,
            "user_id": 1,
            "jd_id": 2,
            "resume_id": 2,
            "company_name": "阿里云",
            "job_title": "后端开发工程师",
            "match_score": 72,
            "status": "screening",
            "notes": "",
            "generated_at": "2026-03-01T09:00:00Z",
            "sent_at": "2026-03-01T09:30:00Z",
            "screening_passed_at": None,
            "interview_at": None,
            "offer_at": None,
            "rejected_at": None,
            "created_at": "2026-03-01T09:00:00Z",
            "updated_at": "2026-03-01T09:30:00Z"
        },
        {
            "id": 3,
            "user_id": 1,
            "jd_id": 3,
            "resume_id": 1,
            "company_name": "腾讯",
            "job_title": "全栈工程师",
            "match_score": 68,
            "status": "pending",
            "notes": "",
            "generated_at": "2026-02-28T10:00:00Z",
            "sent_at": None,
            "screening_passed_at": None,
            "interview_at": None,
            "offer_at": None,
            "rejected_at": None,
            "created_at": "2026-02-28T10:00:00Z",
            "updated_at": "2026-02-28T10:00:00Z"
        },
        {
            "id": 4,
            "user_id": 1,
            "jd_id": 4,
            "resume_id": 1,
            "company_name": "快手",
            "job_title": "后端架构师",
            "match_score": 45,
            "status": "rejected",
            "notes": "经验不符",
            "generated_at": "2026-02-25T10:00:00Z",
            "sent_at": "2026-02-25T11:00:00Z",
            "screening_passed_at": None,
            "interview_at": None,
            "offer_at": None,
            "rejected_at": "2026-02-27T10:00:00Z",
            "created_at": "2026-02-25T10:00:00Z",
            "updated_at": "2026-02-27T10:00:00Z"
        }
    ]
}


@router.get("/", response_model=List[ApplicationResponse])
async def list_applications(
    user_id: int = Query(1, description="用户ID"),
    status: Optional[str] = Query(None, description="状态筛选"),
    limit: int = Query(20, description="返回数量"),
    offset: int = Query(0, description="偏移量")
):
    """
    获取投递列表
    """
    if user_id not in application_storage:
        return []
    
    apps = application_storage[user_id]
    
    # 状态筛选
    if status:
        apps = [a for a in apps if a["status"] == status]
    
    # 分页
    return apps[offset:offset + limit]


@router.post("/", response_model=ApplicationResponse)
async def create_application(user_id: int, application: ApplicationCreate):
    """
    创建投递记录
    """
    import time
    app_id = int(time.time())
    
    now = datetime.now().isoformat() + "Z"
    
    new_app = {
        "id": app_id,
        "user_id": user_id,
        "jd_id": application.jd_id,
        "resume_id": application.resume_id,
        "company_name": application.company_name,
        "job_title": application.job_title,
        "match_score": application.match_score,
        "status": "pending",
        "notes": application.notes or "",
        "generated_at": now,
        "sent_at": None,
        "screening_passed_at": None,
        "interview_at": None,
        "offer_at": None,
        "rejected_at": None,
        "created_at": now,
        "updated_at": now
    }
    
    if user_id not in application_storage:
        application_storage[user_id] = []
    
    application_storage[user_id].insert(0, new_app)
    
    return ApplicationResponse(**new_app)


@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(user_id: int, application_id: int):
    """
    获取投递详情
    """
    if user_id not in application_storage:
        raise HTTPException(status_code=404, detail="投递记录不存在")
    
    for app in application_storage[user_id]:
        if app["id"] == application_id:
            return ApplicationResponse(**app)
    
    raise HTTPException(status_code=404, detail="投递记录不存在")


@router.put("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    user_id: int, 
    application_id: int, 
    update: ApplicationUpdate
):
    """
    更新投递状态
    """
    if user_id not in application_storage:
        raise HTTPException(status_code=404, detail="投递记录不存在")
    
    for i, app in enumerate(application_storage[user_id]):
        if app["id"] == application_id:
            # 更新字段
            if update.status:
                app["status"] = update.status
            if update.notes is not None:
                app["notes"] = update.notes
            if update.screening_passed_at:
                app["screening_passed_at"] = update.screening_passed_at
            if update.interview_at:
                app["interview_at"] = update.interview_at
            if update.offer_at:
                app["offer_at"] = update.offer_at
            if update.rejected_at:
                app["rejected_at"] = update.rejected_at
            
            app["updated_at"] = datetime.now().isoformat() + "Z"
            
            return ApplicationResponse(**app)
    
    raise HTTPException(status_code=404, detail="投递记录不存在")


@router.delete("/{application_id}")
async def delete_application(user_id: int, application_id: int):
    """
    删除投递记录
    """
    if user_id in application_storage:
        application_storage[user_id] = [
            a for a in application_storage[user_id] 
            if a["id"] != application_id
        ]
    
    return {"message": "投递记录已删除"}


@router.get("/stats/summary")
async def get_application_stats(user_id: int = Query(1)):
    """
    获取投递统计
    """
    if user_id not in application_storage:
        return {
            "total": 0,
            "pending": 0,
            "screening": 0,
            "interview": 0,
            "offer": 0,
            "rejected": 0,
            "success_rate": 0
        }
    
    apps = application_storage[user_id]
    
    stats = {
        "total": len(apps),
        "pending": len([a for a in apps if a["status"] == "pending"]),
        "screening": len([a for a in apps if a["status"] == "screening"]),
        "interview": len([a for a in apps if a["status"] == "interview"]),
        "offer": len([a for a in apps if a["status"] == "offer"]),
        "rejected": len([a for a in apps if a["status"] == "rejected"]),
    }
    
    # 计算成功率（获得面试/已投递）
    sent = len([a for a in apps if a["sent_at"]])
    if sent > 0:
        stats["success_rate"] = round((stats["interview"] + stats["offer"]) / sent * 100, 1)
    else:
        stats["success_rate"] = 0
    
    return stats


@router.post("/{application_id}/send")
async def send_application(user_id: int, application_id: int):
    """
    标记为已投递
    """
    if user_id not in application_storage:
        raise HTTPException(status_code=404, detail="投递记录不存在")
    
    for app in application_storage[user_id]:
        if app["id"] == application_id:
            app["status"] = "screening"
            app["sent_at"] = datetime.now().isoformat() + "Z"
            app["updated_at"] = datetime.now().isoformat() + "Z"
            return ApplicationResponse(**app)
    
    raise HTTPException(status_code=404, detail="投递记录不存在")