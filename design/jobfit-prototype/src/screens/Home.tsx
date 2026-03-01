import { Screen } from '../App'

const recentJobs = [
  { company: '字节跳动', title: '高级产品经理', score: 73, status: '面试中', color: 'bg-blue-500' },
  { company: '腾讯', title: '运营总监', score: 61, status: '待投递', color: 'bg-green-500' },
  { company: '美团', title: '产品专家', score: 84, status: '已录用', color: 'bg-rose-500' },
]

export default function Home({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* 顶部Header */}
      <div className="px-5 pt-3 pb-5" style={{ background: 'linear-gradient(145deg, #4F46E5 0%, #6D28D9 100%)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-indigo-200 text-xs mb-0.5">早上好 👋</p>
            <h1 className="text-white text-xl font-bold">JobFit</h1>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">👤</span>
          </div>
        </div>

        {/* 状态卡片 */}
        <div className="bg-white/15 rounded-2xl p-4">
          <div className="flex justify-between mb-3">
            <div className="text-center">
              <p className="text-white text-xl font-bold">3</p>
              <p className="text-indigo-200 text-xs">已生成简历</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-white text-xl font-bold">2</p>
              <p className="text-indigo-200 text-xs">已投递</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-white text-xl font-bold">1</p>
              <p className="text-indigo-200 text-xs">面试中</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-white text-xl font-bold">73</p>
              <p className="text-indigo-200 text-xs">平均匹配</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-indigo-100 text-xs">档案已建立 · 最近更新 2小时前</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-4 space-y-4">
        {/* 主入口 */}
        <button
          onClick={() => go('jd-input')}
          className="w-full rounded-3xl p-5 flex items-center gap-4 shadow-lg text-left"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🔍</span>
          </div>
          <div>
            <p className="text-white font-bold text-base mb-0.5">粘贴JD，立即分析</p>
            <p className="text-indigo-200 text-xs">输入岗位描述，AI秒级匹配 + 生成简历</p>
          </div>
          <svg className="w-5 h-5 text-white/60 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 快捷操作 */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => go('chat')}
            className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm"
          >
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
            <span className="text-gray-700 text-xs font-medium">完善档案</span>
          </button>
          <button
            onClick={() => go('resume-hub')}
            className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm"
          >
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <span className="text-xl">📄</span>
            </div>
            <span className="text-gray-700 text-xs font-medium">简历中心</span>
          </button>
          <button
            onClick={() => go('profile')}
            className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm"
          >
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <span className="text-gray-700 text-xs font-medium">我的</span>
          </button>
        </div>

        {/* 最近分析 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 font-bold text-sm">最近分析</h3>
            <button onClick={() => go('resume-hub')} className="text-indigo-600 text-xs">查看全部</button>
          </div>
          <div className="space-y-2">
            {recentJobs.map((job, i) => (
              <button
                key={i}
                onClick={() => go('match-report')}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm text-left"
              >
                <div className={`w-10 h-10 ${job.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{job.company[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium truncate">{job.company} · {job.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-20">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${job.score}%`,
                          background: job.score >= 70 ? '#10B981' : job.score >= 50 ? '#F59E0B' : '#EF4444'
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{job.score}分</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                  job.status === '面试中' ? 'bg-blue-50 text-blue-600' :
                  job.status === '已录用' ? 'bg-green-50 text-green-600' :
                  'bg-gray-50 text-gray-500'
                }`}>{job.status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 提示卡片 */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
          <span className="text-xl flex-shrink-0">💡</span>
          <div>
            <p className="text-amber-800 text-xs font-medium mb-1">档案完整度 75%</p>
            <p className="text-amber-600 text-xs">补充项目经历可提升匹配精准度，点击完善档案</p>
          </div>
        </div>
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
            className={`flex flex-col items-center gap-1 ${tab.screen === 'home' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
