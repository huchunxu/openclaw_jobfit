"""
认证路由
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(prefix="/api/auth", tags=["认证"])


# Request Models
class SendCodeRequest(BaseModel):
    phone: str


class LoginRequest(BaseModel):
    phone: str
    code: str


class LoginWithPasswordRequest(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str


# Response Models
class SendCodeResponse(BaseModel):
    message: str
    expires_in: int = 300  # 5分钟


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    is_new: bool


# 模拟验证码存储（生产环境用Redis）
VERIFICATION_CODES = {}


@router.post("/send-code", response_model=SendCodeResponse)
async def send_verification_code(request: SendCodeRequest):
    """
    发送短信验证码
    """
    # 验证手机号格式
    if len(request.phone) != 11 or not request.phone.isdigit():
        raise HTTPException(status_code=400, detail="手机号格式不正确")
    
    # 生成6位验证码
    import random
    code = f"{random.randint(0, 999999):06d}"
    
    # 存储验证码（5分钟有效）
    VERIFICATION_CODES[request.phone] = {
        "code": code,
        "expire_at": 300  # 5分钟
    }
    
    # TODO: 调用短信服务发送验证码
    print(f"[短信] 验证码 {code} 已发送到 {request.phone}")
    
    return SendCodeResponse(
        message="验证码已发送",
        expires_in=300
    )


@router.post("/login", response_model=LoginResponse)
async def login_with_code(request: LoginRequest):
    """
    手机号验证码登录
    """
    # 验证手机号格式
    if len(request.phone) != 11:
        raise HTTPException(status_code=400, detail="手机号格式不正确")
    
    # 验证验证码
    stored = VERIFICATION_CODES.get(request.phone)
    if not stored:
        raise HTTPException(status_code=400, detail="请先获取验证码")
    
    if stored["code"] != request.code:
        raise HTTPException(status_code=400, detail="验证码错误")
    
    # 验证通过，生成Token
    from .services.auth_service import AuthService
    
    # 模拟用户ID（实际应查询数据库）
    user_id = hash(request.phone) % 1000000
    
    token = AuthService.create_access_token(user_id)
    
    # 清除验证码
    del VERIFICATION_CODES[request.phone]
    
    return LoginResponse(
        access_token=token,
        user_id=user_id,
        is_new=False
    )


@router.post("/login/password", response_model=LoginResponse)
async def login_with_password(request: LoginWithPasswordRequest):
    """
    密码登录
    """
    if not request.phone and not request.email:
        raise HTTPException(status_code=400, detail="请提供手机号或邮箱")
    
    # TODO: 查询数据库验证密码
    from .services.auth_service import AuthService
    
    # 模拟用户ID
    user_id = 1
    
    token = AuthService.create_access_token(user_id)
    
    return LoginResponse(
        access_token=token,
        user_id=user_id,
        is_new=False
    )


@router.post("/logout")
async def logout():
    """
    退出登录
    """
    return {"message": "已退出登录"}


@router.get("/me")
async def get_current_user():
    """
    获取当前用户信息
    """
    # TODO: 从Token获取用户信息
    return {
        "id": 1,
        "phone": "138****8888",
        "name": "张三"
    }