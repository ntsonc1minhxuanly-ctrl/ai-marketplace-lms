"use client";

import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Settings, 
  TrendingUp, 
  Layers, 
  Users, 
  Globe, 
  FileText, 
  Tag, 
  ShoppingBag, 
  Wallet, 
  AlertCircle,
  Zap
} from "lucide-react";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const user = session?.user as any;

  // Block access if not ADMIN role
  if (!session || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#070913] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4 bg-slate-900/60 p-8 rounded-2xl border border-white/5 backdrop-blur-xl">
          <div className="p-3.5 bg-red-950/30 border border-red-800/30 text-red-400 rounded-2xl inline-flex">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Quyền Truy Cập Bị Từ Chối</h2>
          <p className="text-xs text-slate-400">
            Bạn cần đăng nhập bằng tài khoản Quản trị viên của bạn (**thanhson029@gmail.com** / **09082012a**) để truy cập trang quản lý này.
          </p>
          <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all inline-block">
            Đăng nhập Admin
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { href: "/admin?tab=overview", tabId: "overview", label: "Tổng quan", icon: <TrendingUp className="w-4 h-4" /> },
    { href: "/admin?tab=admin_accounts", tabId: "admin_accounts", label: "Tài khoản quản trị", icon: <Users className="w-4 h-4" /> },
    { href: "/admin?tab=homepage_settings", tabId: "homepage_settings", label: "Trang chủ", icon: <Globe className="w-4 h-4" /> },
    { href: "/admin?tab=about_settings", tabId: "about_settings", label: "Về chúng tôi", icon: <Globe className="w-4 h-4" /> },
    { href: "/admin?tab=products", tabId: "products", label: "Quản lý Tool", icon: <Layers className="w-4 h-4" /> },
    { href: "/admin?tab=seo_settings", tabId: "seo_settings", label: "Viết bài SEO", icon: <FileText className="w-4 h-4" /> },
    { href: "/admin?tab=categories", tabId: "categories", label: "Danh mục & Thẻ", icon: <Tag className="w-4 h-4" /> },
    { href: "/admin?tab=vouchers", tabId: "vouchers", label: "Voucher", icon: <Tag className="w-4 h-4" /> },
    { href: "/admin?tab=orders", tabId: "orders", label: "Đơn hàng", icon: <ShoppingBag className="w-4 h-4" /> },
    { href: "/admin?tab=customers", tabId: "customers", label: "Tài khoản KH", icon: <Users className="w-4 h-4" /> },
    { href: "/admin?tab=affiliate", tabId: "affiliate", label: "Affiliate", icon: <Users className="w-4 h-4" /> },
    { href: "/admin/thanh-toan", tabId: "thanh-toan", label: "Thanh toán", icon: <Wallet className="w-4 h-4" /> },
    { href: "/admin?tab=site_settings", tabId: "site_settings", label: "Cài đặt chung", icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0c16] border-r border-white/5 p-4 shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo Branding */}
          <div className="flex items-center gap-2 px-2 py-4 mb-6 border-b border-white/5">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-wider uppercase block">Admin</span>
              <span className="text-[10px] text-slate-500 font-semibold block -mt-0.5">King Automation AI</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isThanhToan = item.tabId === "thanh-toan";
              const isActive = isThanhToan 
                ? pathname.startsWith("/admin/thanh-toan") 
                : (pathname === "/admin" && !pathname.startsWith("/admin/thanh-toan") && activeTab === item.tabId);

              return (
                <Link
                  key={item.tabId}
                  href={item.href}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all flex items-center gap-3 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/30 to-purple-600/20 border-l-2 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.15)] font-bold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-slate-600 text-center">
          © 2026 King Automation AI
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#070913]">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Đang tải Admin CMS...</div>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
