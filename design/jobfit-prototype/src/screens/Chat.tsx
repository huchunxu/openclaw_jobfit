import { useState } from 'react'
import { Screen } from '../App'

const messages = [
  { role: 'ai', text: '你好！我是JobFit助手 🎯\n\n我会通过几个简单的问题帮你建立职业档案，5-8分钟完成，信息越完整，生成的简历越精准！\n\n先来认识一下——请问你的姓名是？' },
  { role: 'user', text: '我叫张明' },
  { role: 'ai', text: '你好，张明！👋\n\n你目前的求职状态是？\n\n① 在职，悄悄找机会\n② 已离职，专心求职\n③ 应届生，初次求职' },
  { role: 'user', text: '在职，悄悄找机会' },
  { role: 'ai', text: '了解！在职找机会，我们会保护你的隐私 🔒\n\n你的最高学历是？毕业学校和专业是什么？' },
  { role: 'user', text: '本科，上海交通大学，软件工程，2020年毕业' },
  { role: 'ai', text: '很棒！交大软工的背景很有竞争力 🎓\n\n接下来说说工作经历。请问你目前在哪家公司，担任什么职位？' },
]

type VoiceState = 'idle' | 'listening' | 'processing'

export default function Chat({ go }: { go: (s: Screen) => void }) {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const step = 4
  const total = 15

  const handleVoice = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening')
      setTimeout(() => setVoiceState('processing'), 2500)
      setTimeout(() => {
        setVoiceState('idle')
        setInput('目前在字节跳动担任产品经理，负责抖音电商方向')
        setMode('text')
      }, 4000)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white px-5 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => go('home')} className="w-8 h-8 flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-gray-900 font-bold text-sm">建立职业档案</p>
          <p className="text-gray-400 text-xs">第 {step} 步 / 共 {total} 步</p>
        </div>
        {/* 文字/语音模式切换 */}
        <div className="flex bg-gray-100 rounded-xl p-0.5">
          <button
            onClick={() => setMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'
            }`}
          >
            ⌨️ 文字
          </button>
          <button
            onClick={() => setMode('voice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'voice' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'
            }`}
          >
            🎙️ 语音
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="bg-white px-5 pb-3">
        <div className="bg-gray-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${(step / total) * 100}%`, background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-indigo-600 font-medium">{Math.round((step / total) * 100)}% 完成</span>
          <span className="text-xs text-gray-400">预计还需 4 分钟</span>
        </div>
      </div>

      {/* 模块进度 */}
      <div className="px-5 pb-2 bg-white">
        <div className="flex gap-1.5">
          {['基本信息', '教育', '工作经历', '技能', '意向'].map((label, i) => (
            <div
              key={label}
              className={`flex-1 py-1 rounded-lg text-center text-xs font-medium ${
                i < 2 ? 'bg-indigo-600 text-white' :
                i === 2 ? 'bg-indigo-100 text-indigo-600 ring-1 ring-indigo-400' :
                'bg-gray-100 text-gray-400'
              }`}
            >
              {i < 2 ? '✓' : label}
            </div>
          ))}
        </div>
      </div>

      {/* 对话区 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* AI typing */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 断点提示 */}
      <div className="mx-4 mb-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex items-center gap-2">
        <span className="text-sm">💾</span>
        <span className="text-amber-700 text-xs">进度已自动保存，可随时退出继续</span>
      </div>

      {/* 输入区 —— 文字模式 */}
      {mode === 'text' && (
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入你的回答..."
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-800 outline-none"
          />
          <button
            onClick={() => go('jd-input')}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      )}

      {/* 输入区 —— 语音模式 */}
      {mode === 'voice' && (
        <div className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col items-center gap-3">
          {voiceState === 'idle' && (
            <>
              <button
                onClick={handleVoice}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
              >
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>
              <p className="text-gray-500 text-xs">点击开始语音输入</p>
            </>
          )}

          {voiceState === 'listening' && (
            <>
              <div className="relative">
                <button
                  onClick={() => setVoiceState('idle')}
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-red-500"
                >
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
                {/* 音波动画 */}
                <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
              </div>
              {/* 音频波形动画 */}
              <div className="flex items-center gap-0.5 h-8">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-indigo-500 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 24 + 8}px`,
                      animationDelay: `${i * 50}ms`,
                      animationDuration: '0.6s'
                    }}
                  />
                ))}
              </div>
              <p className="text-red-500 text-xs font-medium">正在聆听... 点击停止</p>
            </>
          )}

          {voiceState === 'processing' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-50">
                <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              </div>
              <p className="text-gray-500 text-xs">AI识别中...</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
