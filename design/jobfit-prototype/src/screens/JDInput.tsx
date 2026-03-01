import { useState } from 'react'
import { Screen } from '../App'

export default function JDInput({ go }: { go: (s: Screen) => void }) {
  const [tab, setTab] = useState<'paste' | 'link'>('paste')
  const [jd, setJd] = useState('')
  const [parsing, setParsing] = useState(false)

  const sample = `岗位：高级产品经理
公司：字节跳动（抖音电商方向）
薪资：30-50K · 15薪
地点：北京

岗位职责：
1. 负责抖音电商核心功能规划，输出完整PRD
2. 深度参与用户调研，挖掘核心需求
3. 跨团队协调研发、设计、运营推进落地
4. 数据驱动产品迭代，持续优化关键指标

任职要求：
1. 本科及以上学历，计算机/互联网相关专业优先
2. 3年以上电商或内容平台产品经验
3. 熟练使用数据分析工具（SQL/Python加分）
4. 优秀的沟通协调能力和项目管理能力
5. 有用户增长、交易转化相关经验者优先`

  const handleParse = () => {
    setParsing(true)
    setTimeout(() => {
      setParsing(false)
      go('match-report')
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white px-5 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => go('home')}>
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="flex-1 text-gray-900 font-bold text-base">输入目标岗位</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
      {/* Tab */}
        <div className="bg-gray-100 rounded-2xl p-1 flex">
          <button
            onClick={() => setTab('paste')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === 'paste' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            📋 粘贴文本
          </button>
          <button
            onClick={() => setTab('link')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === 'link' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            🔗 招聘链接
          </button>
          <button
            onClick={() => go('jd-search')}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-indigo-600 transition-all"
          >
            🔍 搜索
          </button>
        </div>

        {tab === 'paste' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 text-sm font-medium">岗位描述（JD）</p>
              <button
                onClick={() => setJd(sample)}
                className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg"
              >
                填入示例
              </button>
            </div>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="从BOSS直聘、智联招聘等平台复制岗位JD，粘贴到这里..."
              className="w-full h-52 bg-white rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none shadow-sm resize-none placeholder-gray-300"
            />
            {jd && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <span className="text-green-500">✓</span>
                已输入 {jd.length} 字
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-700 text-sm font-medium mb-2">招聘链接</p>
            <input
              placeholder="粘贴BOSS直聘/智联/拉勾的岗位链接..."
              className="w-full bg-white rounded-2xl px-4 py-3.5 text-sm text-gray-700 outline-none shadow-sm"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {['BOSS直聘', '智联招聘', '拉勾网', '猎聘'].map(p => (
                <span key={p} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{p}</span>
              ))}
            </div>
          </div>
        )}

        {/* 档案状态提示 */}
        <div className="bg-indigo-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">👤</span>
          </div>
          <div className="flex-1">
            <p className="text-indigo-900 text-sm font-medium">使用张明的档案匹配</p>
            <p className="text-indigo-400 text-xs">档案完整度 75% · 上海交大 · 软件工程 · 4年经验</p>
          </div>
          <button className="text-indigo-600 text-xs">切换</button>
        </div>

        {/* 说明 */}
        <div className="space-y-2">
          <p className="text-gray-500 text-xs font-medium">AI将自动分析：</p>
          <div className="grid grid-cols-2 gap-2">
            {['岗位核心要求', '技能权重排序', '经验年限要求', '隐性能力需求'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-indigo-500 text-xs">✓</span>
                <span className="text-gray-600 text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="bg-white border-t border-gray-100 px-5 py-4">
        <button
          onClick={handleParse}
          disabled={!jd && tab === 'paste'}
          className={`w-full h-14 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
            (jd || tab === 'link')
              ? 'text-white shadow-lg'
              : 'bg-gray-100 text-gray-400'
          }`}
          style={jd || tab === 'link' ? { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' } : {}}
        >
          {parsing ? (
            <>
              <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>AI解析中...</span>
            </>
          ) : (
            <>⚡ AI立即分析匹配度</>
          )}
        </button>
        <p className="text-center text-gray-400 text-xs mt-2">解析大约需要 3-8 秒</p>
      </div>
    </div>
  )
}
