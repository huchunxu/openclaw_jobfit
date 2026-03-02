"use client";

import { useState } from "react";
import Link from "next/link";

export default function JDUpload() {
  const [inputType, setInputType] = useState<"text" | "url">("text");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleParse = () => {
    setParsing(true);
    setTimeout(() => {
      setResult({
        id: 1,
        job_title: "高级Python开发工程师",
        company_name: "字节跳动",
        location: "北京",
        salary_range_min: 25000,
        salary_range_max: 45000,
        required_skills: [
          { name: "Python", level: "expert", weight: 0.95 },
          { name: "Django", level: "proficient", weight: 0.9 },
          { name: "MySQL", level: "proficient", weight: 0.85 },
        ],
        top_keywords: [
          { keyword: "Python", importance: "critical" },
          { keyword: "后端开发", importance: "critical" },
        ],
        min_experience_years: 3,
        education_requirement: "bachelor"
      });
      setParsing(false);
    }, 2000);
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
              <h1 className="text-xl font-bold">上传JD</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 输入类型选择 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">选择输入方式</h2>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setInputType("text")}
                className={`flex-1 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  inputType === "text" 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>📝</span> 文本输入
              </button>
              <button
                onClick={() => setInputType("url")}
                className={`flex-1 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  inputType === "url" 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>🔗</span> 链接解析
              </button>
            </div>

            {inputType === "text" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  粘贴JD内容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请粘贴完整的招聘JD内容，包含职位描述、要求、福利等信息..."
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition h-48 resize-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JD链接
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
            )}

            <button
              onClick={handleParse}
              disabled={parsing || (inputType === "text" && !content) || (inputType === "url" && !url)}
              className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {parsing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> 解析中...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span> 开始智能解析
                </span>
              )}
            </button>
          </div>

          {/* 解析结果 */}
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">解析成功！</h2>
                  <p className="text-sm text-gray-500">已自动提取 {result.required_skills.length} 项技能要求</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">职位名称</label>
                  <p className="font-semibold text-lg">{result.job_title}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">公司名称</label>
                  <p className="font-semibold">{result.company_name}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">工作地点</label>
                  <p className="font-semibold">{result.location}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">薪资范围</label>
                  <p className="font-semibold text-green-600">
                    {result.salary_range_min/1000}K - {result.salary_range_max/1000}K
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-2">技能要求</label>
                <div className="flex flex-wrap gap-2">
                  {result.required_skills.map((skill: any, idx: number) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {skill.name}
                      <span className="ml-1 text-xs text-purple-500">({skill.level})</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/match/1" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl text-center hover:shadow-lg transition">
                  🎯 开始匹配
                </Link>
                <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                  保存JD
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}