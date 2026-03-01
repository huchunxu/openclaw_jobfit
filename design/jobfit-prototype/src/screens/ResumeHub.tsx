import { Screen } from '../App'

const resumes = [
  {
    company: '字节跳动',
    title: '高级产品经理',
    score: 73,
    status: '面试中',
    date: '03-01',
    statusColor: 'bg-blue-50 text-blue-600',
    dot: 'bg-blue-500',
  },
  {
    company: '腾讯',
    title: '用户运营总监',
    score: 61,
    status: '待投递',
    date: '02-28',
    statusColor: 'bg-gray-100 text-gray-500',
    dot: 'bg-gray-400',
  },
  {
    company: '美团',
    title: '产品专家',
    score: 84,
    status: '已录用 🎉',
    date: '02-20',
    statusColor: 'bg-green-50 text-green-600',
    dot: 'bg-green-500',
  },
  {
    company: '小红书',
    title: '增长产品经理',
    score: 55,
    status: '已投递',
    date: '02-15',
    statusColor: 'bg-amber-50 text-amber-600',
    dot: 'bg-amber-500',
  },
]

export default function ResumeHub({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white px-5 py-3 border-b border-gray-100">
        <h2 className="text-gray-900 font-bold text-base">简历中心</h2>
        <p className="text-gray-400 text-xs mt-0.5">一份档案 · 多份定制简历</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* 统计 */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '已生成', value: '4', color: 'text-indigo-600' },
            { label: '已投递', value: '3', color: 'text-blue-600' },
            { label: '面试中', value: '1', color: 'text-amber-600' },
            { label: '已录用', value: '1', color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 筛选 */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['全部', '待投递', '面试中', '已录用', '已拒绝'].map((f, i) => (
            <button
              key={f}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${
                i === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 简历列表 */}
        <div className="space-y-3">
          {resumes.map((r, i) => (
            <button
              key={i}
              onClick={() => go('resume-detail')}
              className="w-full bg-white rounded-2xl p-4 shadow-sm text-left"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  ['bg-blue-500','bg-green-500','bg-rose-500','bg-amber-500'][i % 4]
                }`}>
                  <span className="text-white text-xs font-bold">{r.company[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 text-sm font-medium">{r.company}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.statusColor}`}>{r.status}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{r.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-20">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${r.score}%`,
                            background: r.score >= 70 ? '#10B981' : r.score >= 50 ? '#F59E0B' : '#EF4444'
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{r.score}分</span>
                    </div>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-gray-400 text-xs">{r.date}</span>
                  </div>
                </div>
              </div>
              {/* 操作行 */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                {['预览', '编辑', '导出', '重新生成'].map(action => (
                  <button
                    key={action}
                    className="flex-1 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium"
                    onClick={e => { e.stopPropagation(); if (action === '预览') go('resume-detail') }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* 新增按钮 */}
        <button
          onClick={() => go('jd-input')}
          className="w-full h-14 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-center gap-2 text-indigo-600 text-sm font-medium"
        >
          <span className="text-xl">+</span>
          分析新岗位，生成简历
        </button>
      </div>

      {/* TabBar */}
      <div className="bg-white border-t border-gray-100 px-2 py-2 flex justify-around">
        {[
          { icon: '🏠', label: '首页', screen: 'home' },
          { icon: '📋', label: '档案', screen: 'chat' },
          { icon: '📄', label: '简历', screen: 'resume-hub' },
          { icon: '📮', label: '投递', screen: 'tracker' },
          { icon: '👤', label: '我的', screen: 'profile' },
        ].map((tab) => (
          <button
            key={tab.screen}
            onClick={() => go(tab.screen as Screen)}
            className={`flex flex-col items-center gap-1 ${tab.screen === 'resume-hub' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
