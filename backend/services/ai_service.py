"""
AI 服务模块 - 大模型调用
按 PRD 第9.2章设计
"""

import os
import json
from typing import Optional, List, Dict, Any
from openai import OpenAI


class AIService:
    """AI 服务基类"""
    
    def __init__(self, provider: str = "dashscope"):
        self.provider = provider
        self.client = None
        self._init_client()
    
    def _init_client(self):
        if self.provider == "openai":
            self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        elif self.provider == "dashscope":
            self.client = OpenAI(
                api_key=os.getenv("DASHSCOPE_API_KEY", "sk-sp-969d06aacbff4f7fbf76693d11f3807a"),
                base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
            )
    
    def chat(
        self, 
        messages: List[Dict], 
        model: str = "qwen-plus",
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> str:
        """通用聊天接口"""
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    
    def chat_with_functions(
        self,
        messages: List[Dict],
        functions: List[Dict],
        model: str = "qwen-plus"
    ) -> Dict:
        """带函数调用的聊天"""
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            tools=functions,
            tool_choice="auto"
        )
        return {
            "content": response.choices[0].message.content,
            "function_call": response.choices[0].message.tool_calls if hasattr(response.choices[0].message, 'tool_calls') else None
        }


class ProfileCollector:
    """对话式信息采集 - Module A
    
    按 PRD 6.1章设计
    15问精简版对话流程
    """
    
    SYSTEM_PROMPT = """你是 JobFit 助手小Fit，你的任务是通过自然对话收集用户的职业信息。

设计原则：
- 渐进式披露，分步骤引导，避免信息过载
- 智能追问，根据回答质量判断是否追问
- 用户可以用口语化回答，系统智能提取
- 非必填信息允许跳过

对话模块顺序：
1. 基本信息 (3问)
2. 求职意向 (2问)
3. 教育背景 (2问)
4. 工作经历 (4问×循环)
5. 技能 (2问)
6. 自我介绍 (1问生成)

每轮对话后，调用 extract_profile_fields 函数提取结构化信息。"""
    
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.conversation_history = []
    
    def start_conversation(self) -> str:
        """开始对话，返回开场白"""
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user", "content": "你好！我是JobFit助手小Fit，先来认识一下你吧～请问你的姓名是？"}
        ]
        self.conversation_history = messages
        return messages[1]["content"]
    
    def process_message(self, user_message: str) -> Dict[str, Any]:
        """处理用户消息，返回 AI 回复和提取的字段"""
        self.conversation_history.append({
            "role": "user", 
            "content": user_message
        })
        
        # 调用 AI
        response = self.ai_service.chat(
            messages=self.conversation_history,
            model="qwen-plus",
            temperature=0.7
        )
        
        self.conversation_history.append({
            "role": "assistant",
            "content": response
        })
        
        # 提取字段
        extracted_fields = self._extract_fields(user_message, response)
        
        return {
            "reply": response,
            "extracted_fields": extracted_fields,
            "is_complete": self._check_completion(extracted_fields)
        }
    
    def _extract_fields(self, user_input: str, ai_response: str) -> Dict:
        """从对话中提取结构化字段"""
        # 使用 Function Calling 或解析
        extract_prompt = f"""
从以下对话中提取用户信息：

用户说：{user_input}
AI回复：{ai_response}

请提取以下JSON格式的信息：
{{
    "name": "姓名或null",
    "location": "城市或null",
    "target_position": "目标岗位或null",
    "education": "教育背景或null",
    "work_experience": "工作经历或null",
    "skills": ["技能列表"],
    "next_question": "下一问题或null(如果对话未完成)"
}}
"""
        response = self.ai_service.chat(
            messages=[{"role": "user", "content": extract_prompt}],
            model="qwen-plus"
        )
        
        try:
            # 尝试解析 JSON
            return json.loads(response)
        except:
            return {"raw_response": response}
    
    def _check_completion(self, fields: Dict) -> bool:
        """检查是否完成信息采集"""
        required = ["name", "location", "target_position"]
        return all(fields.get(f) for f in required)


