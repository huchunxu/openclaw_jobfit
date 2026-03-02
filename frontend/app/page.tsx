"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "verify" | "profile">("input");

  const handleSendCode = () => {
    if (phone.length === 11) {
      setStep("verify");
    }
  };

  const handleLogin = () => {
    if (code.length === 6) {
      setStep("profile");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">JobFit</h1>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">直接测试</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">登录</Link>
            <Link href="/register" className="text-indigo-600 hover:text-indigo-700">注册</Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            AI驱动，精准匹配
            <span className="text-indigo-600">理想岗位</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            智能解析JD，精准匹配岗位，自动生成定制化简历
          </p>
          
          {/* 登录表单 */}
          <div className="card max-w-md mx-auto">
            {step === "input" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="input-field"
                    maxLength={11}
                  />
                </div>
                <button 
                  onClick={handleSendCode}
                  disabled={phone.length !== 11}
                  className="btn-primary w-full"
                >
                  获取验证码
                </button>
              </div>
            )}

            {step === "verify" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    验证码
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="请输入6位验证码"
                    className="input-field"
                    maxLength={6}
                  />
                </div>
                <button 
                  onClick={handleLogin}
                  disabled={code.length !== 6}
                  className="btn-primary w-full"
                >
                  登录
                </button>
                <button 
                  onClick={() => setStep("input")}
                  className="text-gray-500 text-sm"
                >
                  返回重新输入
                </button>
              </div>
            )}

            {step === "profile" && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold mb-2">登录成功</h3>
                <p className="text-gray-600 mb-6">开始使用JobFit</p>
                <Link href="/dashboard" className="btn-primary inline-block">
                  进入工作台
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">智能JD解析</h3>
            <p className="text-gray-600">自动提取职位关键技能、经验要求、隐性要求</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">精准匹配</h3>
            <p className="text-gray-600">5维度算法计算人岗匹配度，生成优化建议</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold mb-2">AI简历生成</h3>
            <p className="text-gray-600">针对目标岗位自动生成定制化简历</p>
          </div>
        </div>
      </section>
    </main>
  );
}