"""
对话式信息采集 - 15问精简版
按 PRD 6.1章设计
"""

from typing import Dict, List, Optional
from backend.services.ai_service import AIService


class ProfileCollector:
    """
    对话式信息采集模块
    
    按 PRD 设计：15问精简版
    1. 基本信息 (3问)
    2. 求职意向 (2问)
    3. 教育背景 (2问)
    4. 工作经历 (4问×循环)
    5. 技能 (2问)
    6. 自我介绍 (1问生成)
    """
    
    # 问题配置
    QUESTIONS = {
        # 基本信息 (3问)
        "name": {
            "question": "你好！我是 JobFit 助手小 Fit～请问你的姓名是？",
            "field": "basic_info.name",
            "required": True
        },
        "location": {
            "question": "很高兴认识你！请问你目前所在的城市是？",
            "field": "basic_info.location",
            "required": True
        },
        "birth_year": {
            "question": "请问你的出生年份是多少？",
            "field": "basic_info.birth_year",
            "required": False
        },
        
        # 求职意向 (2问)
        "target_position": {
            "question": "你目前正在寻找什么岗位呢？",
            "field": "job_intention.target_positions",
            "required": True
        },
        "job_type": {
            "question": "你期望的工作类型是？全职、兼职还是实习？",
            "field": "job_intention.job_type",
            "required": True
        },
        
        # 教育背景 (2问)
        "education_1": {
            "question": "请介绍一下你的最高学历（学校、专业、学历层次）？",
            "field": "educations[0]",
            "required": True
        },
        "education_gpa": {
            "question": "你的GPA是多少？（如不记得或不想说可以跳过）",
            "field": "educations[0].gpa",
            "required": False
        },
        
        # 工作经历 (循环询问)
        "work_company": {
            "question": "请告诉我你的工作经历。之前或现在工作的公司名称是？",
            "field": "work_experiences[-1].company_name",
            "required": True
        },
        "work_position": {
            "question": "你在该公司担任的职位是？",
            "field": "work_experiences[-1].position",
            "required": True
        },
        "work_duration": {
            "question": "你在这家公司的起止时间是什么时候？（格式如：2020.01-2023.12）",
            "field": "work_experiences[-1].duration",
            "required": True
        },
        "work_achievements": {
            "question": "你在工作期间有哪些主要成就或负责的项目？可以简单描述一下",
            "field": "work_experiences[-1].achievements",
            "required": False
        },
        
        # 技能 (2问)
        "tech_skills": {
            "question": "你擅长哪些技术技能？（如编程语言、工具、框架等）",
            "field": "skills.tech",
            "required": True
        },
        "soft_skills": {
            "question": "你有哪些软技能？（如沟通、团队协作、项目管理等）",
            "field": "skills.soft",
            "required": False
        },
    }
    
    def __init__(self):
        self.ai = AIService()
        self.user_profile = {
            "basic_info": {},
            "job_intention": {},
            "educations": [],
            "work_experiences": [],
            "projects": [],
            "skills": {"tech": [], "soft": []}
        }
        self.current_step = 0
        self.conversation_history = []
    
    def get_next_question(self) -> Dict:
        """获取下一个问题"""
        steps = [
            "name", "location", "birth_year",
            "target_position", "job_type",
            "education_1", "education_gpa",
            "work_company", "work_position", "work_duration", "work_achievements",
            "tech_skills", "soft_skills"
        ]
        
        if self.current_step >= len(steps):
            return {
                "is_complete": True,
                "question": None,
                "profile": self.user_profile
            }
        
        step_key = steps[self.current_step]
        question_config = self.QUESTIONS.get(step_key, {})
        
        return {
            "is_complete": False,
            "step": self.current_step + 1,
            "total_steps": len(steps),
            "question": question_config.get("question", ""),
            "field": question_config.get("field", ""),
            "required": question_config.get("required", False)
        }
    
    def process_answer(self, answer: str) -> Dict:
        """处理用户回答"""
        # 添加到对话历史
        self.conversation_history.append({
            "role": "user",
            "content": answer
        })
        
        # 提取并存储回答
        question_info = self.get_next_question()
        if not question_info.get("is_complete"):
            self._store_answer(question_info["field"], answer)
        
        # 推进到下一步
        self.current_step += 1
        
        # 生成回复
        reply = self._generate_reply(answer, question_info)
        self.conversation_history.append({
            "role": "assistant", 
            "content": reply
        })
        
        # 获取下一步问题
        next_q = self.get_next_question()
        
        return {
            "reply": reply,
            "next_question": next_q.get("question"),
            "is_complete": next_q.get("is_complete", False),
            "progress": f"{self.current_step}/{len(self.QUESTIONS)}"
        }
    
    def _store_answer(self, field: str, value: str):
        """存储回答到用户档案"""
        try:
            # 解析字段路径
            if "." in field:
                parts = field.split(".")
                if "[" in parts[-1] and "]" in parts[-1]:
                    # 数组字段
                    array_field = parts[-1].split("[")[0]
                    obj = self.user_profile
                    for p in parts[:-1]:
                        if p not in obj:
                            obj[p] = {} if "[" not in p else []
                        obj = obj[p]
                    
                    if isinstance(obj, list):
                        if len(obj) == 0:
                            obj.append({})
                        # 存储值
                        key = array_field
                        obj[-1][key] = value
                else:
                    # 普通嵌套字段
                    obj = self.user_profile
                    for p in parts[:-1]:
                        if p not in obj:
                            obj[p] = {}
                        obj = obj[p]
                    obj[parts[-1]] = value
            else:
                # 顶层字段
                self.user_profile[field] = value
        except Exception as e:
            print(f"存储回答失败: {e}")
    
    def _generate_reply(self, answer: str, question_info: Dict) -> str:
        """生成回复"""
        replies = [
            "很好！感谢分享～",
            "了解了！",
            "收到！",
            "好的，让我记录下来",
            "明白了！"
        ]
        
        # 根据问题类型生成更智能的回复
        field = question_info.get("field", "")
        
        if "name" in field:
            return f"你好 {answer}！很高兴认识你～"
        elif "location" in field:
            return f"好的，你在 {answer} 发展。让我继续了解你的求职意向～"
        elif "target_position" in field:
            return f"明白了，你想找 {answer} 相关的岗位。接下来看看你的工作经历～"
        elif "tech_skills" in field:
            return f"你擅长 {answer}，这些技能很热门！最后让我了解一下你的软技能～"
        
        import random
        return random.choice(replies)
    
    def generate_summary(self) -> str:
        """生成自我介绍"""
        basic = self.user_profile.get("basic_info", {})
        job = self.user_profile.get("job_intention", {})
        skills = self.user_profile.get("skills", {})
        
        name = basic.get("name", "")
        location = basic.get("location", "")
        position = job.get("target_positions", [""])[0]
        tech = ", ".join(skills.get("tech", [])[:5])
        
        summary = f"{name}，{location}人士，{position}。拥有{tech}等技能。"
        
        # 使用AI优化
        prompt = f"根据以下信息生成一段专业的个人简介（100字以内）：\n\n{summary}\n\n要求：突出优势，专业有吸引力"
        
        try:
            messages = [{"role": "user", "content": prompt}]
            result = self.ai.chat(messages, model="qwen-plus")
            return result.strip()
        except:
            return summary


