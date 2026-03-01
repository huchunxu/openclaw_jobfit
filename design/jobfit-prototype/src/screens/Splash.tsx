import { Screen } from '../App'

export default function Splash({ go }: { go: (s: Screen) => void }) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center cursor-pointer"
      style={{ background: 'linear-gradient(145deg, #4F46E5 0%, #7C3AED 100%)' }}
      onClick={() => go('onboarding')}
    >
      {/* Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-4">
          <span className="text-4xl">🎯</span>
        </div>
        <h1 className="text-white text-4xl font-bold text-center tracking-wide">JobFit</h1>
        <p className="text-indigo-200 text-base text-center mt-2">你的 AI 求职助手</p>
      </div>

      {/* 核心价值 */}
      <div className="bg-white/10 rounded-2xl px-8 py-5 mx-8 mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📋</span>
          <span className="text-white text-sm">智能采集职业信息</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">⚡</span>
          <span className="text-white text-sm">深度解析岗位JD</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">✨</span>
          <span className="text-white text-sm">生成最佳匹配简历</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="w-48 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-indigo-600 font-bold text-base">微信一键登录</span>
        </div>
        <p className="text-indigo-300 text-xs">点击任意处继续</p>
      </div>

      <p className="absolute bottom-8 text-indigo-300 text-xs">JobFit · AI驱动 · 数据安全</p>
    </div>
  )
}
