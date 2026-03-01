import { Screen } from '../App'

export default function Profile({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white px-5 pt-4 pb-5 border-b border-gray-100">
        <h2 className="text-gray-900 font-bold text-base mb-4">我的</h2>
        {/* 用户信息 */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">张</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-bold text-base">张明</p>
            <p className="text-gray-500 text-xs mt-0.5">上海交通大学 · 软件工程 · 4年经验</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">✦ 免费版</span>
              <button className="text-xs text-indigo-600 underline">升级会员</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* 使用情况 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-900 text-sm font-bold mb-3">本月使用情况</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 text-xs">简历生成次数</span>
                <span className="text-gray-500 text-xs">2 / 3 次</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-indigo-500" style={{ width: '66%' }} />
              </div>
              <p className="text-gray-400 text-xs mt-1">还剩 1 次，<button className="text-indigo-600">升级解锁无限次</button></p>
            </div>
          </div>
        </div>

        {/* 会员升级 */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-bold text-sm">🚀 升级 JobFit 会员</p>
              <p className="text-indigo-200 text-xs mt-0.5">无限次简历生成 · 无水印导出</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-lg">¥39</p>
              <p className="text-indigo-200 text-xs">/月</p>
            </div>
          </div>
          <button className="w-full h-9 bg-white rounded-xl text-indigo-600 text-sm font-bold">立即升级</button>
          <p className="text-center text-indigo-300 text-xs mt-2">年付 ¥199，省 ¥269</p>
        </div>

        {/* 设置菜单 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { icon: '👤', label: '编辑个人档案', action: () => go('chat') },
            { icon: '📄', label: '我的简历', action: () => go('resume-hub') },
            { icon: '🔔', label: '消息通知设置', action: () => {} },
            { icon: '🔒', label: '隐私与数据', action: () => {} },
            { icon: '📃', label: '隐私政策', action: () => {} },
          ].map((item, i, arr) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${
                i < arr.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <span className="text-xl w-8">{item.icon}</span>
              <span className="flex-1 text-gray-700 text-sm">{item.label}</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* 隐私声明 */}
        <div className="bg-green-50 rounded-2xl p-4 flex gap-3">
          <span className="text-xl flex-shrink-0">🔒</span>
          <div>
            <p className="text-green-800 text-xs font-medium mb-1">数据安全承诺</p>
            <p className="text-green-600 text-xs leading-relaxed">你的简历数据仅用于生成简历，不用于AI训练，不共享给第三方，可随时删除全部数据。</p>
          </div>
        </div>

        <button className="w-full py-3 text-red-400 text-sm">退出登录</button>
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
            className={`flex flex-col items-center gap-1 ${tab.screen === 'profile' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