# 测试
if __name__ == "__main__":
    collector = ProfileCollector()
    
    # 模拟对话流程
    print("=== 开始信息采集 ===\n")
    
    while True:
        q = collector.get_next_question()
        if q.get("is_complete"):
            print("\n=== 采集完成 ===")
            print(f"用户档案: {collector.user_profile}")
            break
        
        print(f"[{q['step']}/{q['total_steps']}] {q['question']}")
        
        # 模拟用户回答
        answers = {
            "name": "张三",
            "location": "北京",
            "birth_year": "1995",
            "target_position": "Python开发工程师",
            "job_type": "full_time",
            "education_1": "清华大学，计算机科学，本科",
            "education_gpa": "3.8",
            "work_company": "字节跳动",
            "work_position": "高级后端开发工程师",
            "work_duration": "2021.03-至今",
            "work_achievements": "负责用户增长系统，QPS提升50%",
            "tech_skills": "Python, Django, MySQL, Redis, Docker",
            "soft_skills": "团队协作、沟通能力、项目管理"
        }
        
        answer = answers.get(f"work_achievements" if "work" in q.get("field", "") else 
                            f"tech_skills" if "tech" in q.get("field", "") else
                            q.get("field", "").split(".")[-1], "...")
        
        if q["step"] <= len(answers):
            result = collector.process_answer(answer)
            print(f"→ 用户: {answer}")
            print(f"→ AI: {result['reply']}")
            print(f"→ 进度: {result['progress']}\n")