"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// 模拟数据
const mockStats = {
  totalMatches: 12,
  avgScore: 78,
  interviews: 3,
  offers: 1
};

const mockRecentMatches = [
  { id: 1, title: "高级Python开发工程师", company: "字节跳动", score: 85, date: "今天" },
  { id: 2, title: "后端开发工程师", company: "阿里云", score: 72, date: "昨天" },
  { id: 3, title: "全栈工程师", company: "快手", score: 68, date: "2天前" },
];

const quickActions = [
  { href: "/jd/upload", icon: "📋", title: "上传JD", desc: "解析招聘需求", color: "from-blue-500 to-blue-600" },
  { href: "/match/1", icon: "🎯", title: "岗位匹配", desc: "计算匹配度", color: "from-purple-500 to-purple-600" },
  { href: "/resume/generate", icon: "📄", title: "生成简历", desc: "AI定制简历", color: "from-green500 to-green-600" },
  { href: "/applications", icon: "📨", title: "投递管理", desc: "追踪进度", color: "from-orange-500 to-orange-600" },
  { href: "/stats", icon: "📊", title: "数据分析", desc: "求职统计", color: "from-pink-500 to-pink-600" },
  { href: "/profile", icon: "👤", title: "个人信息", desc: "完善档案", color: "from-indigo-500 to-indigo-600" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-xl">💼</span>
              </div>
              <h1 className="text-xl font-bold">JobFit 工作台</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition">
                <span>🔔</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span>张</span>
                </div>
                <span className="font-medium">张三</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* 欢迎卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">👋 你好，张三</h2>
          <p className="text-white/80">今天有 3 个新岗位匹配，等待你的投递！</p>
        </motion.div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {quickActions.map((action, idx) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={action.href}>
                <div className={`bg-gradient-to-br ${action.color} rounded-xl p-5 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer`}>
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <div className="font-semibold mb-1">{action.title}</div>
                  <div className="text-xs text-white/70">{action.desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧 - 统计数据 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "匹配岗位", value: mockStats.totalMatches, icon: "🎯", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "平均匹配分", value: mockStats.avgScore, icon: "📈", color: "text-green-600", bg: "bg-green-50" },
                { label: "面试机会", value: mockStats.interviews, icon: "🤝", color: "text-purple-600", bg: "bg-purple-50" },
                { label: "获得Offer", value: mockStats.offers, icon: "🎉", color: "text-orange-600", bg: "bg-orange-50" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="bg-white rounded-xl p-5 shadow-sm"
                >
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                    {stat.icon}
                  </div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* 最近匹配 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">最近匹配</h3>
                <Link href="/match" className="text-purple-600 text-sm hover:underline">查看全部 →</Link>
              </div>
              <div className="space-y-3">
                {mockRecentMatches.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-lg">🏢</span>
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.company} · {item.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-xl font-bold ${
                        item.score >= 75 ? 'text-green-600' : item.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{item.score}</div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.score >= 75 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{item.score >= 75 ? '推荐' : '可投递'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧 - 快捷入口 */}
          <div className="space-y-6">
            {/* 待办事项 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">📌 待办事项</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <div>
                    <div className="font-medium text-sm">完善个人信息</div>
                    <div className="text-xs text-gray-500">提升匹配精准度</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <div>
                    <div className="font-medium text-sm">投递 3 个岗位</div>
                    <div className="text-xs text-gray-500">今日目标</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <div>
                    <div className="font-medium text-sm">准备面试</div>
                    <div className="text-xs text-gray-500">字节跳动一面</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 求职小贴士 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="font-bold text-lg mb-3">💡 求职小贴士</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                今日推荐：投递匹配度 75+ 的岗位成功率更高！
                你的简历已针对 Python 技能进行优化，
                建议投递后端开发相关岗位。
              </p>
            </div>

            {/* 快捷导航 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">🚀 快捷入口</h3>
              <div className="space-y-2">
                <Link href="/collect" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <span>🤖</span>
                  <span className="text-sm">AI信息采集</span>
                </Link>
                <Link href="/share" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <span>📤</span>
                  <span className="text-sm">分享结果</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <span>⚙️</span>
                  <span className="text-sm">系统设置</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}