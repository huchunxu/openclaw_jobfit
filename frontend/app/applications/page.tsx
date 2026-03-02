"use client";

import { useState } from "react";
import Link from "next/link";

export default function ApplicationsPage() {
  const [filter, setFilter] = useState("all");
  
  const mockApplications = [
    { id: 1, company: "字节跳动", position: "高级Python开发工程师", score: 85, status: "interview", date: "2026-03-01" },
    { id: 2, company: "阿里云", position: "后端开发工程师", score: 72, status: "screening", date: "2026-03-01" },
    { id: 3, company: "腾讯", position: "全栈工程师", score: 68, status: "pending", date: "2026-02-28" },
    { id: 4, company: "快手", position: "后端架构师", score: 45, status: "rejected", date: "2026-02-25" },
  ];

  const filteredApps = filter === "all" ? mockApplications : mockApplications.filter(app => app.status === filter);

  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter(a => a.status === "pending").length,
    interview: mockApplications.filter(a => a.status === "interview").length,
    offer: mockApplications.filter(a => a.status === "offer").length,
  };

  const statusMap: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    pending: { label: "待投递", color: "text-gray-600", bg: "bg-gray-100", icon: "⏳" },
    screening: { label: "筛选中", color: "text-yellow-600", bg: "bg-yellow-100", icon: "🔍" },
    interview: { label: "面试中", color: "text-green-600", bg: "bg-green-100", icon: "🤝" },
    offer: { label: "已Offer", color: "text-purple-600", bg: "bg-purple-100", icon: "🎉" },
    rejected: { label: "已拒绝", color: "text-red-600", bg: "bg-red-100", icon: "❌" },
  };

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
              <h1 className="text-xl font-bold">投递管理</h1>
            </div>
            <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition">
              + 新建投递
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">📊</div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-500">全部投递</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">⏳</div>
              <div>
                <div className="text-2xl font-bold text-gray-700">{stats.pending}</div>
                <div className="text-sm text-gray-500">待投递</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🤝</div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.interview}</div>
                <div className="text-sm text-gray-500">面试中</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">🎉</div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.offer}</div>
                <div className="text-sm text-gray-500">获得Offer</div>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选 */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "screening", "interview", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === s
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {s === "all" ? "全部" : statusMap[s]?.label || s}
            </button>
          ))}
        </div>

        {/* 投递列表 */}
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                    {app.company[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{app.position}</h3>
                    <p className="text-gray-500">{app.company} · {app.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      app.score >= 75 ? "text-green-600" : app.score >= 60 ? "text-yellow-600" : "text-red-600"
                    }`}>{app.score}</div>
                    <div className="text-xs text-gray-400">匹配分</div>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusMap[app.status].bg} ${statusMap[app.status].color}`}>
                    {statusMap[app.status].icon} {statusMap[app.status].label}
                  </span>
                  
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm">
                      查看简历
                    </button>
                    <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm">
                      详情
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 时间轴 */}
              <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm text-gray-500">
                <span>📤 投递 {app.date}</span>
                {app.status === "screening" || app.status === "interview" ? (
                  <>
                    <span>→</span>
                    <span>🔍 筛选中</span>
                  </>
                ) : null}
                {app.status === "interview" ? (
                  <>
                    <span>→</span>
                    <span>🤝 面试</span>
                  </>
                ) : null}
              </div>
            </div>
          ))}
          
          {filteredApps.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-medium mb-2">暂无投递记录</h3>
              <p className="text-gray-500 mb-4">开始投递岗位来追踪你的求职进度</p>
              <Link href="/jd/upload" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition">
                上传JD开始投递
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}