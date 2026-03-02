"use client";

import { useState } from "react";
import Link from "next/link";

export default function MatchDetail() {
  const [activeTab, setActiveTab] = useState("overview");

  const matchResult = {
    overall_score: 85,
    jd_title: "高级Python开发工程师",
    company: "字节跳动",
    location: "北京",
    salary: "25K-45K",
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
    recommendation_level: "strong",
    recommendation_label: "强烈推荐",
    recommendation_reason: "您的综合能力与该岗位高度匹配，具备很强的竞争力。",
    matched_items: [
      { item: "Python", level: "full" },
      { item: "Django", level: "full" },
      { item: "MySQL", level: "partial" },
      { item: "5年经验", level: "full" },
    ],
    gap_items: [
      { item: "Docker", severity: "important" },
      { item: "Redis", severity: "minor" },
    ],
    action_items: [
      "立即投递此岗位",
      "突出Python+Django项目经验",
      "准备Docker面试问题",
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-white/80 hover:text-white flex items-center gap-2">
                ← 返回
              </Link>
              <h1 className="text-xl font-bold">匹配详情</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* 顶部卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{matchResult.jd_title}</h2>
              <p className="text-gray-500">{matchResult.company} · {matchResult.location} · {matchResult.salary}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                {matchResult.overall_score}
              </div>
              <div className="text-sm text-gray-500">综合匹配度</div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl ${
            matchResult.recommendation_level === "strong" 
              ? "bg-green-100 text-green-700" 
              : "bg-yellow-100 text-yellow-700"
          }`}>
            <span className="text-2xl">{matchResult.recommendation_level === "strong" ? "✅" : "💡"}</span>
            <span className="font-semibold">{matchResult.recommendation_label}</span>
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{matchResult.recommendation_reason}</p>
        </div>

        {/* 评分维度 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold mb-6">各维度评分</h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { name: "技术技能", score: matchResult.tech_skills_score, max: matchResult.tech_skills_max, color: "from-blue-500 to-blue-600" },
              { name: "工作经验", score: matchResult.experience_score, max: matchResult.experience_max, color: "from-green-500 to-green-600" },
              { name: "教育背景", score: matchResult.education_score, max: matchResult.education_max, color: "from-purple-500 to-purple-600" },
              { name: "软技能", score: matchResult.soft_skills_score, max: matchResult.soft_skills_max, color: "from-orange-500 to-orange-600" },
              { name: "关键词", score: matchResult.keywords_score, max: matchResult.keywords_max, color: "from-pink-500 to-pink-600" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle 
                      cx="40" cy="40" r="35" 
                      stroke="url(#gradient)" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray={`${(item.score / item.max) * 220} 220`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{item.score}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 已匹配项 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-green-500">✓</span> 已匹配项
            </h3>
            <div className="space-y-3">
              {matchResult.matched_items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-green-600">✓</span>
                  <span className="font-medium">{item.item}</span>
                  <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {item.level === "full" ? "完全匹配" : "部分匹配"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 待提升 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-yellow-500">!</span> 待提升
            </h3>
            <div className="space-y-3">
              {matchResult.gap_items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                  <span>{item.item}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.severity === "important" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {item.severity === "important" ? "重要" : "次要"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 行动建议 */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-bold mb-4">🚀 行动建议</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {matchResult.action_items.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl">
                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                  {idx + 1}
                </span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex gap-4 mt-8">
          <Link href="/resume/generate" className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl text-center hover:shadow-lg transition-all">
            📄 生成简历
          </Link>
          <button className="px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            💾 保存结果
          </button>
        </div>
      </div>
    </div>
  );
}