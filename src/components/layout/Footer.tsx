import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-slate-950 pt-16 pb-8 text-slate-400 mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.05),transparent_60%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Intro */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-xs">
                AG
              </span>
              <span className="text-lg font-bold text-white">
                Antigravity<span className="text-blue-500 text-xs ml-0.5">AI</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Nền tảng thương mại điện tử phân phối công cụ AI, khóa học công nghệ tự động hóa, tài liệu số hàng đầu Việt Nam. Tối ưu chuyển đổi và tự động hóa vận hành.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2.5 py-1 rounded-full w-max">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Đại lý ủy quyền Google AI Studio 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Danh mục sản phẩm</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop?type=AI_TOOL" className="hover:text-white transition-colors">Công cụ AI độc quyền</Link></li>
              <li><Link href="/shop?type=COURSE" className="hover:text-white transition-colors">Khóa học Automations</Link></li>
              <li><Link href="/shop?type=PROMPT" className="hover:text-white transition-colors">Thư viện Prompt mẫu</Link></li>
              <li><Link href="/shop?type=TEMPLATE" className="hover:text-white transition-colors">Template Notion & Figma</Link></li>
              <li><Link href="/shop?type=AI_ACCOUNT" className="hover:text-white transition-colors">Tài khoản AI Premium</Link></li>
            </ul>
          </div>

          {/* EEAT Policy Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Chính sách & Pháp lý</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">Về chúng tôi (About Us)</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật (Privacy Policy)</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ (Terms)</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Chính sách hoàn tiền (Refund Policy)</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Liên hệ hỗ trợ</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Thông tin doanh nghiệp</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Số 12 Khu đô thị Sala, Phường An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-500 shrink-0" />
                <span>+84 (0) 987 654 321</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>support@antigravity.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Antigravity AI Vietnam. Bản quyền được bảo lưu.</p>
          <div className="flex gap-4">
            <span className="text-slate-500">MST: 0317894562</span>
            <span className="text-slate-500">Giấy phép số: 24/GP-BTTTT cấp bởi Bộ TT&TT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
