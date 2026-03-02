"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// 模拟数据
const mockMatchResults = [
  { id: 1, jd_title: "高级Python开发工程师", company: "字节跳动", score: 85, level: "strong", date: "2026-03-01" },
  { id: 2, jd_title: "后端开发工程师", company: "阿里云", score: 72, level: "conditional", date: "2026-03-01" },
  { id: 3, jd_title: "全栈工程师", company: "快手", score: 68, level: "conditional", date: "2026-02-28" },
];

const mockResumes = [
  { id: 1, jd_title: "高级Python开发工程师", version: "v1.2", date: "2026-03-01" },
  { id: 2, jd_title: "后端开发工程师", version: "v1.0", date: "2026-02-28" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"match" | "resume" | "profile">("match");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">JobFit 工作台</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">欢迎，张三</span>
            <button className="text-gray-500 hover:text-gray-700">退出</button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 快捷操作 */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Link href="/jd/upload">
            <motion.div whileHover={{ scale: 1.02 }} className="card cursor-pointer hover:shadow-md">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold">上传JD</h3>
              <p className="text-sm text-gray-500">解析招聘需求</p>
            </motion.div>
          </Link>
          <Link href="/collect">
            <motion.div whileHover={{ scale: 1.02 }} className="card cursor-pointer hover:shadow-md">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold">信息采集</h3>
              <p className="text-sm text-gray-500">对话完善档案</p>
            </motion.div>
          </Link>
          <Link href="/match">
            <motion.div whileHover={{ scale: 1.02 }} className="card cursor-pointer hover:shadow-md">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold">岗位匹配</h3>
              <p className="text-sm text-gray-500">计算匹配度</p>
            </motion.div>
          </Link>
          <Link href="/applications">
            <motion.div whileHover={{ scale: 1.02 }} className="card cursor-pointer hover:shadow-md">
              <div className="text-3xl mb-2">📨</div>
              <h3 className="font-semibold">投递管理</h3>
              <p className="text-sm text-gray-500">追踪求职进度</p>
            </motion.div>
          </Link>
          <Link href="/stats">
            <motion.div whileHover={{ scale: 1.02 }} className="card cursor-pointer hover:shadow-md">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold">数据分析</h3>
              <p className="text-sm text-gray-500">求职统计分析</p>
            </motion.div>
          </Link>
          <Link href="/settings">
            <motion.div whileHover={{ scale: 1.02 }} className="card cursor-pointer hover:shadow-md">
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="font-semibold">设置</h3>
              <p className="text-sm text-gray-500">通知与隐私</p>
            </motion.div>
          </Link>
          <Link href="/resume/generate">
            <motion.div whileHover={{ scale: 1.02 }} className="card cursor-pointer hover:shadow-md">
              <div className="text-3xl mb-2">📄</div>
              <h3 className="font-semibold">生成简历</h3>
              <p className="text-sm text-gray-500">AI定制简历</p>
            </motion.div>
          </Link>
          <Link href="/profile">
            <motion.div whileHover={{ scale: 1.02 }} className="card cursor-pointer hover:shadow-md">
              <div className="text-3xl mb-2">👤</div>
              <h3 className="font-semibold">个人信息</h3>
              <p className="text-sm text-gray-500">完善档案</p>
            </motion.div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("match")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "match" 
                ? "bg-indigo-600 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            匹配记录
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "resume" 
                ? "bg-indigo-600 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            我的简历
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "profile" 
                ? "bg-indigo-600 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            档案信息
          </button>
        </div>

        {/* Content */}
        <div className="card">
          {activeTab === "match" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">匹配记录</h2>
              <div className="space-y-4">
                {mockMatchResults.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.jd_title}</h3>
                      <p className="text-sm text-gray-500">{item.company} · {item.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          item.score >= 75 ? "text-green-600" : 
                          item.score >= 50 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {item.score}
                        </div>
                        <div className="text-xs text-gray-500">匹配分</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.level === "strong" ? "bg-green-100 text-green-700" :
                        item.level === "conditional" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {item.level === "strong" ? "强烈推荐" : "可投递"}
                      </span>
                      <Link 
                        href={`/match/${item.id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                      >
                        查看详情 →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "resume" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">我的简历</h2>
              <div className="space-y-4">
                {mockResumes.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.jd_title}</h3>
                      <p className="text-sm text-gray-500">版本 {item.version} · {item.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                        下载PDF
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                        下载Word
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">个人信息</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <input type="text" defaultValue="张三" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                  <input type="tel" defaultValue="138****8888" className="input-field" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">所在城市</label>
                  <input type="text" defaultValue="北京" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目标岗位</label>
                  <input type="text" defaultValue="高级Python开发工程师" className="input-field" />
                </div>
              </div>
              <div className="mt-6">
                <button className="btn-primary">保存修改</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}