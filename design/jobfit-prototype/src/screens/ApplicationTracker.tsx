import { useState } from 'react'
import { Screen } from '../App'

type Tab = 'all' | 'pending' | 'applied' | 'interview' | 'offer'

const applications = [
  {
    company: '美团',
    title: '产品专家',
    score: 84,
    status: 'offer',
    statusLabel: '已录用 🎉',
    date: '02-20',
    nextAction: '签offer截止 03-05',
    urgent: true,
    color: 'bg-rose-500',
  },
  {
    company: '字节跳动',
    title: '高级产品经理',
    score: 73,
    status: 'interview',
    statusLabel: '面试中',
    date: '03-01',
    nextAction: '二面 03-04 14:00',
    urgent: true,
    color: 'bg-blue-500',
  },
  {
    company: '腾讯',
    title: '用户运营总监',
    score: 61,
    status: 'applied',
    statusLabel: '已投递',
    date: '02-28',
    nextAction: '等待HR回复',
    urgent: false,
    color: 'bg-green-500',
  },
  {
    company: '小红书',
    title: '增长产品经理',
    score: 55,
    status: 'applied',
    statusLabel: '已投递',
    date: '02-25',
    nextAction: '等待HR回复',
    urgent: false,
    color: 'bg-amber-500',
  },
  {
    company: '滴滴',
    title: '产品经理',
    score: 79,
    status: 'pending',
    statusLabel: '待投递',
    date: '03-01',
    nextAction: '简历已生成，待投递',
    urgent: false,
    color: 'bg-violet-500',
  },
]

const statusMap: Record<string, { bg: string; text: string }> = {
  offer:     { bg: 'bg-green-50',  text: 'text-green-600' },
  interview: { bg: 'bg-blue-50',   text: 'text-blue-600' },
  applied:   { bg: 'bg-amber-50',  text: 'text-amber-600' },
  pending:   { bg: 'bg-gray-100',  text: 'text-gray-500' },
  rejected:  { bg: 'bg-red-50',    text: 'text-red-400' },
}

const tabs: { key: Tab; label: string; count: number }[] = [
  { key: 'all',       label: '全部',   count: 5 },
  { key: 'pending',   label: '待投递', count: 1 },
  { key: 'applied',   label: '已投递', count: 2 },
  { key: 'interview', label: '面试中', count: 1 },
  { key: 'offer',     label: '录用',   count: 1 },
]

export default function ApplicationTracker({ go }: { go: (s: Screen) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = activeTab === 'all'
    ? applications
    : applications.filter(a => a.status === activeTab)

  if (selected !== null) {
    const app = applications[selected]
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="bg-white px-5 py-3 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setSelected(null)}>
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-gray-900 font-bold text-sm">{app.company} · {app.title}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusMap[app.status].bg} ${statusMap[app.status].text}`}>
              {app.statusLabel}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {/* 时间轴 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-900 text-sm font-bold mb-3">投递进展</p>
            <div className="space-y-0">
              {[
                { label: '简历生成', date: app.date, done: true },
                { label: '已投递', date: app.status !== 'pending' ? app.date : null, done: app.status !== 'pending' },
                { label: '简历筛选', date: ['interview','offer'].includes(app.status) ? '+3天' : null, done: ['interview','offer'].includes(app.status) },
                { label: '面试', date: app.status === 'interview' ? '03-04 14:00' : app.status === 'offer' ? '已完成' : null, done: app.status === 'offer', active: app.status === 'interview' },
                { label: 'Offer', date: app.status === 'offer' ? '03-02' : null, done: app.status === 'offer' },
              ].map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.done ? 'bg-green-500' :
                      step.active ? 'bg-blue-500 ring-4 ring-blue-100' :
                      'bg-gray-200'
                    }`}>
                      {step.done && <span className="text-white text-xs">✓</span>}
                      {step.active && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    {i < 4 && <div className={`w-0.5 h-6 ${step.done ? 'bg-green-300' : 'bg-gray-200'}`} />}
                  </div>
                  <div className="pb-2">
                    <p className={`text-xs font-medium ${step.active ? 'text-blue-600' : step.done ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</p>
                    {step.date && <p className="text-xs text-gray-400">{step.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 下一步行动 */}
          {app.urgent && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-amber-800 text-xs font-bold mb-0.5">需要行动</p>
                <p className="text-amber-700 text-xs">{app.nextAction}</p>
              </div>
            </div>
          )}

          {/* 关联简历 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-900 text-sm font-bold mb-3">关联简历</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📄</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 text-xs font-medium">{app.company} · {app.title} · 专属简历</p>
                <p className="text-gray-400 text-xs">匹配度 {app.score}分 · 版本 2</p>
              </div>
              <button
                onClick={() => go('resume-detail')}
                className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg"
              >
                查看
              </button>
            </div>
          </div>

          {/* 备注 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-900 text-sm font-bold mb-2">备注</p>
            <textarea
              placeholder="记录面试反馈、薪资谈判情况、注意事项..."
              className="w-full bg-gray-50 rounded-xl p-3 text-xs text-gray-600 outline-none resize-none h-20"
            />
          </div>

          {/* 更新状态 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-900 text-sm font-bold mb-3">更新投递状态</p>
            <div className="grid grid-cols-3 gap-2">
              {['已投递','面试中','已录用','已拒绝','已放弃','暂缓'].map(s => (
                <button key={s} className="py-2 rounded-xl bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-gray-900 font-bold text-base">投递管理</h2>
          <button
            onClick={() => go('jd-input')}
            className="text-xs text-white px-3 py-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            + 新增投递
          </button>
        </div>
        <p className="text-gray-400 text-xs">追踪每份简历的求职进展</p>
      </div>

      {/* 统计概览 */}
      <div className="bg-white px-5 py-3 border-b border-gray-100">
        <div className="flex gap-3">
          {[
            { label: '进行中', value: 4, color: 'text-indigo-600' },
            { label: '面试中', value: 1, color: 'text-blue-600' },
            { label: '已录用', value: 1, color: 'text-green-600' },
            { label: '待行动', value: 2, color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="flex-1 text-center">
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab */}
      <div className="bg-white px-4 border-b border-gray-100">
        <div className="flex overflow-x-auto gap-1 pb-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-1 ${
                activeTab === tab.key
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1 rounded-full ${
                  activeTab === tab.key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
        {filtered.map((app, i) => (
          <button
            key={i}
            onClick={() => setSelected(applications.indexOf(app))}
            className="w-full bg-white rounded-2xl p-4 shadow-sm text-left"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${app.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-bold">{app.company[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 text-sm font-medium">{app.company}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusMap[app.status].bg} ${statusMap[app.status].text}`}>
                    {app.statusLabel}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{app.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-16 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${app.score}%`,
                        background: app.score >= 70 ? '#10B981' : '#F59E0B'
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{app.score}分</span>
                  {app.urgent && (
                    <span className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">⚡ 需行动</span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-1">{app.nextAction}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* TabBar */}
      <div className="bg-white border-t border-gray-100 px-6 py-2 flex justify-around">
        {[
          { icon: '🏠', label: '首页', screen: 'home' as Screen },
          { icon: '📋', label: '我的档案', screen: 'chat' as Screen },
          { icon: '📄', label: '简历中心', screen: 'resume-hub' as Screen },
          { icon: '📮', label: '投递管理', screen: 'tracker' as Screen },
          { icon: '👤', label: '我的', screen: 'profile' as Screen },
        ].map((tab) => (
          <button
            key={tab.screen}
            onClick={() => go(tab.screen)}
            className={`flex flex-col items-center gap-1 ${tab.screen === 'tracker' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
