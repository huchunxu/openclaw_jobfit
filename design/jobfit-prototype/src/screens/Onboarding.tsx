import { useState } from 'react'
import { Screen } from '../App'

export default function Onboarding({ go }: { go: (s: Screen) => void }) {
  const [agreed, setAgreed] = useState(false)

  const features = [
    { emoji: '💬', title: '对话式建档', desc: 'AI引导，5分钟完成' },
    { emoji: '⚡', title: 'JD智能匹配', desc: '秒级解析岗位要求' },
    { emoji: '✨', title: '定制简历生成', desc: 'ATS友好，一键导出' },
  ]

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 顶部品牌区 */}
      <div
        className="px-6 pt-8 pb-6 flex flex-col items-center"
        style={{ background: 'linear-gradient(160deg, #4F46E5 0%, #7C3AED 100%)' }}
      >
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <span className="text-3xl">🎯</span>
        </div>
        <h1 className="text-white text-2xl font-bold mb-1">JobFit</h1>
        <p className="text-indigo-200 text-sm">AI驱动 · 最佳职业匹配简历</p>

        {/* 3个功能卡片横排 */}
        <div className="flex gap-2 mt-5 w-full">
          {features.map(f => (
            <div key={f.title} className="flex-1 bg-white/10 rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">{f.emoji}</div>
              <p className="text-white text-xs font-bold leading-tight">{f.title}</p>
              <p className="text-indigo-200 text-xs mt-0.5 leading-tight">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 隐私说明区 */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔒</span>
          <p className="text-gray-900 text-sm font-bold">数据隐私承诺</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 mb-4">
          {[
            '收集姓名、联系方式、工作经历，仅用于生成简历',
            '数据不用于AI模型训练，不对外共享',
            '简历数据加密存储，全程HTTPS传输',
            '可随时在"我的"页面删除全部数据',
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <span className="text-green-500 text-xs mt-0.5 flex-shrink-0">✓</span>
              <span className="text-gray-600 text-xs leading-relaxed">{item}</span>
            </div>
          ))}
        </div>

        {/* 同意勾选 */}
        <button
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 w-full text-left mb-2"
        >
          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            agreed ? 'bg-indigo-600' : 'border-2 border-gray-300'
          }`}>
            {agreed && <span className="text-white text-xs">✓</span>}
          </div>
          <p className="text-gray-600 text-xs leading-relaxed">
            我已阅读并同意
            <span className="text-indigo-600">《用户服务协议》</span>
            和
            <span className="text-indigo-600">《隐私政策》</span>
            ，授权JobFit收集和处理我的职业信息用于简历生成服务
          </p>
        </button>
      </div>

      {/* 底部按钮 */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={() => agreed && go('chat')}
          className={`w-full h-14 rounded-2xl font-bold text-base transition-all ${
            agreed
              ? 'text-white shadow-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          style={agreed ? { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' } : {}}
        >
          {agreed ? '同意并开始建立档案 →' : '请先阅读并同意协议'}
        </button>
        <button
          onClick={() => go('home')}
          className="w-full h-10 text-gray-400 text-sm"
        >
          先逛逛
        </button>
      </div>
    </div>
  )
}
