"""
认证服务 - 用户注册/登录
"""

import jwt
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict
from sqlalchemy.orm import Session

SECRET_KEY = "jobfit_secret_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 7  # 7天


class AuthService:
    """认证服务"""
    
    @staticmethod
    def create_access_token(user_id: int, data: dict = None) -> str:
        """创建访问令牌"""
        to_encode = {"sub": str(user_id), "user_id": user_id}
        if data:
            to_encode.update(data)
        
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[int]:
        """验证令牌并返回用户ID"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("user_id")
            return user_id
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def hash_password(password: str) -> str:
        """密码哈希"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """验证密码"""
        return AuthService.hash_password(plain_password) == hashed_password
    
    @staticmethod
    def generate_phone_code(phone: str) -> str:
        """生成6位验证码"""
        import random
        return f"{random.randint(0, 999999):06d}"
    
    @staticmethod
    def send_sms_code(phone: str, code: str) -> bool:
        """
        发送短信验证码
        TODO: 集成阿里云短信或其他短信服务
        """
        print(f"[SMS] 验证码 {code} 已发送到 {phone}")
        return True


def create_user_with_phone(db: Session, phone: str) -> Dict:
    """
    通过手机号创建/获取用户
    """
    from backend.models.database import User
    
    # 查找已存在用户
    user = db.query(User).filter(User.phone == phone).first()
    
    if user:
        return {
            "id": user.id,
            "phone": user.phone,
            "is_new": False
        }
    
    # 创建新用户
    new_user = User(phone=phone)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "id": new_user.id,
        "phone": new_user.phone,
        "is_new": True
    }


def verify_phone_code(phone: str, code: str, stored_code: str) -> bool:
    """
    验证短信验证码
    TODO: 使用Redis存储验证码并设置过期时间
    """
    return code == stored_code