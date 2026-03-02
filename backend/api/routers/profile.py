"""
用户档案路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict

router = APIRouter(prefix="/api/profile", tags=["用户档案"])

# 模拟档案存储
profile_storage = {}


class ProfileAnswer(BaseModel):
    step: int
    answer: str


class ProfileResponse(BaseModel):
    step: int
    total_steps: int
    question: str
    is_complete: bool = False


@router.get("/collect/start")
async def start_collect():
    """开始信息采集"""
    return {
        "step": 0,
        "total_steps": 13,
        "question": "你好！我是 JobFit 助手小 Fit～请问你的姓名是？",
        "is_complete": False
    }


@router.post("/collect/answer")
async def submit_answer(answer: ProfileAnswer):
    """提交回答"""
    questions = [
        "请问你的姓名是？",
        "你目前所在的城市是？",
        "请问你的出生年份是多少？",
        "你目前正在寻找什么岗位呢？",
        "你期望的工作类型是？",
        "请介绍一下你的最高学历？",
        "请告诉我你工作的公司名称？",
        "你担任的职位是？",
        "工作的起止时间？",
        "工作期间的主要成就？",
        "你擅长哪些技术技能？",
        "你有哪些软技能？",
    ]
    
    next_step = answer.step + 1
    
    if next_step >= len(questions):
        return {
            "step": next_step,
            "total_steps": len(questions),
            "question": "太棒了！信息采集完成～",
            "is_complete": True,
            "reply": "感谢你的信息！你的档案已保存，现在我们可以开始求职之旅了！"
        }
    
    return {
        "step": next_step,
        "total_steps": len(questions),
        "question": questions[next_step],
        "is_complete": False,
        "reply": "很好！让我记录下来。" if next_step < 3 else "了解了！"
    }


@router.get("/{user_id}")
async def get_profile(user_id: int):
    """获取用户档案"""
    if user_id not in profile_storage:
        # 返回模拟数据
        return {
            "basic_info": {
                "name": "张三",
                "location": "北京",
                "birth_year": 1995
            },
            "job_intention": {
                "target_positions": ["Python开发工程师"],
                "job_type": "full_time"
            },
            "skills": {
                "tech": ["Python", "Django", "MySQL"],
                "soft": ["团队协作", "沟通能力"]
            }
        }
    return profile_storage[user_id]


@router.post("/{user_id}")
async def update_profile(user_id: int, data: Dict):
    """更新用户档案"""
    profile_storage[user_id] = data
    return {"message": "档案已更新", "user_id": user_id}