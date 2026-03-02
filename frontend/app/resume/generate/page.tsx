"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResumeGenerate() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState("default");
  const [length, setLength] = useState("standard");
  const [generating, setGenerating] = useState(false);
  
  const jdList = [
    { id: 1, title: "高级Python开发工程师", company: "字节跳动", score: 85 },
    { id: 2, title: "后端开发工程师", company: "阿里云", score: 72 },
  ];
  
  const [selectedJD, setSelectedJD] = useState<number | null>(1);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setStep(3);
    }, 3000);
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
              <h1 className="text-xl font-bold">生成简历</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* 步骤条 */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? "bg-purple-600 text-white shadow-lg" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-1 ${step > s ? "bg-purple-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mb-8">
            <span className="text-gray-500">选择JD</span>
            <span className="mx-6">→</span>
            <span className={step === 2 ? "text-purple-600 font-medium" : "text-gray-500"}>配置选项</span>
            <span className="mx-6">→</span>
            <span className={step === 3 ? "text-purple-600 font-medium" : "text-gray-500"}>生成简历</span>
          </div>

          {/* Step 1: 选择JD */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">选择目标岗位</h2>
              <p className="text-gray-500 mb-6">选择要投递的岗位，AI将为您生成定制化简历</p>
              
              <div className="space-y-3">
                {jdList.map((jd) => (
                  <div 
                    key={jd.id}
                    onClick={() => setSelectedJD(jd.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      selectedJD === jd.id 
                        ? "border-purple-600 bg-purple-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedJD === jd.id ? "bg-purple-100" : "bg-gray-100"
                      }`}>
                        <span className="text-xl">🏢</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{jd.title}</h3>
                        <p className="text-sm text-gray-500">{jd.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-bold ${
                        jd.score >= 75 ? "text-green-600" : "text-yellow-600"
                      }`}>{jd.score}</span>
                      {selectedJD === jd.id && (
                        <span className="text-purple-600">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedJD}
                className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                下一步：配置简历 →
              </button>
            </div>
          )}

          {/* Step 2: 配置选项 */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-6">简历配置</h2>
              
              {/* 模板选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择模板风格
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: "default", name: "通用", icon: "📄" },
                    { id: "modern", name: "现代", icon: "🎨" },
                    { id: "professional", name: "专业", icon: "💼" },
                    { id: "creative", name: "创意", icon: "✨" }
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${
                        template === t.id 
                          ? "border-purple-600 bg-purple-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{t.icon}</div>
                      <div className="text-sm font-medium">{t.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 简历长度 */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  简历长度
                </label>
                <div className="flex gap-3">
                  {[
                    { id: "concise", name: "精简", desc: "1页以内" },
                    { id: "standard", name: "标准", desc: "1-2页" },
                    { id: "detailed", name: "详细", desc: "2-3页" }
                  ].map((l) => (
                    <div
                      key={l.id}
                      onClick={() => setLength(l.id)}
                      className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        length === l.id 
                          ? "border-purple-600 bg-purple-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{l.name}</div>
                      <div className="text-sm text-gray-500">{l.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 预览 */}
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <h3 className="font-medium mb-2">📋 简历预览</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• 目标岗位：{jdList.find(j => j.id === selectedJD)?.title}</p>
                  <p>• 模板风格：{template}</p>
                  <p>• 简历长度：{length}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  ← 上一步
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  {generating ? "生成中..." : "🚀 开始生成简历"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 生成完成 */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">简历生成完成！</h2>
              <p className="text-gray-500 mb-8">
                您的定制化简历已生成完毕，可以下载使用
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="font-semibold mb-2">PDF</div>
                  <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-purple-600 font-medium hover:bg-purple-50">
                    下载
                  </button>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-semibold mb-2">Word</div>
                  <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-purple-600 font-medium hover:bg-purple-50">
                    下载
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/dashboard" className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition text-center">
                  返回工作台
                </Link>
                <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                  再次生成
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}