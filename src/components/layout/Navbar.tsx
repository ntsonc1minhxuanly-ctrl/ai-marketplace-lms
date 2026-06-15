"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { 
  ShoppingBag, 
  Wallet, 
  Bell, 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  BookOpen, 
  LogOut, 
  Cpu, 
  Settings, 
  Share2, 
  DollarSign 
} from "lucide-react";

interface NavbarProps {
  onToggleCart: () => void;
  onToggleNotifications: () => void;
  unreadCount: number;
}

export default function Navbar({ onToggleCart, onToggleNotifications, unreadCount }: NavbarProps) {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const user = session?.user as any;

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/8 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="p-2 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold group-hover:scale-105 transition-transform">
                AG
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
                Antigravity<span className="text-blue-500 font-extrabold text-sm ml-0.5">AI</span>
              </span>
            </Link>
            {/* Desktop Menu */}
            <div className="hidden md:flex ml-10 space-x-6">
              <Link href="/shop" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Cửa hàng</Link>
              <Link href="/ai-tools" className="text-slate-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                <Cpu className="w-4 h-4 text-cyan-400" /> Công cụ AI
              </Link>
              <Link href="/ai-studio-hub" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Google AI Studio</Link>
              <Link href="/blog" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Tin tức</Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wallet Balance */}
            {session && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/50 border border-blue-800/40 text-xs font-semibold text-blue-300">
                <Wallet className="w-3.5 h-3.5" />
                <span>{user?.balance?.toLocaleString("vi-VN")}đ</span>
              </div>
            )}

            {/* Notification Bell */}
            <button 
              onClick={onToggleNotifications}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full text-glow"></span>
              )}
            </button>

            {/* Mini Cart Button */}
            <button 
              onClick={onToggleCart}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.[0] || "U"}
                  </div>
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/8 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-20">
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-purple-900/50 text-purple-300 border border-purple-800/30 uppercase">
                          {user?.role}
                        </span>
                      </div>
                      
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Tổng quan
                      </Link>
                      <Link href="/dashboard?tab=wallet" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                        <Wallet className="w-4 h-4" /> Ví tiền & Nạp tiền
                      </Link>
                      <Link href="/dashboard?tab=courses" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                        <BookOpen className="w-4 h-4" /> Khóa học đang học
                      </Link>
                      <Link href="/dashboard?tab=referral" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                        <Share2 className="w-4 h-4" /> Cộng tác viên / Ref
                      </Link>
                      <Link href="/dashboard?tab=affiliate" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                        <DollarSign className="w-4 h-4" /> Affiliate Dashboard
                      </Link>

                      {user?.role === "ADMIN" && (
                        <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-blue-400 hover:text-white hover:bg-blue-600/10 transition-colors border-t border-white/5 mt-1">
                          <Settings className="w-4 h-4" /> Admin CMS
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-white hover:bg-red-600/10 transition-colors border-t border-white/5 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {session && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/50 border border-blue-800/40 text-[10px] font-semibold text-blue-300">
                <Wallet className="w-3 h-3" />
                <span>{user?.balance?.toLocaleString("vi-VN")}đ</span>
              </div>
            )}
            <button
              onClick={onToggleCart}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950 px-4 pt-2 pb-4 space-y-3">
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Cửa hàng</Link>
          <Link href="/ai-tools" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Công cụ AI</Link>
          <Link href="/ai-studio-hub" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Google AI Studio</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Tin tức</Link>
          
          {session ? (
            <div className="border-t border-white/5 pt-3 space-y-1">
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Tổng quan Dashboard</Link>
              <Link href="/dashboard?tab=wallet" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Ví tiền & Nạp tiền</Link>
              <Link href="/dashboard?tab=courses" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Khóa học</Link>
              {user?.role === "ADMIN" && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-blue-400 hover:text-white hover:bg-slate-800">Admin CMS</Link>
              )}
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:text-white hover:bg-slate-800"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              onClick={() => setMenuOpen(false)}
              className="block text-center w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
