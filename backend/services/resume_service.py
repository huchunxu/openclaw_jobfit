"""
简历生成服务 - AI简历定制
按 PRD 第8章设计
"""

import json
from typing import Dict, List, Optional
from datetime import datetime
from backend.services.ai_service import AIService


class ResumeGenerator:
    """简历生成器"""
    
    TEMPLATES = {
        "default": "通用模板",
        "modern": "现代简约",
        "professional": "专业正式",
        "creative": "创意风格"
    }
    
    def __init__(self):
        self.ai = AIService()
    
    def generate(
        self,
        user_profile: Dict,
        jd_data: Dict,
        template_id: str = "default",
        generation_strategy: str = "default",
        length_preference: str = "standard"
    ) -> Dict:
        """
        生成简历
        
        参数:
        - user_profile: 用户档案
        - jd_data: JD数据
        - template_id: 模板ID
        - generation_strategy: 生成策略
        - length_preference: 简历长度
        
        返回:
        {
            "id": int,
            "header": {...},
            "summary": str,
            "experience": [...],
            "education": [...],
            "projects": [...],
            "skills": [...],
            "pdf_url": str,
            "word_url": str
        }
        """
        # 1. 生成个人简介（针对JD定制）
        summary = self._generate_summary(user_profile, jd_data)
        
        # 2. 优化工作经历
        experience = self._optimize_experience(
            user_profile.get("work_experiences", []),
            jd_data.get("required_skills", [])
        )
        
        # 3. 优化项目经历
        projects = self._optimize_projects(
            user_profile.get("projects", []),
            jd_data.get("required_skills", [])
        )
        
        # 4. 提取技能（根据JD要求排序）
        skills = self._optimize_skills(
            user_profile.get("skills", []),
            jd_data.get("required_skills", [])
        )
        
        # 5. 生成头部信息
        header = self._generate_header(user_profile)
        
        # 6. 生成教育背景
        education = user_profile.get("educations", [])
        
        # 7. 计算简历长度
        max_length = self._get_max_length(length_preference)
        
        # 8. 组装简历
        resume = {
            "template_id": template_id,
            "header": header,
            "summary": summary,
            "experience": experience[:max_length.get("experience", 5)],
            "education": education[:max_length.get("education", 3)],
            "projects": projects[:max_length.get("projects", 3)],
            "skills": skills[:max_length.get("skills", 15)],
            "generation_strategy": generation_strategy,
            "created_at": datetime.now().isoformat()
        }
        
        # 9. 生成ATS优化建议
        optimization_log = self._generate_optimization_log(resume, jd_data)
        
        return {
            "resume": resume,
            "optimization_log": optimization_log,
            "pdf_url": f"/api/resumes/export?format=pdf",
            "word_url": f"/api/resumes/export?format=word"
        }
    
    def _generate_summary(self, user_profile: Dict, jd_data: Dict) -> str:
        """生成个人简介"""
        basic_info = user_profile.get("basic_info", {})
        name = basic_info.get("name", "")
        job_intention = user_profile.get("job_intention", {})
        target_positions = job_intention.get("target_positions", [""])
        target_position = target_positions[0] if target_positions else "专业人士"
        
        # 收集技能关键词
        skills = user_profile.get("skills", [])
        skill_names = [s.get("name", "") for s in skills[:5]]
        
        # 收集工作年限
        work_exps = user_profile.get("work_experiences", [])
        years = self._calculate_years(work_exps)
        
        # 使用AI生成定制化简介
        prompt = f"""根据以下信息生成一段专业的个人简介（100字以内）：

姓名: {name}
目标岗位: {target_position}
工作年限: {years}年
核心技能: {', '.join(skill_names)}
JD关键词: {[k.get('keyword', '') for k in jd_data.get('top_keywords', [])[:5]]}

要求:
- 突出与目标岗位的匹配度
- 体现个人优势
- 专业、有吸引力
- 中文返回"""

        try:
            messages = [{"role": "user", "content": prompt}]
            summary = self.ai.chat(messages, model="qwen-plus")
            return summary.strip()
        except Exception as e:
            print(f"AI生成简介失败: {e}")
        
        # 降级方案
        return f"{name}，{years}年{target_position}经验，擅长{', '.join(skill_names[:3])}，寻求挑战性岗位。"
    
    def _calculate_years(self, work_experiences: List[Dict]) -> int:
        """计算工作年限"""
        if not work_experiences:
            return 0
        
        total_months = 0
        for exp in work_experiences:
            start = exp.get("start_date")
            end = exp.get("end_date") or datetime.now()
            
            if start:
                months = (end.year - start.year) * 12 + (end.month - start.month)
                total_months += max(0, months)
        
        return total_months // 12
    
    def _generate_header(self, user_profile: Dict) -> Dict:
        """生成头部信息"""
        basic_info = user_profile.get("basic_info", {})
        
        return {
            "name": basic_info.get("name", ""),
            "gender": basic_info.get("gender", ""),
            "location": basic_info.get("location", ""),
            "phone": user_profile.get("phone", ""),
            "email": user_profile.get("email", ""),
            "age": self._calculate_age(basic_info.get("birth_year")),
            "linkedin_url": basic_info.get("linkedin_url"),
            "github_url": basic_info.get("github_url"),
            "portfolio_url": basic_info.get("portfolio_url")
        }
    
    def _calculate_age(self, birth_year: int) -> Optional[int]:
        """计算年龄"""
        if birth_year:
            return datetime.now().year - birth_year
        return None
    
    def _optimize_experience(
        self,
        experiences: List[Dict],
        jd_skills: List[Dict]
    ) -> List[Dict]:
        """优化工作经历"""
        optimized = []
        
        # 获取JD关键词
        jd_keywords = {s.get("name", "").lower() for s in jd_skills}
        
        for exp in experiences:
            # 提取关键职责和成就
            responsibilities = exp.get("responsibilities", [])
            achievements = exp.get("achievements", [])
            
            # 根据JD关键词调整顺序
            prioritized_achievements = []
            other_achievements = []
            
            for ach in achievements:
                ach_lower = ach.lower()
                if any(kw in ach_lower for kw in jd_keywords):
                    prioritized_achievements.append(ach)
                else:
                    other_achievements.append(ach)
            
            # 使用AI进一步优化描述
            optimized_achievements = self._optimize_achievements(
                prioritized_achievements + other_achievements,
                jd_keywords
            )
            
            optimized.append({
                "company_name": exp.get("company_name"),
                "position": exp.get("position"),
                "department": exp.get("department"),
                "start_date": exp.get("start_date").isoformat() if exp.get("start_date") else None,
                "end_date": exp.get("end_date").isoformat() if exp.get("end_date") else "至今",
                "is_current": exp.get("is_current", False),
                "responsibilities": responsibilities,
                "achievements": optimized_achievements,
                "tools_used": exp.get("tools_used", [])
            })
        
        return optimized
    
    def _optimize_achievements(
        self,
        achievements: List[str],
        jd_keywords: set
    ) -> List[str]:
        """优化成果描述"""
        if not achievements:
            return []
        
        # 如果有AI能力，使用AI优化
        if len(achievements) > 3:
            prompt = f"""优化以下工作成果描述，使其更专业、更有数据说服力：

原始描述:
{json.dumps(achievements, ensure_ascii=False, indent=2)}

目标岗位关键词: {', '.join(jd_keywords)}

要求:
- 使用STAR法则
- 添加量化数据（如果适用）
- 突出与目标岗位的相关性
- 每条保持简洁
- 返回JSON数组格式"""

            try:
                messages = [{"role": "user", "content": prompt}]
                result = self.ai.chat(messages, model="qwen-plus")
                
                # 尝试解析JSON
                import re
                json_match = re.search(r'\[[\s\S]*\]', result)
                if json_match:
                    return json.loads(json_match.group())
            except Exception as e:
                print(f"AI优化成果失败: {e}")
        
        # 降级：添加量化和结果导向词
        optimized = []
        for ach in achievements:
            ach = ach.strip()
            if ach and not any(word in ach for word in ["提升", "增加", "减少", "实现", "完成"]):
                # 尝试添加结果描述
                if "负责" in ach:
                    ach = ach.replace("负责", "主导")
                optimized.append(ach)
            else:
                optimized.append(ach)
        
        return optimized
    
    def _optimize_projects(
        self,
        projects: List[Dict],
        jd_skills: List[Dict]
    ) -> List[Dict]:
        """优化项目经历"""
        optimized = []
        
        jd_keywords = {s.get("name", "").lower() for s in jd_skills}
        
        for proj in projects:
            tech_stack = proj.get("tech_stack", [])
            
            # 标记与JD相关的技能
            related_stack = [t for t in tech_stack if t.lower() in jd_keywords]
            other_stack = [t for t in tech_stack if t.lower() not in jd_keywords]
            
            optimized.append({
                "project_name": proj.get("project_name"),
                "role": proj.get("role"),
                "start_date": proj.get("start_date").isoformat() if proj.get("start_date") else None,
                "end_date": proj.get("end_date").isoformat() if proj.get("end_date") else None,
                "team_size": proj.get("team_size"),
                "description": proj.get("description"),
                "tech_stack": related_stack + other_stack,  # 相关技能放前面
                "achievements": proj.get("achievements"),
                "project_url": proj.get("project_url")
            })
        
        return optimized
    
    def _optimize_skills(
        self,
        skills: List[Dict],
        jd_skills: List[Dict]
    ) -> List[Dict]:
        """优化技能列表"""
        if not skills:
            return []
        
        # 按与JD的匹配度排序
        jd_skill_names = {s.get("name", "").lower() for s in jd_skills}
        
        matched = []
        other = []
        
        for skill in skills:
            skill_name = skill.get("name", "").lower()
            if any(jsn in skill_name or skill_name in jsn for jsn in jd_skill_names):
                matched.append({**skill, "match_priority": 1})
            else:
                other.append({**skill, "match_priority": 0})
        
        # 按优先级排序
        sorted_skills = sorted(matched, key=lambda x: x.get("level", ""), reverse=True)
        sorted_skills += sorted(other, key=lambda x: x.get("level", ""), reverse=True)
        
        return sorted_skills
    
    def _get_max_length(self, preference: str) -> Dict:
        """获取各部分最大长度"""
        length_map = {
            "concise": {"experience": 3, "education": 2, "projects": 2, "skills": 10},
            "standard": {"experience": 5, "education": 3, "projects": 3, "skills": 15},
            "detailed": {"experience": 8, "education": 5, "projects": 5, "skills": 20}
        }
        return length_map.get(preference, length_map["standard"])
    
    def _generate_optimization_log(self, resume: Dict, jd_data: Dict) -> List[Dict]:
        """生成ATS优化日志"""
        log = []
        
        # 检查关键词覆盖
        jd_keywords = {k.get("keyword", "").lower() for k in jd_data.get("top_keywords", [])}
        
        resume_text = json.dumps(resume, ensure_ascii=False).lower()
        matched_kw = jd_keywords & set(resume_text.split())
        
        if len(matched_kw) < len(jd_keywords) * 0.5:
            log.append({
                "type": "warning",
                "message": "简历关键词覆盖率较低，建议增加JD中的关键词"
            })
        
        # 检查简历长度
        total_items = (
            len(resume.get("experience", [])) +
            len(resume.get("education", [])) +
            len(resume.get("projects", []))
        )
        
        if total_items < 5:
            log.append({
                "type": "info",
                "message": "建议增加项目或工作经历以提升竞争力"
            })
        
        return log


def generate_resume_pdf(resume_id: int) -> str:
    """
    生成PDF
    TODO: 使用weasyprint或其他库实现
    """
    return f"https://jobfit.example.com/resumes/{resume_id}.pdf"


def generate_resume_word(resume_id: int) -> str:
    """
    生成Word
    TODO: 使用python-docx实现
    """
    return f"https://jobfit.example.com/resumes/{resume_id}.docx"