class JDAnalyzer:
    """JD 解析模块 - Module B
    
    按 PRD 6.2章设计
    """
    
    SYSTEM_PROMPT = """你是 JD 分析专家，将招聘文本解析为结构化能力需求模型。

输出字段：
- job_title: 职位名称
- company_name: 公司名称
- location: 工作地点
- salary_range: 薪资范围
- required_skills: 必需技能列表 (name, level, weight)
- soft_skills: 软技能列表
- min_experience_years: 最低工作经验
- education_requirement: 学历要求
- top_keywords: Top20关键词 (keyword, importance)
- hidden_requirements: 隐性要求

请严格按照 JSON 格式输出。"""
    
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
    
    def analyze(self, jd_text: str) -> Dict[str, Any]:
        """解析 JD 文本"""
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user", "content": f"请解析以下 JD：\n\n{jd_text}"}
        ]
        
        response = self.ai_service.chat(
            messages=messages,
            model="qwen-plus"
        )
        
        try:
            result = json.loads(response)
            return result
        except:
            # 如果解析失败，返回原始文本
            return {"raw_response": response, "error": "Parse failed"}


class MatchEngine:
    """匹配引擎 - Module C
    
    按 PRD 6.3章设计
    五维度匹配评分
    """
    
    # 岗位类型权重配置
    WEIGHT_CONFIG = {
        "tech": {
            "tech_skills": 0.35,
            "experience": 0.25,
            "education": 0.15,
            "soft_skills": 0.15,
            "keywords": 0.10
        },
        "product": {
            "tech_skills": 0.20,
            "experience": 0.30,
            "education": 0.15,
            "soft_skills": 0.25,
            "keywords": 0.10
        },
        "sales": {
            "tech_skills": 0.10,
            "experience": 0.35,
            "education": 0.10,
            "soft_skills": 0.35,
            "keywords": 0.10
        }
    }
    
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
    
    def calculate_match(
        self, 
        user_profile: Dict, 
        jd_result: Dict,
        job_type: str = "tech"
    ) -> Dict[str, Any]:
        """计算匹配度"""
        weights = self.WEIGHT_CONFIG.get(job_type, self.WEIGHT_CONFIG["tech"])
        
        # 1. 精确匹配层 - 技能匹配
        tech_skill_score = self._calc_tech_skill_match(
            user_profile.get("skills", []),
            jd_result.get("required_skills", [])
        )
        
        # 2. 语义匹配层 - 经验相关性
        experience_score = self._calc_experience_match(
            user_profile.get("work_experiences", []),
            jd_result
        )
        
        # 3. 教育背景匹配
        education_score = self._calc_education_match(
            user_profile.get("educations", []),
            jd_result.get("education_requirement")
        )
        
        # 4. 软技能匹配
        soft_skill_score = self._calc_soft_skill_match(
            user_profile.get("skills", []),
            jd_result.get("soft_skills", [])
        )
        
        # 5. 关键词覆盖
        keyword_score = self._calc_keyword_match(
            user_profile,
            jd_result.get("top_keywords", [])
        )
        
        # 计算总分
        overall_score = int(
            tech_skill_score * weights["tech_skills"] +
            experience_score * weights["experience"] +
            education_score * weights["education"] +
            soft_skill_score * weights["soft_skills"] +
            keyword_score * weights["keywords"]
        )
        
        # 生成建议
        recommendation = self._generate_recommendation(overall_score, jd_result)
        
        return {
            "overall_score": overall_score,
            "scores": {
                "tech_skills": {"score": tech_skill_score, "max": 35},
                "experience": {"score": experience_score, "max": 25},
                "education": {"score": education_score, "max": 15},
                "soft_skills": {"score": soft_skill_score, "max": 15},
                "keywords": {"score": keyword_score, "max": 10}
            },
            "recommendation": recommendation,
            "gap_items": self._identify_gaps(user_profile, jd_result)
        }
    
    def _calc_tech_skill_match(self, user_skills: List, jd_skills: List) -> int:
        """计算技术技能匹配"""
        if not jd_skills:
            return 25
        user_skill_names = [s.get("name", "").lower() for s in user_skills]
        matched = 0
        for js in jd_skills:
            if js.get("name", "").lower() in user_skill_names:
                matched += 1
        return int((matched / len(jd_skills)) * 35)
    
    def _calc_experience_match(self, experiences: List, jd: Dict) -> int:
        """计算经验匹配"""
        # TODO: 实现更复杂的经验匹配逻辑
        min_years = jd.get("min_experience_years", 0)
        if not experiences:
            return 5
        return min(25, len(experiences) * 8)
    
    def _calc_education_match(self, educations: List, requirement: str) -> int:
        """计算教育背景匹配"""
        degree_map = {"phd": 15, "master": 12, "bachelor": 10, "associate": 8, "other": 5}
        if not educations:
            return 5
        highest = educations[0].get("degree", "other")
        return degree_map.get(highest, 5)
    
    def _calc_soft_skill_match(self, user_skills: List, jd_skills: List) -> int:
        """计算软技能匹配"""
        user_soft = [s.get("name", "").lower() for s in user_skills if s.get("type") == "soft"]
        matched = sum(1 for js in jd_skills if js.lower() in user_soft)
        if not jd_skills:
            return 12
        return int((matched / len(jd_skills)) * 15)
    
    def _calc_keyword_match(self, profile: Dict, keywords: List) -> int:
        """计算关键词覆盖"""
        if not keywords:
            return 5
        # TODO: 实现更精确的关键词匹配
        return 5
    
    def _identify_gaps(self, profile: Dict, jd: Dict) -> List[Dict]:
        """识别能力缺口"""
        gaps = []
        user_skills = [s.get("name", "").lower() for s in profile.get("skills", [])]
        for skill in jd.get("required_skills", []):
            if skill.get("name", "").lower() not in user_skills:
                gaps.append({
                    "item": skill.get("name"),
                    "severity": skill.get("weight", 0.8) > 0.7 and "critical" or "important",
                    "suggestion": f"建议添加{skill.get('name')}相关经历或技能"
                })
        return gaps
    
    def _generate_recommendation(self, score: int, jd: Dict) -> Dict:
        """生成投递建议"""
        if score >= 70:
            return {
                "level": "strong",
                "label": "强烈推荐投递",
                "reason": f"你与{jd.get('job_title', '该岗位')}高度匹配，建议立即生成简历并投递"
            }
        elif score >= 50:
            return {
                "level": "conditional",
                "label": "优化后再投递",
                "reason": "匹配度良好，补充一些关键技能后投递成功率会更高"
            }
        else:
            return {
                "level": "not_recommended",
                "label": "暂不建议投递",
                "reason": "与岗位差距较大，建议先提升核心技能或寻找更匹配的岗位"
            }


