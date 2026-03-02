"use client";

import { useState } from "react";
import Link from "next/link";

// 模拟投递数据
const mockApplications = [
  { 
    id: 1, 
    company: "字节跳动", 
    position: "高级Python开发工程师", 
    match_score: 85,
    status: "interview",
    resume_version: "v1.2",
    sent_date: "2026-03-01",
    last_update: "2026-03-02"
  },
  { 
    id: 2, 
    company: "阿里云", 
    position: "后端开发工程师", 
    match_score: 72,
    status: "screening",
    resume_version: "v1.0",
    sent_date: "2026-03-01",
    last_update: "2026-03-02"
  },
  { 
    id: 3, 
    company: "腾讯", 
    position: "全栈工程师", 
    match_score: 68,
    status: "pending",
    resume_version: "v1.1",
    sent_date: "2026-02-28",
    last_update: "2026-02-28"
  },
  { 
    id: 4, 
    company: "快手", 
    position: "后端架构师", 
    match_score: 45,
    status: "rejected",
    resume_version: "v1.0",
    sent_date: "2026-02-25",
    last_update: "2026-02-27"
  },
];

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "待处理", color: "text-gray-600", bg: "bg-gray-100" },
  screening: { label: "筛选中", color: "text-yellow-600", bg: "bg-yellow-100" },
  interview: { label: "面试中", color: "text-green-600", bg: "bg-green-100" },
  offer: { label: "已Offer", color: "text-purple-600", bg: "bg-purple-100" },
  rejected: { label: "已拒绝", color: "text-red-600", bg: "bg-red-100" },
};

export default function ApplicationsPage() {
  const [filter, setFilter] = useState<string>("all");
  
  const filteredApps = filter === "all" 
    ? mockApplications 
    : mockApplications.filter(app => app.status === filter);

  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter(a => a.status === "pending").length,
    interview: mockApplications.filter(a => a.status === "interview").length,
    offer: mockApplications.filter(a => a.status === "offer").length,
    rejected: mockApplications.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                ← 返回
              </Link>
              <h1 className="text-xl font-bold">投递管理</h1>
            </div>
            <button className="btn-primary">
              + 新建投递
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
            <div className="text-sm text-gray-500">全部投递</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-sm text-gray-500">待处理</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.interview}</div>
            <div className="text-sm text-gray-500">面试中</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.offer}</div>
            <div className="text-sm text-gray-500">已Offer</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-500">已拒绝</div>
          </div>
        </div>

        {/* 筛选 */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "screening", "interview", "offer", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === s
                  ? "bg-indigo-600 text-white"
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
            <div key={app.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                    {app.company[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{app.position}</h3>
                    <p className="text-sm text-gray-500">{app.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      app.match_score >= 75 ? "text-green-600" :
                      app.match_score >= 50 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {app.match_score}
                    </div>
                    <div className="text-xs text-gray-500">匹配分</div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm ${statusMap[app.status].bg} ${statusMap[app.status].color}`}>
                    {statusMap[app.status].label}
                  </span>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div>投递: {app.sent_date}</div>
                    <div>更新: {app.last_update}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      查看简历
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      详情
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 时间轴 */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-500">投递 {app.sent_date}</span>
                  </div>
                  {app.status === "screening" || app.status === "interview" || app.status === "offer" ? (
                    <>
                      <span className="text-gray-300">→</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <span className="text-gray-500">筛选中</span>
                      </div>
                    </>
                  ) : null}
                  {app.status === "interview" || app.status === "offer" ? (
                    <>
                      <span className="text-gray-300">→</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-500">面试 {app.last_update}</span>
                      </div>
                    </>
                  ) : null}
                  {app.status === "offer" ? (
                    <>
                      <span className="text-gray-300">→</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span className="text-gray-500">获得Offer</span>
                      </div>
                    </>
                  ) : null}
                  {app.status === "rejected" ? (
                    <>
                      <span className="text-gray-300">→</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-gray-500">被拒 {app.last_update}</span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
          
          {filteredApps.length === 0 && (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-medium mb-2">暂无投递记录</h3>
              <p className="text-gray-500 mb-4">开始投递岗位来追踪你的求职进度</p>
              <Link href="/jd/upload" className="btn-primary inline-block">
                上传JD开始投递
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}