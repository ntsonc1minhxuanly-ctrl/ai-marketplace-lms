"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Cpu, Globe, Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại email!");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (e) {
      setError("Đã xảy ra lỗi hệ thống.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (mockEmail: string) => {
    setIsLoading(true);
    setEmail(mockEmail);
    const mockPassword = mockEmail === "thanhson029@gmail.com" ? "09082012a" : "password123";
    setPassword(mockPassword);
    
    try {
      const res = await signIn("credentials", {
        email: mockEmail,
        password: mockPassword,
        redirect: false,
      });

      if (res?.error) {
        setError("Lỗi đăng nhập tài khoản giả lập.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (e) {
      setError("Lỗi kết nối.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300">
          <ArrowLeft className="w-3.5 h-3.5" /> Về trang chủ
        </Link>
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl glass-panel bg-slate-900/80 shadow-2xl relative space-y-6">
        <div className="text-center space-y-2">
          <span className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 inline-flex text-white font-bold mb-2">
            AG
          </span>
          <h2 className="text-xl font-bold text-white">Chào Mừng Quay Trở Lại</h2>
          <p className="text-xs text-slate-400">Đăng nhập để xem khóa học, công cụ AI và số dư ví của bạn.</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/30 text-xs text-red-400 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> Email đăng nhập
            </label>
            <input
              type="email"
              placeholder="user@dev.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" /> Mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập bằng Email"}
          </button>
        </form>

        <div className="relative flex items-center justify-center text-xs">
          <span className="absolute w-full border-t border-white/5"></span>
          <span className="relative px-3 bg-slate-900 text-slate-500 uppercase font-semibold text-[9px] tracking-wider">
            Hoặc đăng nhập bằng
          </span>
        </div>

        {/* Google Mock CTA */}
        <button
          onClick={() => handleQuickLogin("user@dev.com")}
          className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Globe className="w-4 h-4 text-red-500" /> Google Account (NextAuth)
        </button>

        {/* Dev Quick Sandbox Accounts panel */}
        <div className="border-t border-white/5 pt-4 space-y-2">
          <p className="text-[10px] text-center text-cyan-400 font-bold uppercase tracking-wider">
            Tài khoản Sandbox dùng thử (Click đăng nhập ngay)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { email: "user@dev.com", name: "Khách hàng", style: "bg-slate-950 border-white/5 text-slate-300" },
              { email: "thanhson029@gmail.com", name: "Quản trị viên", style: "bg-blue-950/20 border-blue-800/20 text-blue-300" },
              { email: "affiliate@dev.com", name: "Affiliate CTV", style: "bg-purple-950/20 border-purple-800/20 text-purple-300" },
              { email: "instructor@dev.com", name: "Giảng viên", style: "bg-emerald-950/20 border-emerald-800/20 text-emerald-300" }
            ].map((acc, index) => (
              <button
                key={index}
                onClick={() => handleQuickLogin(acc.email)}
                className={`p-2 rounded-lg border text-[10px] font-bold text-left transition-colors hover:bg-white/5 ${acc.style}`}
              >
                <div>{acc.name}</div>
                <div className="text-[9px] font-normal opacity-60 truncate">{acc.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
