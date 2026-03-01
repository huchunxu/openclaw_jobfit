import { useState } from 'react'
import { Screen } from '../App'

const dimensions = [
  { label: '技术技能', score: 28, max: 35, color: '#4F46E5' },
  { label: '工作经验', score: 20, max: 25, color: '#7C3AED' },
  { label: '教育背景', score: 13, max: 15, color: '#06B6D4' },
  { label: '软技能', score: 7, max: 15, color: '#10B981' },
  { label: '关键词', score: 5, max: 10, color: '#F59E0B' },
]

const matched = ['Python开发 3年', '产品规划经验', '本科学历 ✓', '项目管理能力', '数据分析基础']
const gaps = [
  { item: 'SQL / 数据分析工具', level: 'critical', tip: '建议在工作经历中补充数据查询经验' },
  { item: '电商行业背景', level: 'important', tip: '可在个人简介中说明对电商的理解' },
  { item: 'A/B测试经验', level: 'optional', tip: '可选，有则更好' },
]

export default function MatchReport({ go }: { go: (s: Screen) => void }) {
  const [showGenerate, setShowGenerate] = useState(false)
  const total = dimensions.reduce((s, d) => s + d.score, 0)

  if (showGenerate) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white px-8">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
        <h2 className="text-gray-900 text-xl font-bold mb-2">AI生成中...</h2>
        <p className="text-gray-500 text-sm text-center mb-6">正在为你生成针对<br/>字节跳动 · 高级产品经理 的专属简历</p>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse" style={{ width: '70%' }} />
        </div>
        <p className="text-gray-400 text-xs">关键词植入 → STAR法则优化 → ATS格式适配</p>
        <button
          onClick={() => go('tracker')}
          className="mt-8 w-full h-12 bg-indigo-50 text-indigo-600 rounded-2xl text-sm font-medium"
        >
          ✅ 已加入投递管理，查看进展 →
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white px-5 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => go('jd-input')}>
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-gray-900 font-bold text-sm">匹配分析报告</h2>
          <p className="text-gray-400 text-xs">字节跳动 · 高级产品经理</p>
        </div>
        <button className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">分享</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* 总分卡片 */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <svg width="88" height="88" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="36" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                <circle
                  cx="44" cy="44" r="36" fill="none"
                  stroke="url(#grad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36 * total / 100} ${2 * Math.PI * 36}`}
                  strokeDashoffset={2 * Math.PI * 36 * 0.25}
                  transform="rotate(-90 44 44)"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <text x="44" y="44" textAnchor="middle" dy="0.35em" fontSize="20" fontWeight="bold" fill="#111827">{total}</text>
              </svg>
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-green-700 text-xs font-bold">强烈推荐投递</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">你的核心技能高度匹配，软技能描述可再强化，整体竞争力强</p>
            </div>
          </div>
        </div>

        {/* 维度评分 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-900 text-sm font-bold mb-3">维度详情</p>
          <div className="space-y-3">
            {dimensions.map(d => (
              <div key={d.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 text-xs">{d.label}</span>
                  <span className="text-gray-500 text-xs">{d.score}/{d.max}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${(d.score / d.max) * 100}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 已匹配项 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-900 text-sm font-bold mb-3">✅ 已具备（{matched.length}项）</p>
          <div className="flex flex-wrap gap-2">
            {matched.map(item => (
              <span key={item} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">{item}</span>
            ))}
          </div>
        </div>

        {/* 能力缺口 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-900 text-sm font-bold mb-3">⚠️ 能力缺口（{gaps.length}项）</p>
          <div className="space-y-2.5">
            {gaps.map(g => (
              <div key={g.item} className={`rounded-xl p-3 ${
                g.level === 'critical' ? 'bg-red-50' :
                g.level === 'important' ? 'bg-amber-50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    g.level === 'critical' ? 'bg-red-100 text-red-600' :
                    g.level === 'important' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {g.level === 'critical' ? '必须' : g.level === 'important' ? '重要' : '加分'}
                  </span>
                  <span className="text-gray-800 text-xs font-medium">{g.item}</span>
                </div>
                <p className="text-gray-500 text-xs">{g.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 分享卡片预览 */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4">
          <p className="text-white/80 text-xs mb-1">分享给朋友</p>
          <p className="text-white font-bold text-sm mb-3">「我和字节跳动产品经理岗匹配度 {total}分，你也来测测？」</p>
          <button className="bg-white/20 text-white text-xs px-4 py-2 rounded-full">生成分享卡片</button>
        </div>
      </div>

      {/* 底部操作 */}
      <div className="bg-white border-t border-gray-100 px-5 py-4 space-y-2">
        <button
          onClick={() => setShowGenerate(true)}
          className="w-full h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          ✨ 一键生成匹配简历
        </button>
        <button className="w-full h-10 text-gray-500 text-sm">完善档案后重新匹配</button>
      </div>
    </div>
  )
}
