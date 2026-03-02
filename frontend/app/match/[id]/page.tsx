"use client";

import { useState } from "react";
import Link from "next/link";

export default function MatchDetail() {
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "experience" | "suggest">("overview");

  // 模拟匹配结果数据
  const matchResult = {
    id: 1,
    overall_score: 85,
    jd_title: "高级Python开发工程师",
    company: "字节跳动",
    location: "北京",
    salary: "25K-45K",
    
    // 各维度得分
    tech_skills_score: 28,
    tech_skills_max: 35,
    experience_score: 22,
    experience_max: 25,
    education_score: 15,
    education_max: 15,
    soft_skills_score: 12,
    soft_skills_max: 15,
    keywords_score: 8,
    keywords_max: 10,
    
    // 推荐
    recommendation_level: "strong",
    recommendation_label: "强烈推荐",
    recommendation_reason: "您的综合能力与该岗位高度匹配，具备很强的竞争力。核心技能Python、Django与岗位要求完美契合，工作经验也满足要求。",
    
    // 已匹配项
    matched_items: [
      { type: "tech_skill", item: "Python", match_level: "full", user_level: "expert" },
      { type: "tech_skill", item: "Django", match_level: "full", user_level: "proficient" },
      { type: "tech_skill", item: "MySQL", match_level: "partial", user_level: "proficient" },
      { type: "experience", item: "5年后端开发经验", match_level: "full" },
      { type: "soft_skill", item: "团队协作", match_level: "full" }
    ],
    
    // 缺口项
    gap_items: [
      { type: "tech_skill", item: "Docker", severity: "important", suggestion: "建议学习容器化技术" },
      { type: "tech_skill", item: "Redis", severity: "minor", suggestion: "可补充Redis缓存经验" },
      { type: "soft_skill", item: "项目管理", severity: "minor", suggestion: "可展示项目管理经验" }
    ],
    
    // 行动建议
    action_items: [
      "立即投递此岗位",
      "在简历中突出Python+Django项目经验",
      "准备Docker相关面试问题",
      "强调团队协作和解决问题的能力"
    ]
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = score / max;
    if (percentage >= 0.8) return "text-green-600";
    if (percentage >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number, max: number) => {
    const percentage = score / max;
    if (percentage >= 0.8) return "bg-green-100";
    if (percentage >= 0.6) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← 返回
            </Link>
            <h1 className="text-xl font-bold">匹配详情</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 顶部概览 */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{matchResult.jd_title}</h2>
              <p className="text-gray-600">{matchResult.company} · {matchResult.location} · {matchResult.salary}</p>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(matchResult.overall_score, 100)}`}>
                {matchResult.overall_score}
              </div>
              <div className="text-sm text-gray-500">综合匹配度</div>
            </div>
          </div>

          {/* 推荐标签 */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
            matchResult.recommendation_level === "strong" 
              ? "bg-green-100 text-green-700" 
              : "bg-yellow-100 text-yellow-700"
          }`}>
            <span className="text-xl">
              {matchResult.recommendation_level === "strong" ? "✅" : "⚠️"}
            </span>
            <span className="font-medium">{matchResult.recommendation_label}</span>
          </div>

          <p className="mt-4 text-gray-600">{matchResult.recommendation_reason}</p>
        </div>

        {/* 评分维度 */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">各维度评分</h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { name: "技术技能", score: matchResult.tech_skills_score, max: matchResult.tech_skills_max },
              { name: "工作经验", score: matchResult.experience_score, max: matchResult.experience_max },
              { name: "教育背景", score: matchResult.education_score, max: matchResult.education_max },
              { name: "软技能", score: matchResult.soft_skills_score, max: matchResult.soft_skills_max },
              { name: "关键词", score: matchResult.keywords_score, max: matchResult.keywords_max }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`text-2xl font-bold mb-1 ${getScoreColor(item.score, item.max)}`}>
                  {item.score}
                  <span className="text-sm text-gray-400">/{item.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${getScoreBg(item.score, item.max)}`}
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["overview", "skills", "experience", "suggest"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab === "overview" && "概览"}
              {tab === "skills" && "技能匹配"}
              {tab === "experience" && "经验对比"}
              {tab === "suggest" && "行动建议"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✓ 已匹配项</h4>
                <div className="space-y-2">
                  {matchResult.matched_items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <span>✓</span>
                      <span>{item.item}</span>
                      <span className="text-sm text-gray-500">({item.match_level})</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-yellow-600">⚠ 需要提升</h4>
                <div className="space-y-2">
                  {matchResult.gap_items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <span>{item.item}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                          item.severity === "important" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {item.severity === "important" ? "重要" : "次要"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <h4 className="font-semibold mb-4">技能匹配详情</h4>
              <div className="space-y-3">
                {matchResult.matched_items.filter((i: any) => i.type === "tech_skill").map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{item.item}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                      {item.match_level === "full" ? "完全匹配" : "部分匹配"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div>
              <h4 className="font-semibold mb-4">经验对比</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>要求</span>
                  <span>您的经历</span>
                </div>
                <div className="flex justify-between">
                  <span>3年+ 后端开发</span>
                  <span className="text-green-600">5年 ✓</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "suggest" && (
            <div>
              <h4 className="font-semibold mb-4">行动建议</h4>
              <div className="space-y-3">
                {matchResult.action_items.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="flex gap-4 mt-6">
          <Link href="/resume/generate" className="btn-primary flex-1 text-center">
            生成简历
          </Link>
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            保存结果
          </button>
        </div>
      </div>
    </div>
  );
}