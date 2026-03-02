"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ShareCardPage() {
  const [copied, setCopied] = useState(false);

  // 模拟匹配数据
  const matchData = {
    jd_title: "高级Python开发工程师",
    company: "字节跳动",
    location: "北京",
    salary: "25K-45K",
    overall_score: 85,
    matched_items: ["Python", "Django", "MySQL", "团队协作"],
    gap_items: ["Docker", "Redis"],
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://jobfit.example.com/invite/abc123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveImage = () => {
    alert("长按图片保存或截图分享");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← 返回
            </Link>
            <h1 className="text-xl font-bold">分享匹配结果</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* 分享卡片预览 */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6"
          >
            {/* 卡片头部 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <span className="font-medium">我的岗位匹配报告</span>
              </div>
              <h2 className="text-xl font-bold">{matchData.jd_title}</h2>
              <p className="text-indigo-100">{matchData.company} · {matchData.location}</p>
            </div>

            {/* 匹配分数 */}
            <div className="p-6 text-center">
              <div className="text-sm text-gray-500 mb-2">综合匹配度</div>
              <div className="relative inline-block">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#4F46E5"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${matchData.overall_score * 3.52} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-indigo-600">{matchData.overall_score}</span>
                </div>
              </div>
            </div>

            {/* 匹配详情 */}
            <div className="px-6 pb-6">
              <div className="space-y-3">
                {/* 已匹配 */}
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <div>
                    <div className="text-sm font-medium text-green-600">已匹配</div>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-1">
                      {matchData.matched_items.map((item, idx) => (
                        <span key={idx} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 待提升 */}
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500">!</span>
                  <div>
                    <div className="text-sm font-medium text-yellow-600">待提升</div>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-1">
                      {matchData.gap_items.map((item, idx) => (
                        <span key={idx} className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部 */}
            <div className="bg-gray-50 px-6 py-4 text-center">
              <div className="text-sm text-gray-500">由 JobFit AI 生成</div>
              <div className="text-indigo-600 font-medium">测测你和这个岗位的匹配度</div>
            </div>
          </motion.div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={handleSaveImage}
              className="w-full btn-primary"
            >
              📷 保存图片
            </button>
            
            <button
              onClick={handleCopyLink}
              className="w-full px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              {copied ? "✓ 链接已复制" : "🔗 复制链接"}
            </button>

            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                💬 分享到微信
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                📱 分享到微博
              </button>
            </div>
          </div>

          {/* 邀请好友 */}
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-medium mb-2">邀请好友得积分</h3>
            <p className="text-sm text-gray-600 mb-3">每邀请一位好友注册，双方各得 100 积分</p>
            <div className="flex gap-2">
              <input
                type="text"
                value="https://jobfit.example.com/invite/abc123"
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                复制
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}