"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  // 模拟统计数据
  const stats = {
    totalApplications: 12,
    totalMatches: 8,
    avgMatchScore: 72,
    interviewRate: 25,
    offers: 2,
    
    // 投递趋势
    applicationTrend: [
      { date: "01/01", count: 2 },
      { date: "01/08", count: 3 },
      { date: "01/15", count: 1 },
      { date: "01/22", count: 4 },
      { date: "01/29", count: 2 },
    ],
    
    // 匹配度分布
    scoreDistribution: [
      { range: "90+", count: 1 },
      { range: "80-89", count: 3 },
      { range: "70-79", count: 4 },
      { range: "60-69", count: 2 },
      { range: "<60", count: 2 },
    ],
    
    // 投递公司分布
    companyDistribution: [
      { company: "字节跳动", count: 3 },
      { company: "阿里云", count: 2 },
      { company: "腾讯", count: 2 },
      { company: "快手", count: 2 },
      { company: "其他", count: 3 },
    ],
    
    // 面试记录
    interviews: [
      { company: "字节跳动", position: "Python开发", date: "2026-03-01", status: "pending" },
      { company: "阿里云", position: "后端开发", date: "2026-02-28", status: "passed" },
    ],
  };

  const maxTrend = Math.max(...stats.applicationTrend.map(d => d.count));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← 返回
            </Link>
            <h1 className="text-xl font-bold">数据分析</h1>
          </div>
          <div className="flex gap-2">
            {(["week", "month", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  timeRange === range 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {range === "week" ? "本周" : range === "month" ? "本月" : "全部"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 核心指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-indigo-600">{stats.totalApplications}</div>
            <div className="text-sm text-gray-500">投递总数</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalMatches}</div>
            <div className="text-sm text-gray-500">匹配岗位</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.avgMatchScore}</div>
            <div className="text-sm text-gray-500">平均匹配分</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.interviewRate}%</div>
            <div className="text-sm text-gray-500">面试转化率</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 投递趋势 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">投递趋势</h2>
            <div className="h-48 flex items-end justify-between gap-2">
              {stats.applicationTrend.map((d, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.count / maxTrend) * 100}%` }}
                    transition={{ delay: idx * 0.1 }}
                    className="w-full bg-indigo-600 rounded-t"
                  />
                  <div className="text-xs text-gray-500 mt-2">{d.date}</div>
                  <div className="text-sm font-medium">{d.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 匹配度分布 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">匹配度分布</h2>
            <div className="space-y-3">
              {stats.scoreDistribution.map((d, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-gray-600">{d.range}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        parseInt(d.range) >= 80 ? "bg-green-500" :
                        parseInt(d.range) >= 60 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${(d.count / stats.totalApplications) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-right">{d.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 公司分布 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">投递公司分布</h2>
            <div className="space-y-3">
              {stats.companyDistribution.map((d, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-medium truncate">{d.company}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(d.count / stats.totalApplications) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-right">{d.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 面试安排 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">近期面试</h2>
            <div className="space-y-3">
              {stats.interviews.map((interview, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{interview.company}</div>
                    <div className="text-sm text-gray-500">{interview.position}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{interview.date}</div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      interview.status === "pending" 
                        ? "bg-yellow-100 text-yellow-700" 
                        : interview.status === "passed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {interview.status === "pending" ? "待面试" : 
                       interview.status === "passed" ? "已通过" : "未通过"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 建议 */}
        <div className="card mt-6">
          <h2 className="text-lg font-semibold mb-4">💡 优化建议</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-green-600">✓</span>
              <div>
                <div className="font-medium text-green-700">投递策略良好</div>
                <div className="text-sm text-gray-600">你的平均匹配分72分，建议继续投递75分以上的岗位</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600">💡</span>
              <div>
                <div className="font-medium text-blue-700">面试转化提升</div>
                <div className="text-sm text-gray-600">面试转化率25%，建议加强面试准备</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600">⚠</span>
              <div>
                <div className="font-medium text-yellow-700">技能栈拓展</div>
                <div className="text-sm text-gray-600">建议加强Docker和Redis技能，提升匹配度</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}