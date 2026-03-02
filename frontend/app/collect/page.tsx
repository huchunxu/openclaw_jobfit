"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatCollectPage() {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "你好！我是 JobFit 助手小 Fit～请问你的姓名是？" }
  ]);
  const [input, setInput] = useState("");

  const questions = [
    { key: "name", question: "请问你的姓名是？", field: "name" },
    { key: "location", question: "你目前所在的城市是？", field: "location" },
    { key: "birth_year", question: "请问你的出生年份是多少？", field: "birth_year" },
    { key: "target_position", question: "你目前正在寻找什么岗位呢？", field: "target_position" },
    { key: "job_type", question: "你期望的工作类型是？全职/兼职/实习？", field: "job_type" },
    { key: "education", question: "请介绍一下你的最高学历（学校、专业、学历）？", field: "education" },
    { key: "company", question: "请告诉我你之前或现在工作的公司名称？", field: "company" },
    { key: "position", question: "你在该公司担任的职位是？", field: "position" },
    { key: "duration", question: "你在这家公司的起止时间是什么时候？", field: "duration" },
    { key: "achievements", question: "你在工作期间有哪些主要成就？", field: "achievements" },
    { key: "tech_skills", question: "你擅长哪些技术技能？", field: "tech_skills" },
    { key: "soft_skills", question: "你有哪些软技能？", field: "soft_skills" },
  ];

  const quickAnswers: Record<string, string[]> = {
    location: ["北京", "上海", "广州", "深圳", "杭州", "南京"],
    job_type: ["全职", "兼职", "实习"],
    education: ["本科", "硕士", "博士", "大专"],
    target_position: ["Python开发", "Java开发", "前端开发", "产品经理", "数据分析师"],
    tech_skills: ["Python", "Java", "JavaScript", "MySQL", "Redis", "Docker"],
    soft_skills: ["团队协作", "沟通能力", "项目管理", "解决问题"],
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    // 模拟AI回复
    setTimeout(() => {
      const nextStep = step + 1;
      if (nextStep < questions.length) {
        setStep(nextStep);
        setMessages([
          ...newMessages,
          { role: "assistant", content: questions[nextStep].question }
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "太棒了！信息采集完成～你的档案已保存！现在我们可以开始求职之旅了！" }
        ]);
      }
    }, 500);
  };

  const handleQuickAnswer = (answer: string) => {
    setInput(answer);
    handleSend();
  };

  const currentQuestion = questions[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-indigo-600">信息采集</h1>
          <p className="text-sm text-gray-500">Step {step + 1} / {questions.length}</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* 对话区域 */}
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === "assistant" 
                    ? "bg-white shadow-md rounded-tl-none" 
                    : "bg-indigo-600 text-white rounded-tr-none"
                }`}>
                  <p>{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 快捷选项 */}
        {currentQuestion && quickAnswers[currentQuestion.key] && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">快捷选择：</p>
            <div className="flex flex-wrap gap-2">
              {quickAnswers[currentQuestion.key].map((ans) => (
                <button
                  key={ans}
                  onClick={() => handleQuickAnswer(ans)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 输入框 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="输入你的回答..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            发送
          </button>
        </div>

        {/* 跳过按钮 */}
        {step > 0 && (
          <button
            onClick={() => {
              const nextStep = step + 1;
              if (nextStep < questions.length) {
                setStep(nextStep);
                setMessages([...messages, { role: "assistant", content: questions[nextStep].question }]);
              }
            }}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            跳过这个问题 →
          </button>
        )}
      </div>
    </div>
  );
}