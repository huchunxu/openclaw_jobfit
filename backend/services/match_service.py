"""
匹配服务 - 人岗匹配算法
按 PRD 第7章设计
"""

import json
from typing import Dict, List, Optional
from backend.services.ai_service import AIService


class MatchEngine:
    """匹配引擎"""
    
    # 评分权重
    WEIGHTS = {
        "tech_skills": 0.35,    # 技术技能
        "experience": 0.25,     # 工作经验
        "education": 0.15,      # 教育背景
        "soft_skills": 0.15,   # 软技能
        "keywords": 0.10       # 关键词
    }
    
    def __init__(self):
        self.ai = AIService()
    
    def calculate_match(
        self,
        user_profile: Dict,
        jd_data: Dict
    ) -> Dict:
        """
        计算人岗匹配度
        
        参数:
        - user_profile: 用户档案数据
        - jd_data: JD解析结果
        
        返回:
        {
            "overall_score": int,
            "tech_skills_score": int,
            "experience_score": int,
            "education_score": int,
            "soft_skills_score": int,
            "keywords_score": int,
            "matched_items": List[Dict],
            "gap_items": List[Dict],
            "recommendation_level": str,
            "recommendation_label": str,
            "recommendation_reason": str,
            "action_items": List[str]
        }
        """
        # 1. 技术技能匹配
        tech_result = self._match_tech_skills(
            user_profile.get("skills", []),
            jd_data.get("required_skills", [])
        )
        
        # 2. 工作经验匹配
        exp_result = self._match_experience(
            user_profile.get("work_experiences", []),
            jd_data.get("min_experience_years", 0)
        )
        
        # 3. 教育背景匹配
        edu_result = self._match_education(
            user_profile.get("educations", []),
            jd_data.get("education_requirement", "any")
        )
        
        # 4. 软技能匹配
        soft_result = self._match_soft_skills(
            user_profile.get("soft_skills", []),
            jd_data.get("soft_skills", [])
        )
        
        # 5. 关键词匹配
        keyword_result = self._match_keywords(
            user_profile,
            jd_data.get("top_keywords", [])
        )
        
        # 计算总分
        total_score = (
            tech_result["score"] * self.WEIGHTS["tech_skills"] +
            exp_result["score"] * self.WEIGHTS["experience"] +
            edu_result["score"] * self.WEIGHTS["education"] +
            soft_result["score"] * self.WEIGHTS["soft_skills"] +
            keyword_result["score"] * self.WEIGHTS["keywords"]
        )
        
        overall_score = int(total_score)
        
        # 生成推荐建议
        recommendation = self._generate_recommendation(
            overall_score,
            tech_result,
            exp_result,
            gap_items=tech_result.get("gap_items", []) + exp_result.get("gap_items", [])
        )
        
        # 合并已匹配项
        matched_items = (
            tech_result.get("matched_items", []) +
            exp_result.get("matched_items", []) +
            edu_result.get("matched_items", []) +
            soft_result.get("matched_items", [])
        )
        
        # 合并缺口项
        gap_items = (
            tech_result.get("gap_items", []) +
            exp_result.get("gap_items", []) +
            edu_result.get("gap_items", []) +
            soft_result.get("gap_items", [])
        )
        
        return {
            "overall_score": overall_score,
            "tech_skills_score": tech_result["score"],
            "tech_skills_max": tech_result["max_score"],
            "experience_score": exp_result["score"],
            "experience_max": exp_result["max_score"],
            "education_score": edu_result["score"],
            "education_max": edu_result["max_score"],
            "soft_skills_score": soft_result["score"],
            "soft_skills_max": soft_result["max_score"],
            "keywords_score": keyword_result["score"],
            "keywords_max": keyword_result["max_score"],
            "matched_items": matched_items[:20],  # 最多20项
            "gap_items": gap_items[:15],  # 最多15项
            "recommendation_level": recommendation["level"],
            "recommendation_label": recommendation["label"],
            "recommendation_reason": recommendation["reason"],
            "action_items": recommendation["action_items"]
        }
    
    def _match_tech_skills(
        self,
        user_skills: List[Dict],
        jd_skills: List[Dict]
    ) -> Dict:
        """技术技能匹配"""
        matched = []
        gaps = []
        score = 0
        max_score = 35
        
        user_skill_names = {s.get("name", "").lower(): s for s in user_skills}
        
        for jd_skill in jd_skills:
            jd_name = jd_skill.get("name", "").lower()
            weight = jd_skill.get("weight", 0.8)
            
            # 查找匹配
            matched_skill = None
            for user_name, user_skill in user_skill_names.items():
                if jd_name in user_name or user_name in jd_name:
                    matched_skill = user_skill
                    break
            
            if matched_skill:
                # 已匹配
                level_score = self._get_skill_level_score(
                    matched_skill.get("level", "familiar")
                )
                skill_score = int(level_score * weight * 10)
                score += skill_score
                
                matched.append({
                    "type": "tech_skill",
                    "item": jd_skill.get("name"),
                    "match_level": "full" if level_score >= 3 else "partial",
                    "user_level": matched_skill.get("level")
                })
            else:
                # 未匹配
                gaps.append({
                    "type": "tech_skill",
                    "item": jd_skill.get("name"),
                    "severity": "important" if weight > 0.7 else "minor",
                    "improvement_suggestion": f"建议掌握{jd_skill.get('name')}技能"
                })
        
        # 归一化到满分
        if jd_skills:
            score = int(score / len(jd_skills) * 35 / 10)
        else:
            score = 20
        
        return {
            "score": min(score, max_score),
            "max_score": max_score,
            "matched_items": matched,
            "gap_items": gaps
        }
    
    def _get_skill_level_score(self, level: str) -> int:
        """技能等级评分"""
        level_map = {
            "expert": 5,
            "proficient": 4,
            "familiar": 3,
            "basic": 2,
            "native": 5,
            "fluent": 4,
            "business": 3
        }
        return level_map.get(level, 3)
    
    def _match_experience(
        self,
        work_experiences: List[Dict],
        min_years: int
    ) -> Dict:
        """工作经验匹配"""
        score = 0
        max_score = 25
        
        # 计算用户总工作经验年限
        total_years = 0
        for exp in work_experiences:
            start = exp.get("start_date")
            end = exp.get("end_date") or exp.get("start_date")  # 如果没有结束日期，假设现在
            if start and end:
                years = (end.year - start.year) + (end.month - start.month) / 12
                total_years += years
        
        # 评分
        if min_years == 0:
            score = 25  # 无要求给满分
        elif total_years >= min_years * 1.5:
            score = 25  # 远超要求
        elif total_years >= min_years:
            score = 20  # 满足要求
        elif total_years >= min_years * 0.7:
            score = 15  # 接近要求
        else:
            score = int(20 * total_years / min_years) if min_years > 0 else 20
        
        matched = []
        gaps = []
        
        if total_years >= min_years:
            matched.append({
                "type": "experience",
                "item": f"{total_years:.1f}年经验",
                "match_level": "full"
            })
        else:
            gaps.append({
                "type": "experience",
                "item": f"需要{min_years}年经验",
                "severity": "important",
                "improvement_suggestion": f"需要再积累{min_years - total_years:.1f}年经验"
            })
        
        return {
            "score": min(score, max_score),
            "max_score": max_score,
            "matched_items": matched,
            "gap_items": gaps
        }
    
    def _match_education(
        self,
        educations: List[Dict],
        requirement: str
    ) -> Dict:
        """教育背景匹配"""
        score = 0
        max_score = 15
        
        # 学历等级
        edu_level_map = {
            "phd": 5,
            "master": 4,
            "bachelor": 3,
            "associate": 2,
            "other": 1,
            "any": 0
        }
        
        if requirement == "any":
            score = 15
        elif educations:
            # 用户的最高学历
            user_edu = max(educations, key=lambda x: edu_level_map.get(x.get("degree", "other"), 0))
            user_level = edu_level_map.get(user_edu.get("degree", "other"), 0)
            req_level = edu_level_map.get(requirement, 3)
            
            if user_level >= req_level:
                score = 15
            elif user_level >= req_level - 1:
                score = 12
            else:
                score = 8
        else:
            score = 5
        
        return {
            "score": score,
            "max_score": max_score,
            "matched_items": [],
            "gap_items": []
        }
    
    def _match_soft_skills(
        self,
        user_soft_skills: List[Dict],
        jd_soft_skills: List[Dict]
    ) -> Dict:
        """软技能匹配"""
        matched = []
        gaps = []
        score = 0
        max_score = 15
        
        user_skill_names = {s.get("name", "") for s in user_soft_skills}
        
        for jd_skill in jd_soft_skills:
            name = jd_skill.get("name", "")
            importance = jd_skill.get("importance", "medium")
            
            if name in user_skill_names:
                matched.append({
                    "type": "soft_skill",
                    "item": name,
                    "match_level": "full"
                })
                score += 3 if importance == "high" else 2
            else:
                gaps.append({
                    "type": "soft_skill",
                    "item": name,
                    "severity": importance,
                    "improvement_suggestion": f"建议培养{name}能力"
                })
        
        return {
            "score": min(score, max_score),
            "max_score": max_score,
            "matched_items": matched,
            "gap_items": gaps
        }
    
    def _match_keywords(
        self,
        user_profile: Dict,
        jd_keywords: List[Dict]
    ) -> Dict:
        """关键词匹配"""
        score = 0
        max_score = 10
        
        # 收集用户profile中的所有关键词
        user_keywords = set()
        
        # 从技能中提取
        for skill in user_profile.get("skills", []):
            user_keywords.add(skill.get("name", "").lower())
        
        # 从工作经历中提取
        for exp in user_profile.get("work_experiences", []):
            for item in exp.get("achievements", []):
                user_keywords.add(item.lower())
            for item in exp.get("responsibilities", []):
                user_keywords.add(item.lower())
        
        # 从项目经历中提取
        for proj in user_profile.get("projects", []):
            user_keywords.add(proj.get("project_name", "").lower())
            for item in proj.get("tech_stack", []):
                user_keywords.add(item.lower())
        
        # 计算匹配
        matched_count = 0
        for kw in jd_keywords:
            keyword = kw.get("keyword", "").lower()
            if any(keyword in uk for uk in user_keywords):
                matched_count += 1
        
        if jd_keywords:
            score = int(matched_count / len(jd_keywords) * max_score)
        
        return {
            "score": min(score, max_score),
            "max_score": max_score,
            "matched_items": [],
            "gap_items": []
        }
    
    def _generate_recommendation(
        self,
        overall_score: int,
        *args,
        gap_items: List[Dict] = None
    ) -> Dict:
        """生成推荐建议"""
        if overall_score >= 75:
            level = "strong"
            label = "强烈推荐"
            reason = f"您的综合能力与该岗位高度匹配（匹配度{overall_score}%），具备很强的竞争力。"
            action_items = ["建议立即投递", "可在简历中突出匹配项"]
        elif overall_score >= 50:
            level = "conditional"
            label = "优化后再投递"
            reason = f"您与该岗位匹配度为{overall_score}%，建议针对性优化后再投递。"
            action_items = ["针对缺口技能进行提升", "在简历中强调相关经验", "准备面试时重点准备缺口领域"]
        else:
            level = "not_recommended"
            label = "暂不建议"
            reason = f"您与该岗位匹配度较低（{overall_score}%），建议选择更匹配的岗位。"
            action_items = ["建议寻找更匹配的岗位", "或系统性提升后再投递"]
        
        # 添加缺口项作为行动建议
        if gap_items:
            for gap in gap_items[:3]:
                suggestion = gap.get("improvement_suggestion", "")
                if suggestion and suggestion not in action_items:
                    action_items.append(suggestion)
        
        return {
            "level": level,
            "label": label,
            "reason": reason,
            "action_items": action_items[:5]  # 最多5条
        }


def batch_match(
    user_profile: Dict,
    jd_list: List[Dict]
) -> List[Dict]:
    """
    批量匹配 - 对多个JD进行匹配
    """
    engine = MatchEngine()
    results = []
    
    for jd in jd_list:
        result = engine.calculate_match(user_profile, jd)
        result["jd_id"] = jd.get("id")
        results.append(result)
    
    # 按匹配度排序
    results.sort(key=lambda x: x["overall_score"], reverse=True)
    
    return results