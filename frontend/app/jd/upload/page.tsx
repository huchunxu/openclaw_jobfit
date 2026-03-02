"use client";

import { useState } from "react";

export default function JDUpload() {
  const [inputType, setInputType] = useState<"text" | "url" | "file">("text");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleParse = async () => {
    setParsing(true);
    
    // 模拟API调用
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
          { name: "Redis", level: "familiar", weight: 0.8 },
          { name: "Docker", level: "familiar", weight: 0.75 }
        ],
        top_keywords: [
          { keyword: "Python", importance: "critical" },
          { keyword: "后端开发", importance: "critical" },
          { keyword: "3年+经验", importance: "important" },
          { keyword: "数据库", importance: "important" },
          { keyword: "微服务", importance: "nice_to_have" }
        ],
        min_experience_years: 3,
        education_requirement: "bachelor"
      });
      setParsing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">上传JD</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* 输入类型选择 */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">选择输入方式</h2>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setInputType("text")}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  inputType === "text" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                📝 文本输入
              </button>
              <button
                onClick={() => setInputType("url")}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  inputType === "url" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🔗 链接解析
              </button>
              <button
                onClick={() => setInputType("file")}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  inputType === "file" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                📄 文件上传
              </button>
            </div>

            {/* 输入框 */}
            {inputType === "text" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  粘贴JD内容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请粘贴招聘JD内容..."
                  className="input-field h-48 resize-none"
                />
              </div>
            )}

            {inputType === "url" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JD链接
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="input-field"
                />
              </div>
            )}

            {inputType === "file" && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">📁</div>
                <p className="text-gray-600 mb-2">点击或拖拽文件到此处上传</p>
                <p className="text-sm text-gray-400">支持 PDF、Word、TXT 格式</p>
              </div>
            )}

            <button
              onClick={handleParse}
              disabled={parsing || (inputType === "text" && !content) || (inputType === "url" && !url)}
              className="btn-primary w-full mt-4"
            >
              {parsing ? "解析中..." : "开始解析"}
            </button>
          </div>

          {/* 解析结果 */}
          {result && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">解析结果</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600 font-medium">✓ 解析成功</span>
                </div>
                <p className="text-green-700 text-sm">
                  已自动提取 {result.required_skills.length} 项技能要求，
                  {result.top_keywords.length} 个关键词
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500">职位名称</label>
                    <p className="font-medium">{result.job_title}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">公司名称</label>
                    <p className="font-medium">{result.company_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">工作地点</label>
                    <p className="font-medium">{result.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">薪资范围</label>
                    <p className="font-medium">
                      {result.salary_range_min/1000}K - {result.salary_range_max/1000}K
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">经验要求</label>
                    <p className="font-medium">{result.min_experience_years}年+</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">学历要求</label>
                    <p className="font-medium">本科及以上</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-2">技能要求</label>
                  <div className="flex flex-wrap gap-2">
                    {result.required_skills.map((skill: any, idx: number) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-2">关键词</label>
                  <div className="flex flex-wrap gap-2">
                    {result.top_keywords.map((kw: any, idx: number) => (
                      <span 
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${
                          kw.importance === "critical" 
                            ? "bg-red-100 text-red-700" 
                            : kw.importance === "important"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {kw.keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="btn-primary flex-1">
                    开始匹配
                  </button>
                  <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    保存JD
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}