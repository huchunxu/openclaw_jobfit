"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // 通知设置
    email_notification: true,
    sms_notification: true,
    wechat_notification: true,
    resume_completed: true,
    interview_reminder: true,
    weekly_report: false,
    new_matches: true,
    
    // 隐私设置
    profile_visible: true,
    allow_share: true,
    
    // 账号设置
    email: "zhangsan@example.com",
    phone: "138****8888",
    wechat_bound: true,
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← 返回
            </Link>
            <h1 className="text-xl font-bold">设置</h1>
          </div>
          <button 
            onClick={handleSave}
            className="text-indigo-600 font-medium"
          >
            {saved ? "✓ 已保存" : "保存"}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* 通知设置 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">🔔 通知设置</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">邮件通知</div>
                  <div className="text-sm text-gray-500">通过邮件接收重要通知</div>
                </div>
                <button
                  onClick={() => handleToggle("email_notification")}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.email_notification ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                    settings.email_notification ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">短信通知</div>
                  <div className="text-sm text-gray-500">通过短信接收重要通知</div>
                </div>
                <button
                  onClick={() => handleToggle("sms_notification")}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.sms_notification ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                    settings.sms_notification ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">微信通知</div>
                  <div className="text-sm text-gray-500">通过微信接收通知</div>
                </div>
                <button
                  onClick={() => handleToggle("wechat_notification")}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.wechat_notification ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                    settings.wechat_notification ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              <hr className="my-4" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">简历生成完成</div>
                  <div className="text-sm text-gray-500">简历生成完成后通知</div>
                </div>
                <button
                  onClick={() => handleToggle("resume_completed")}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.resume_completed ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                    settings.resume_completed ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">面试提醒</div>
                  <div className="text-sm text-gray-500">面试时间前提醒</div>
                </div>
                <button
                  onClick={() => handleToggle("interview_reminder")}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.interview_reminder ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                    settings.interview_reminder ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">周报订阅</div>
                  <div className="text-sm text-gray-500">每周发送求职进度周报</div>
                </div>
                <button
                  onClick={() => handleToggle("weekly_report")}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.weekly_report ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                    settings.weekly_report ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">新岗位推荐</div>
                  <div className="text-sm text-gray-500">有新匹配的岗位时通知</div>
                </div>
                <button
                  onClick={() => handleToggle("new_matches")}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.new_matches ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                    settings.new_matches ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* 隐私设置 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">🔒 隐私设置</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">档案可见性</div>
                  <div className="text-sm text-gray-500">允许其他人查看我的档案</div>
                </div>
                <button
                  onClick={() => handleToggle("profile_visible")}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.profile_visible ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                    settings.profile_visible ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">允许分享</div>
                  <div className="text-sm text-gray-500">允许分享我的匹配结果</div>
                </div>
                <button
                  onClick={() => handleToggle("allow_share")}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.allow_share ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                    settings.allow_share ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* 账号信息 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">👤 账号信息</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t">
                <div>
                  <div className="font-medium">微信绑定</div>
                  <div className="text-sm text-gray-500">
                    {settings.wechat_bound ? "✓ 已绑定" : "未绑定"}
                  </div>
                </div>
                <button className="text-indigo-600 text-sm">
                  {settings.wechat_bound ? "解绑" : "绑定"}
                </button>
              </div>
            </div>
          </div>

          {/* 其他操作 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">⚙️ 其他</h2>
            
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50">
                📖 使用帮助
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50">
                📄 服务条款
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50">
                🔐 隐私政策
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600">
                🚪 退出登录
              </button>
            </div>
          </div>

          {/* 版本信息 */}
          <div className="text-center text-sm text-gray-400 py-4">
            JobFit v1.0.0 · © 2026
          </div>
        </div>
      </div>
    </div>
  );
}