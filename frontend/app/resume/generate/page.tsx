"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResumeGenerate() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState("default");
  const [length, setLength] = useState("standard");
  const [generating, setGenerating] = useState(false);
  
  // 模拟已保存的JD列表
  const jdList = [
    { id: 1, title: "高级Python开发工程师", company: "字节跳动", date: "2026-03-01" },
    { id: 2, title: "后端开发工程师", company: "阿里云", date: "2026-03-01" },
  ];
  
  const [selectedJD, setSelectedJD] = useState<number | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    // 模拟生成过程
    setTimeout(() => {
      setGenerating(false);
      setStep(3);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← 返回
            </Link>
            <h1 className="text-xl font-bold">生成简历</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* 步骤条 */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= s 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-20 h-1 ${step > s ? "bg-indigo-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mb-6">
            <span className="text-gray-500">选择JD</span>
            <span className="mx-4">→</span>
            <span className="text-gray-500">配置选项</span>
            <span className="mx-4">→</span>
            <span className="text-gray-500">生成简历</span>
          </div>

          {/* Step 1: 选择JD */}
          {step === 1 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">选择目标岗位</h2>
              <p className="text-gray-600 mb-4">选择要投递的岗位，AI将为您生成定制化简历</p>
              
              <div className="space-y-3">
                {jdList.map((jd) => (
                  <div 
                    key={jd.id}
                    onClick={() => setSelectedJD(jd.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedJD === jd.id 
                        ? "border-indigo-600 bg-indigo-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{jd.title}</h3>
                        <p className="text-sm text-gray-500">{jd.company} · {jd.date}</p>
                      </div>
                      {selectedJD === jd.id && (
                        <span className="text-indigo-600">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedJD}
                className="btn-primary w-full mt-6"
              >
                下一步：配置简历
              </button>
            </div>
          )}

          {/* Step 2: 配置选项 */}
          {step === 2 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">简历配置</h2>
              
              {/* 模板选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择模板
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
                      className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all ${
                        template === t.id 
                          ? "border-indigo-600 bg-indigo-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{t.icon}</div>
                      <div className="text-sm">{t.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 简历长度 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className={`flex-1 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        length === l.id 
                          ? "border-indigo-600 bg-indigo-50" 
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
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">简历预览</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• 目标岗位：{jdList.find(j => j.id === selectedJD)?.title}</p>
                  <p>• 模板：{template}</p>
                  <p>• 长度：{length}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  上一步
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="btn-primary flex-1"
                >
                  {generating ? "生成中..." : "开始生成"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 生成完成 */}
          {step === 3 && (
            <div className="card text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">简历生成完成</h2>
              <p className="text-gray-600 mb-6">
                您的定制化简历已生成完毕，可以下载使用
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <div className="font-medium">PDF</div>
                    <button className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm">
                      下载
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">📝</div>
                    <div className="font-medium">Word</div>
                    <button className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm">
                      下载
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/dashboard" className="flex-1 btn-primary text-center">
                  返回工作台
                </Link>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
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