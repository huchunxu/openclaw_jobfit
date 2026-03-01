import { useState } from 'react'
import { Screen } from '../App'

const hotJobs = [
  { company: '字节跳动', title: '高级产品经理', salary: '30-50K', tags: ['电商','AI','北京'], hot: true },
  { company: '腾讯', title: '微信产品经理', salary: '35-60K', tags: ['社交','产品','深圳'], hot: true },
  { company: '阿里巴巴', title: '淘宝产品专家', salary: '40-70K', tags: ['电商','用户增长','杭州'], hot: false },
  { company: '美团', title: '增长产品经理', salary: '25-45K', tags: ['本地生活','增长','北京'], hot: false },
  { company: '小红书', title: '内容产品经理', salary: '20-40K', tags: ['内容社区','UGC','上海'], hot: true },
]

const searchResults = [
  { company: 'OPPO', title: '互联网产品经理', salary: '20-35K', tags: ['手机','软件','深圳'] },
  { company: '滴滴', title: '出行产品经理', salary: '25-45K', tags: ['出行','地图','北京'] },
  { company: '京东', title: '电商产品经理', salary: '22-40K', tags: ['电商','供应链','北京'] },
]

export default function JDSearch({ go }: { go: (s: Screen) => void }) {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [importing, setImporting] = useState<number | null>(null)
  const [imported, setImported] = useState<number[]>([])

  const handleSearch = () => {
    if (query.trim()) setSearched(true)
  }

  const handleImport = (i: number) => {
    setImporting(i)
    setTimeout(() => {
      setImporting(null)
      setImported(prev => [...prev, i])
    }, 1500)
  }

  const jobs = searched ? searchResults : hotJobs

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
          <h2 className="text-gray-900 font-bold text-sm">搜索岗位JD</h2>
          <p className="text-gray-400 text-xs">AI实时抓取招聘信息</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* 搜索框 */}
        <div className="flex gap-2">
          <div className="flex-1 bg-white rounded-2xl flex items-center px-4 gap-2 shadow-sm">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="输入岗位名称、公司或关键词..."
              className="flex-1 py-3 text-sm text-gray-700 outline-none bg-transparent"
            />
            {query && (
              <button onClick={() => { setQuery(''); setSearched(false) }} className="text-gray-300">✕</button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* 快速筛选 */}
        <div>
          <p className="text-xs text-gray-500 font-medium mb-2">快速筛选</p>
          <div className="flex flex-wrap gap-2">
            {['产品经理', '运营总监', 'UI设计', '数据分析', '算法工程师', '前端开发'].map(tag => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); setSearched(true) }}
                className="text-xs bg-white text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 来源平台 */}
        <div>
          <p className="text-xs text-gray-500 font-medium mb-2">数据来源</p>
          <div className="flex gap-2">
            {[
              { name: 'BOSS直聘', active: true },
              { name: '智联招聘', active: true },
              { name: '拉勾网', active: false },
              { name: '猎聘', active: false },
            ].map(p => (
              <span
                key={p.name}
                className={`text-xs px-2.5 py-1 rounded-full ${
                  p.active ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* 结果列表 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-900">
              {searched ? `搜索结果 "${query}"` : '🔥 热门岗位'}
            </p>
            {searched && <span className="text-xs text-gray-400">共 {searchResults.length} 条</span>}
          </div>

          <div className="space-y-3">
            {jobs.map((job, i) => {
              const isImporting = importing === i
              const isImported = imported.includes(i)
              return (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-gray-900 text-sm font-bold">{job.title}</p>
                        {'hot' in job && job.hot && (
                          <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full">热门</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mb-1">{job.company}</p>
                      <p className="text-indigo-600 text-xs font-medium mb-2">{job.salary}</p>
                      <div className="flex flex-wrap gap-1">
                        {job.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => !isImported && handleImport(i)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isImported
                          ? 'bg-green-50 text-green-600'
                          : isImporting
                          ? 'bg-indigo-50 text-indigo-400'
                          : 'text-white shadow-sm'
                      }`}
                      style={!isImported && !isImporting ? { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' } : {}}
                    >
                      {isImported ? '✓ 已引入' : isImporting ? '抓取中...' : '引入JD'}
                    </button>
                  </div>
                  {isImported && (
                    <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
                      <button
                        onClick={() => go('match-report')}
                        className="flex-1 h-8 rounded-xl text-xs font-medium text-white"
                        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                      >
                        ⚡ 立即匹配
                      </button>
                      <button
                        onClick={() => go('jd-input')}
                        className="flex-1 h-8 rounded-xl text-xs font-medium bg-gray-50 text-gray-600"
                      >
                        查看JD详情
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
