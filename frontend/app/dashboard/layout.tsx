"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "工作台", icon: "🏠" },
    { href: "/jd/upload", label: "上传JD", icon: "📋" },
    { href: "/resume/generate", label: "生成简历", icon: "📄" },
    { href: "/profile", label: "个人信息", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左侧导航 */}
      <aside className="w-56 bg-white shadow-sm">
        <div className="p-4">
          <Link href="/dashboard" className="block">
            <h1 className="text-2xl font-bold text-indigo-600">JobFit</h1>
          </Link>
        </div>
        
        <nav className="px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-56 p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-medium">张</span>
            </div>
            <div>
              <div className="font-medium">张三</div>
              <div className="text-sm text-gray-500">个人版</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 右侧内容 */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}