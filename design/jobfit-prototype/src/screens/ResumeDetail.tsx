import { useState } from 'react'
import { Screen } from '../App'

export default function ResumeDetail({ go }: { go: (s: Screen) => void }) {
  const [tab, setTab] = useState<'preview' | 'edit' | 'log'>('preview')

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white px-5 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => go('resume-hub')}>
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-gray-900 font-bold text-sm">字节跳动 · 高级产品经理</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">匹配 73分</span>
            <span className="text-xs text-gray-400">版本 3/3</span>
          </div>
        </div>
        <button className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">导出</button>
      </div>

      {/* ATS评分条 */}
      <div className="bg-white px-5 py-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">ATS友好度</span>
          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-green-500" style={{ width: '88%' }} />
          </div>
          <span className="text-xs font-bold text-green-600">88分</span>
          <span className="text-xs text-gray-400">优秀</span>
        </div>
      </div>

      {/* Tab */}
      <div className="bg-white px-5 py-2 flex gap-4 border-b border-gray-100">
        {[['preview','预览'], ['edit','编辑'], ['log','AI日志']] .map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as 'preview' | 'edit' | 'log')}
            className={`pb-2 text-sm font-medium border-b-2 transition-all ${
              tab === key ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-transparent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'preview' && (
          <div className="bg-white mx-4 my-3 rounded-2xl shadow-sm p-5 text-xs leading-relaxed">
            {/* 简历内容 */}
            <div className="border-b border-gray-100 pb-3 mb-3">
              <h1 className="text-base font-bold text-gray-900">张 明</h1>
              <p className="text-gray-500 text-xs mt-0.5">138xxxx1234 · zhangming@email.com · 上海</p>
              <p className="text-gray-500 text-xs">github.com/zhangming</p>
            </div>

            <div className="mb-3">
              <h2 className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">个人简介</h2>
              <p className="text-gray-600 text-xs leading-relaxed">
                <span className="bg-yellow-100">产品经理</span>，上海交通大学软件工程本科，4年互联网产品经验，擅长
                <span className="bg-yellow-100">用户研究</span>与
                <span className="bg-yellow-100">数据驱动</span>的产品决策，有完整的
                <span className="bg-yellow-100">产品规划</span>和跨团队协作经验。
              </p>
            </div>

            <div className="mb-3">
              <h2 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">工作经历</h2>
              <div className="mb-2">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-800">XX科技有限公司 · 产品经理</p>
                  <p className="text-xs text-gray-400">2022.07 - 至今</p>
                </div>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li className="flex gap-1"><span>·</span><span>主导<span className="bg-yellow-100">电商</span>核心功能<span className="bg-yellow-100">产品规划</span>，输出完整PRD，推动3个版本迭代，用户留存率提升<strong>28%</strong></span></li>
                  <li className="flex gap-1"><span>·</span><span>执行200+<span className="bg-yellow-100">用户研究</span>访谈，提炼核心痛点，驱动功能优化，DAU增长<strong>42%</strong></span></li>
                  <li className="flex gap-1"><span>·</span><span>跨团队<span className="bg-yellow-100">项目管理</span>，协调研发/设计/运营，按时交付率<strong>95%</strong></span></li>
                </ul>
              </div>
            </div>

            <div className="mb-3">
              <h2 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">教育背景</h2>
              <div className="flex justify-between">
                <p className="text-xs font-semibold text-gray-800">上海交通大学 · 软件工程 · 本科</p>
                <p className="text-xs text-gray-400">2016-2020</p>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">技能</h2>
              <p className="text-gray-600 text-xs">产品规划 | 用户研究 | <span className="bg-yellow-100">数据分析</span> | Axure | JIRA | Python基础</p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-yellow-300 rounded-sm inline-block" />
              <span className="text-gray-400 text-xs">黄色标注为AI植入的JD关键词</span>
            </div>
          </div>
        )}

        {tab === 'edit' && (
          <div className="px-4 py-3 space-y-3">
            {['个人简介','工作经历','教育背景','技能'].map(section => (
              <div key={section} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-800">{section}</p>
                  <button className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">AI优化</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">点击编辑 {section} 内容...</div>
              </div>
            ))}
            <div className="bg-indigo-50 rounded-2xl p-4">
              <p className="text-indigo-800 text-xs font-medium mb-1">💡 生成策略调整</p>
              <div className="flex flex-wrap gap-2">
                {['默认','突出技术','突出管理','突出成果'].map((s, i) => (
                  <button key={s} className={`text-xs px-3 py-1.5 rounded-full ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>{s}</button>
                ))}
              </div>
              <button className="w-full mt-3 h-10 bg-indigo-600 text-white rounded-xl text-sm font-medium">重新生成</button>
            </div>
          </div>
        )}

        {tab === 'log' && (
          <div className="px-4 py-3 space-y-2">
            <p className="text-gray-500 text-xs mb-3">AI共进行了 8 项优化操作</p>
            {[
              { action: '关键词植入', detail: '在工作经历[0]中植入"产品规划"', type: 'keyword' },
              { action: '关键词植入', detail: '在个人简介中植入"数据驱动"', type: 'keyword' },
              { action: '成果量化', detail: '"提升了留存" → "用户留存率提升28%"', type: 'quantify' },
              { action: '动词升维', detail: '"负责产品" → "主导产品规划"', type: 'verb' },
              { action: '结构排序', detail: '将电商相关经历调整至工作经历首位', type: 'order' },
              { action: 'ATS优化', detail: '调整日期格式为"2022.07 - 至今"', type: 'ats' },
            ].map((log, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm flex gap-3">
                <span className={`text-lg flex-shrink-0 ${
                  log.type === 'keyword' ? '' :
                  log.type === 'quantify' ? '' : ''
                }`}>
                  {log.type === 'keyword' ? '🔑' : log.type === 'quantify' ? '📊' : log.type === 'verb' ? '✏️' : log.type === 'order' ? '↕️' : '⚙️'}
                </span>
                <div>
                  <p className="text-gray-800 text-xs font-medium">{log.action}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div className="bg-white border-t border-gray-100 px-5 py-3 flex gap-2">
        <button className="flex-1 h-11 rounded-2xl border border-gray-200 text-gray-600 text-sm font-medium">分享链接</button>
        <button
          className="flex-2 flex-grow-[2] h-11 rounded-2xl text-white text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          导出 PDF / Word
        </button>
      </div>
    </div>
  )
}