class ResumeGenerator:
    """简历生成模块 - Module D
    
    按 PRD 6.4章设计
    """
    
    SYSTEM_PROMPT = """你是资深简历优化专家，基于用户真实经历和目标JD生成简历。

核心原则（不可逾越的底线）：
1. 真实性：只优化表达方式，绝不捏造数据、虚构经历、夸大职级
2. STAR法则：将模糊描述转化为"情境+任务+行动+结果"的量化表述
3. 关键词植入：将JD高权重关键词自然融入简历
4. ATS友好：单栏布局、标准日期格式

输出格式：JSON 格式的简历内容"""
    
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
    
    def generate(
        self,
        user_profile: Dict,
        jd_result: Dict,
        match_result: Dict,
        template_id: str = "default",
        strategy: str = "default"
    ) -> Dict:
        """生成简历"""
        prompt = f"""
请基于以下信息生成简历：

## 用户档案
{json.dumps(user_profile, ensure_ascii=False, indent=2)}

## 目标JD
{json.dumps(jd_result, ensure_ascii=False, indent=2)}

## 匹配结果
{json.dumps(match_result, ensure_ascii=False, indent=2)}

## 生成要求
- 模板：{template_id}
- 策略：{strategy}
- 长度：标准版（1-1.5页）

请生成JSON格式的简历内容，包含：
- header: 头部信息（姓名、联系方式等）
- summary: 个人简介
- experience: 工作经历（按相关性排序）
- education: 教育背景
- skills: 技能列表
- optimization_log: 优化操作日志
"""
        
        response = self.ai_service.chat(
            messages=[{"role": "user", "content": prompt}],
            model="qwen-max",
            temperature=0.5
        )
        
        try:
            resume_content = json.loads(response)
            return {
                "content": resume_content,
                "message": "Resume generated successfully"
            }
        except:
            return {
                "content": {"raw_response": response},
                "message": "Resume generated (parse pending)"
            }


# 降级策略
def get_ai_service(provider: str = "dashscope") -> AIService:
    """获取 AI 服务实例，支持降级"""
    try:
        return AIService(provider=provider)
    except Exception as e:
        print(f"AI service init failed: {e}, using fallback")
        return AIService(provider="dashscope")