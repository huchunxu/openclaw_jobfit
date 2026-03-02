"""
JD 解析服务 - 招聘JD智能解析
按 PRD 第7章设计
"""

import json
import re
from typing import Dict, List, Optional
from backend.services.ai_service import AIService


class JDParser:
    """JD 解析器"""
    
    # 常见技能关键词
    TECH_SKILLS = [
        "Python", "Java", "JavaScript", "TypeScript", "Go", "Rust", "C++", "C#", "PHP", "Ruby",
        "React", "Vue", "Angular", "Next.js", "Nuxt", "Node.js", "Django", "Flask", "Spring",
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Kafka", "RabbitMQ",
        "Docker", "Kubernetes", "Jenkins", "Git", "CI/CD", "AWS", "Azure", "GCP",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP",
        "产品经理", "项目管理", "数据分析", "用户研究", "Axure", "Figma"
    ]
    
    # 软技能关键词
    SOFT_SKILLS = [
        "沟通", "团队合作", "领导力", "解决问题", "时间管理", "创新",
        "逻辑思维", "表达能力", "抗压能力", "学习能力", "责任心"
    ]
    
    # 学历要求映射
    EDUCATION_MAP = {
        "博士": "phd",
        "硕士": "master",
        "本科": "bachelor",
        "大专": "associate",
        "不限": "any"
    }
    
    def __init__(self):
        self.ai = AIService()
    
    def parse(self, jd_text: str, platform: str = None) -> Dict:
        """
        解析JD文本
        
        返回:
        {
            "job_title": str,
            "company_name": str,
            "location": str,
            "salary_range_min": int,
            "salary_range_max": int,
            "job_type": str,
            "required_skills": List[Dict],
            "soft_skills": List[Dict],
            "min_experience_years": int,
            "education_requirement": str,
            "top_keywords": List[Dict],
            "hidden_requirements": str
        }
        """
        # 1. 基本信息提取
        job_title = self._extract_job_title(jd_text)
        company_name = self._extract_company_name(jd_text)
        location = self._extract_location(jd_text)
        salary = self._extract_salary(jd_text)
        job_type = self._extract_job_type(jd_text)
        
        # 2. 使用AI提取技能和关键词
        skills_result = self._extract_skills_with_ai(jd_text)
        
        # 3. 提取经验和学历要求
        experience = self._extract_experience(jd_text)
        education = self._extract_education(jd_text)
        
        # 4. 提取隐性要求
        hidden_req = self._extract_hidden_requirements(jd_text)
        
        # 5. 生成关键词
        top_keywords = self._generate_keywords(
            job_title, 
            skills_result.get("required_skills", []),
            experience,
            education
        )
        
        return {
            "job_title": job_title,
            "company_name": company_name,
            "location": location,
            "salary_range_min": salary.get("min"),
            "salary_range_max": salary.get("max"),
            "job_type": job_type,
            "required_skills": skills_result.get("required_skills", []),
            "soft_skills": skills_result.get("soft_skills", []),
            "min_experience_years": experience,
            "education_requirement": education,
            "top_keywords": top_keywords,
            "hidden_requirements": hidden_req
        }
    
    def _extract_job_title(self, text: str) -> str:
        """提取职位名称"""
        patterns = [
            r"招聘[：:\s]+([^\n，。,]+)",
            r"职位[：:\s]+([^\n，。,]+)",
            r"岗位[：:\s]+([^\n，。,]+)",
            r"^([^\n，。,]+经理|^\[^\n，。,]+工程师|^\[^\n，。,]+专员)"
        ]
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        return "未知职位"
    
    def _extract_company_name(self, text: str) -> str:
        """提取公司名称"""
        patterns = [
            r"公司[：:\s]+([^\n，。,]+)",
            r"^([^\n，。,]{2,15}公司)"
        ]
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        return "未知公司"
    
    def _extract_location(self, text: str) -> str:
        """提取工作地点"""
        cities = ["北京", "上海", "广州", "深圳", "杭州", "南京", "苏州", "成都", "武汉", "西安", "天津", "重庆"]
        for city in cities:
            if city in text:
                return city
        return "未知"
    
    def _extract_salary(self, text: str) -> Dict:
        """提取薪资范围"""
        # 匹配格式: 15K-30K, 15000-30000, 15k-30k
        pattern = r"(\d{1,2})[kK]?-(\d{1,2})[kK]?|(\d{4,6})-(\d{4,6})"
        
        match = re.search(pattern, text)
        if match:
            if match.group(1):
                return {"min": int(match.group(1)) * 1000, "max": int(match.group(2)) * 1000}
            elif match.group(3):
                return {"min": int(match.group(3)), "max": int(match.group(4))}
        
        return {"min": None, "max": None}
    
    def _extract_job_type(self, text: str) -> str:
        """提取工作类型"""
        if "实习" in text:
            return "intern"
        elif "兼职" in text:
            return "part_time"
        return "full_time"
    
    def _extract_skills_with_ai(self, text: str) -> Dict:
        """使用AI提取技能"""
        prompt = f"""请从以下JD中提取技能要求，JSON格式返回：

JD内容：
{text[:2000]}

要求：
1. required_skills: 技术技能列表，每项包含 name(名称), level(expert/proficient/familiar), weight(0-1权重)
2. soft_skills: 软技能列表，每项包含 name(名称), importance(high/medium/low)

返回JSON格式：
{{
    "required_skills": [
        {{"name": "Python", "level": "expert", "weight": 0.9}},
        {{"name": "MySQL", "level": "proficient", "weight": 0.8}}
    ],
    "soft_skills": [
        {{"name": "沟通能力", "importance": "high"}},
        {{"name": "团队协作", "importance": "medium"}}
    ]
}}"""

        try:
            messages = [{"role": "user", "content": prompt}]
            result = self.ai.chat(messages, model="qwen-plus")
            
            # 尝试解析JSON
            json_match = re.search(r'\{[\s\S]*\}', result)
            if json_match:
                return json.loads(json_match.group())
        except Exception as e:
            print(f"AI提取技能失败: {e}")
        
        # 降级: 使用规则提取
        return self._extract_skills_by_rule(text)
    
    def _extract_skills_by_rule(self, text: str) -> Dict:
        """使用规则提取技能"""
        required_skills = []
        soft_skills = []
        
        text_upper = text.upper()
        
        for skill in self.TECH_SKILLS:
            if skill.upper() in text_upper:
                required_skills.append({
                    "name": skill,
                    "level": "familiar",
                    "weight": 0.7
                })
        
        for skill in self.SOFT_SKILLS:
            if skill in text:
                soft_skills.append({
                    "name": skill,
                    "importance": "medium"
                })
        
        return {
            "required_skills": required_skills[:15],  # 最多15个
            "soft_skills": soft_skills[:8]  # 最多8个
        }
    
    def _extract_experience(self, text: str) -> int:
        """提取经验要求"""
        # 匹配: 3年以上, 3-5年, 3年+
        patterns = [
            r"(\d+)\+?年.*经验",
            r"经验.*?(\d+)年",
            r"(\d+).*?年.*?工作"
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return int(match.group(1))
        
        return 0
    
    def _extract_education(self, text: str) -> str:
        """提取学历要求"""
        for key, value in self.EDUCATION_MAP.items():
            if key in text:
                return value
        return "any"
    
    def _extract_hidden_requirements(self, text: str) -> str:
        """提取隐性要求"""
        hidden = []
        
        # 加班文化
        if any(kw in text for kw in ["加班", "抗压", "能承受压力"]):
            hidden.append("可能需要加班")
        
        # 扁平管理
        if "扁平" in text:
            hidden.append("扁平化管理")
        
        # 成长空间
        if any(kw in text for kw in ["成长", "发展", "晋升"]):
            hidden.append("有晋升空间")
        
        return "; ".join(hidden) if hidden else "无明显隐性要求"
    
    def _generate_keywords(
        self, 
        job_title: str, 
        skills: List[Dict],
        experience: int,
        education: str
    ) -> List[Dict]:
        """生成Top20关键词"""
        keywords = []
        
        # 添加职位关键词
        if job_title:
            keywords.append({"keyword": job_title, "importance": "critical"})
        
        # 添加技能关键词
        for skill in skills[:10]:
            keywords.append({
                "keyword": skill.get("name", ""),
                "importance": "critical" if skill.get("weight", 0) > 0.8 else "important"
            })
        
        # 添加经验要求
        if experience > 0:
            keywords.append({
                "keyword": f"{experience}年经验",
                "importance": "important"
            })
        
        # 添加学历要求
        if education != "any":
            keywords.append({
                "keyword": education,
                "importance": "basic"
            })
        
        # 填充到20个
        default_keywords = ["团队合作", "沟通能力", "解决问题", "责任心", "学习能力"]
        for kw in default_keywords:
            if len(keywords) >= 20:
                break
            if not any(k.get("keyword") == kw for k in keywords):
                keywords.append({"keyword": kw, "importance": "nice_to_have"})
        
        return keywords[:20]


def parse_jd_from_url(url: str) -> str:
    """
    从URL解析JD
    TODO: 实现网页爬取
    """
    # 模拟实现
    return """
    职位：高级Python开发工程师
    公司：字节跳动
    地点：北京
    薪资：25K-45K
    要求：
    - 3年以上Python开发经验
    - 熟悉Django或Flask框架
    - 掌握MySQL、Redis
    - 有Docker、K8s经验优先
    - 良好的沟通能力和团队协作精神
    """


def parse_jd_from_file(file_content: str, file_type: str) -> str:
    """
    从文件解析JD
    TODO: 实现PDF/Word解析
    """
    # 模拟实现
    return file_content