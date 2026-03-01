import { useState } from 'react'
import Splash from './screens/Splash'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Chat from './screens/Chat'
import JDInput from './screens/JDInput'
import JDSearch from './screens/JDSearch'
import MatchReport from './screens/MatchReport'
import ResumeHub from './screens/ResumeHub'
import ResumeDetail from './screens/ResumeDetail'
import ApplicationTracker from './screens/ApplicationTracker'
import Profile from './screens/Profile'

export type Screen =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'chat'
  | 'jd-input'
  | 'jd-search'
  | 'match-report'
  | 'resume-hub'
  | 'resume-detail'
  | 'tracker'
  | 'profile'

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const go = (s: Screen) => setScreen(s)

  const navItems: { screen: Screen; label: string; icon: string }[] = [
    { screen: 'splash',       label: '启动页',   icon: '🚀' },
    { screen: 'onboarding',   label: '引导页',   icon: '👋' },
    { screen: 'home',         label: '首页',     icon: '🏠' },
    { screen: 'chat',         label: '对话采集', icon: '💬' },
    { screen: 'jd-input',     label: 'JD输入',   icon: '📋' },
    { screen: 'jd-search',    label: 'JD搜索',   icon: '🔍' },
    { screen: 'match-report', label: '匹配报告', icon: '⚡' },
    { screen: 'resume-hub',   label: '简历中心', icon: '📄' },
    { screen: 'resume-detail',label: '简历详情', icon: '✏️' },
    { screen: 'tracker',      label: '投递管理', icon: '📮' },
    { screen: 'profile',      label: '我的',     icon: '👤' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 gap-6">
      {/* 导航面板 */}
      <div className="sticky top-4 w-44 bg-white rounded-2xl shadow-lg p-3 flex-shrink-0 mt-10">
        <p className="text-xs font-bold text-gray-500 mb-2 px-1">📱 页面导航</p>
        <div className="space-y-0.5">
          {navItems.map(({ screen: s, label, icon }) => (
            <button
              key={s}
              onClick={() => go(s)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all text-xs font-medium ${
                screen === s
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 px-1">💡 点击页面内按钮可跳转</p>
        </div>
      </div>

      {/* 手机外框 */}
      <div className="relative flex-shrink-0" style={{ width: 390, height: 844 }}>
        <div className="absolute inset-0 bg-gray-900 rounded-[48px] shadow-2xl" />
        <div className="absolute inset-[3px] bg-white rounded-[46px] overflow-hidden flex flex-col">
          {/* 状态栏 */}
          <div className="h-12 bg-white flex items-center justify-between px-6 pt-2 flex-shrink-0">
            <span className="text-xs font-semibold text-gray-900">9:41</span>
            <div className="w-28 h-6 bg-gray-900 rounded-full" />
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5 items-end h-3">
                <div className="w-1 h-1 bg-gray-900 rounded-sm" />
                <div className="w-1 h-2 bg-gray-900 rounded-sm" />
                <div className="w-1 h-3 bg-gray-900 rounded-sm" />
              </div>
              <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
              </svg>
              <svg className="w-5 h-3 text-gray-900" fill="currentColor" viewBox="0 0 24 12">
                <rect x="0" y="1" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="1.5" y="2.5" width="14" height="7" rx="1" fill="currentColor"/>
                <path d="M21 4v4a2 2 0 000-4z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* 页面内容 */}
          <div className="flex-1 overflow-hidden">
            {screen === 'splash'        && <Splash go={go} />}
            {screen === 'onboarding'    && <Onboarding go={go} />}
            {screen === 'home'          && <Home go={go} />}
            {screen === 'chat'          && <Chat go={go} />}
            {screen === 'jd-input'      && <JDInput go={go} />}
            {screen === 'jd-search'     && <JDSearch go={go} />}
            {screen === 'match-report'  && <MatchReport go={go} />}
            {screen === 'resume-hub'    && <ResumeHub go={go} />}
            {screen === 'resume-detail' && <ResumeDetail go={go} />}
            {screen === 'tracker'       && <ApplicationTracker go={go} />}
            {screen === 'profile'       && <Profile go={go} />}
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60" />
      </div>
    </div>
  )
}
