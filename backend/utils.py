"""
工具函数模块
"""

from datetime import datetime, timedelta
from typing import Optional
import hashlib
import secrets


def generate_token(length: int = 32) -> str:
    """生成随机Token"""
    return secrets.token_urlsafe(length)


def hash_password(password: str) -> str:
    """密码哈希"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    """验证密码"""
    return hash_password(password) == hashed


def format_date(date_obj: Optional[datetime]) -> str:
    """格式化日期"""
    if not date_obj:
        return ""
    return date_obj.strftime("%Y-%m-%d")


def format_datetime(dt: Optional[datetime]) -> str:
    """格式化日期时间"""
    if not dt:
        return ""
    return dt.strftime("%Y-%m-%d %H:%M:%S")


def calculate_experience_years(start_date: datetime, end_date: Optional[datetime] = None) -> int:
    """计算工作经验年限"""
    end = end_date or datetime.now()
    delta = end - start_date
    return int(delta.days / 365)


def parse_salary_range(salary_str: str) -> tuple:
    """解析薪资范围字符串
    
    例如: "15K-25K" -> (15000, 25000)
    """
    salary_str = salary_str.upper().replace("K", "000")
    if "-" in salary_str:
        parts = salary_str.split("-")
        try:
            return int(parts[0]), int(parts[1])
        except:
            return 0, 0
    return 0, 0


def clean_jd_text(text: str) -> str:
    """清洗JD文本（去除广告等）"""
    # 去除多余空白
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return '\n'.join(lines)


def extract_keywords(text: str, top_n: int = 20) -> list:
    """提取关键词（简单实现）"""
    # 实际生产中应该使用更复杂的NLP处理
    stop_words = {'的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'}
    words = text.replace('\n', ' ').replace(',', ' ').replace('。', ' ').split()
    word_freq = {}
    for word in words:
        if len(word) >= 2 and word not in stop_words:
            word_freq[word] = word_freq.get(word, 0) + 1
    
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    return [{"keyword": w[0], "frequency": w[1]} for w in sorted_words[:top_n]]


def generate_resume_filename(user_name: str, job_title: str) -> str:
    """生成简历文件名"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    safe_name = "".join(c for c in job_title if c.isalnum() or c in ('-', '_'))
    return f"{user_name}_{safe_name}_{timestamp}"


def validate_phone(phone: str) -> bool:
    """验证手机号"""
    return len(phone) == 11 and phone.isdigit()


def validate_email(email: str) -> bool:
    """验证邮箱"""
    return '@' in email and '.' in email.split('@')[1]


class DateRange:
    """日期范围工具"""
    
    def __init__(self, start: datetime, end: Optional[datetime] = None):
        self.start = start
        self.end = end or datetime.now()
    
    def months(self) -> int:
        """相差月份"""
        return (self.end.year - self.start.year) * 12 + self.end.month - self.start.month
    
    def years(self) -> float:
        """相差年份（精确）"""
        return (self.end - self.start).days / 365.25
    
    def format(self) -> str:
        """格式化输出"""
        return f"{self.start.strftime('%Y.%m')} - {self.end.strftime('%Y.%m')}"


def paginate(items: list, page: int = 1, page_size: int = 20) -> dict:
    """分页工具"""
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    
    return {
        "items": items[start:end],
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": (total + page_size - 1) // page_size
    }