"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "verify">("input");

  const handleSendCode = () => {
    if (phone.length === 11) {
      setStep("verify");
    }
  };

  const handleLogin = () => {
    if (code.length >= 4) {
      // 测试模式：任意验证码都能登录
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* 顶部导航 */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <span className="text-2xl">💼</span>
          </div>
          <span className="text-2xl font-bold text-white">JobFit</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-white/80 hover:text-white transition">立即体验</Link>
          <Link href="/dashboard" className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition backdrop-blur-sm">
            免登录试用
          </Link>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 左侧文案 */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                AI驱动
                <br />
                <span className="text-yellow-300">精准求职</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                智能解析JD，精准匹配岗位，自动生成定制化简历
                <br />
                <span className="text-sm">让求职变得更简单、更高效</span>
              </p>
              
              {/* 功能特点 */}
              <div className="space-y-4">
                {[
                  { icon: "📋", text: "智能JD解析" },
                  { icon: "🎯", text: "精准岗位匹配" },
                  { icon: "📄", text: "AI简历生成" },
                  { icon: "📊", text: "投递进度追踪" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-3"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 右侧登录卡片 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">欢迎使用 JobFit</h2>
                <p className="text-gray-500">登录后开始智能求职之旅</p>
              </div>

              {step === "input" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      手机号
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="请输入手机号"
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-lg"
                    />
                  </div>
                  <button 
                    onClick={handleSendCode}
                    disabled={phone.length !== 11}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    获取验证码
                  </button>
                  
                  <div className="text-center">
                    <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 text-sm">
                      跳过登录，直接试用 →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      验证码
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.slice(0, 6))}
                      placeholder="输入验证码"
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-lg text-center tracking-widest"
                    />
                    <p className="text-xs text-gray-400 mt-2">测试模式：任意4位数验证码</p>
                  </div>
                  <button 
                    onClick={handleLogin}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                  >
                    立即登录
                  </button>
                  <button 
                    onClick={() => setStep("input")}
                    className="w-full py-3 text-gray-500 hover:text-gray-700 transition"
                  >
                    返回
                  </button>
                </div>
              )}

              {/* 其他登录方式 */}
              <div className="mt-8">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-400">其他登录方式</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <button className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
                    <span className="text-2xl">📱</span>
                  </button>
                  <button className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
                    <span className="text-2xl">✉️</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 底部 */}
          <div className="text-center mt-16 text-white/60 text-sm">
            © 2026 JobFit · AI驱动精准求职
          </div>
        </div>
      </div>
    </div>
  );
}