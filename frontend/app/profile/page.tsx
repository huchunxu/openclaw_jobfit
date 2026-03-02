"use client";

import { useState } from "react";
import Link from "next/link";

export default function Profile() {
  const [activeSection, setActiveSection] = useState("basic");
  
  const [profile, setProfile] = useState({
    name: "张三",
    gender: "男",
    birth_year: 1995,
    location: "北京",
    github_url: "https://github.com/zhangsan",
    target_positions: ["高级Python开发工程师"],
    salary_range_min: 30000,
    salary_range_max: 50000,
    job_type: "full_time",
  });

  const sections = [
    { id: "basic", name: "基本信息", icon: "👤" },
    { id: "job", name: "求职意向", icon: "🎯" },
    { id: "education", name: "教育背景", icon: "🎓" },
    { id: "work", name: "工作经历", icon: "💼" },
    { id: "skills", name: "技能证书", icon: "🛠️" },
  ];

  const educations = [
    { school: "清华大学", major: "计算机科学", degree: "本科", period: "2013-2017" }
  ];

  const works = [
    { company: "字节跳动", position: "高级后端开发工程师", period: "2021-至今", achievements: ["QPS提升50%", "用户增长系统"] }
  ];

  const skills = [
    { name: "Python", level: "专家" },
    { name: "Django", level: "熟练" },
    { name: "MySQL", level: "熟练" },
    { name: "Redis", level: "熟悉" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                ← 返回
              </Link>
              <h1 className="text-xl font-bold">个人信息</h1>
            </div>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
              保存
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* 左侧导航 */}
          <div className="w-56">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    activeSection === section.id
                      ? "bg-purple-600 text-white shadow-md"
                      : "hover:bg-white"
                  }`}
                >
                  <span>{section.icon}</span>
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            {/* 基本信息 */}
            {activeSection === "basic" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-6">基本信息</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
                    <select
                      value={profile.gender}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option>男</option>
                      <option>女</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">出生年份</label>
                    <input
                      type="number"
                      value={profile.birth_year}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">所在城市</label>
                    <input
                      type="text"
                      value={profile.location}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={profile.github_url}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 求职意向 */}
            {activeSection === "job" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-6">求职意向</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目标岗位</label>
                    <input
                      type="text"
                      value={profile.target_positions}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">期望薪资</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={profile.salary_range_min}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="number"
                          value={profile.salary_range_max}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">工作类型</label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none">
                        <option>全职</option>
                        <option>兼职</option>
                        <option>实习</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 教育背景 */}
            {activeSection === "education" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">教育背景</h2>
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition">
                    + 添加
                  </button>
                </div>
                <div className="space-y-4">
                  {educations.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{edu.school}</h3>
                        <span className="text-sm text-gray-500">{edu.period}</span>
                      </div>
                      <p className="text-gray-600">{edu.major} · {edu.degree}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 工作经历 */}
            {activeSection === "work" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">工作经历</h2>
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition">
                    + 添加
                  </button>
                </div>
                <div className="space-y-4">
                  {works.map((work, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{work.company}</h3>
                          <p className="text-sm text-gray-600">{work.position}</p>
                        </div>
                        <span className="text-sm text-gray-500">{work.period}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {work.achievements.map((a, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 技能 */}
            {activeSection === "skills" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">技能证书</h2>
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition">
                    + 添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full border border-purple-100">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-purple-600">{skill.level}</span>
                      <button className="ml-2 text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}