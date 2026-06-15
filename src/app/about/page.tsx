import React from "react";
import { ShieldCheck, Mail, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold text-white">Về Chúng Tôi (About Us)</h1>
        <p className="text-xs text-slate-400">Sứ mệnh nâng tầm năng suất lập trình & kinh doanh số tại Việt Nam.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl bg-slate-900/60 space-y-6 text-xs md:text-sm leading-relaxed text-slate-300">
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            1. Chúng tôi là ai?
          </h2>
          <p>
            Được thành lập vào đầu năm 2024, **Antigravity AI** tự hào là cổng phân phối giải pháp tự động hóa quy trình no-code, thư viện prompt, kịch bản workflow n8n và các khóa học kỹ năng công nghệ thực chiến đầu tiên tại Việt Nam.
          </p>
          <p>
            Chúng tôi đại diện cho làn sóng tối ưu hóa năng suất mới, giúp các startups, agencies, marketers tự xây dựng hệ thống vận hành tự động hiệu quả cao mà không cần đến đội ngũ kỹ thuật phức tạp.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-blue-400" />
            2. Trụ sở pháp lý doanh nghiệp
          </h2>
          <p>
            **Công ty TNHH Giải Pháp Công Nghệ Antigravity Việt Nam**  
            * **Mã số doanh nghiệp (MST)**: 0317894562 do Sở KH&ĐT TP.HCM cấp ngày 12/03/2024.  
            * **Địa chỉ trụ sở chính**: Số 12 Khu đô thị Sala, Phường An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh, Việt Nam.  
            * **Hotline chăm sóc**: +84 (0) 987 654 321  
            * **Email chính thức**: support@antigravity.vn  
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <Mail className="w-5 h-5 text-purple-400" />
            3. Cam kết chất lượng
          </h2>
          <p>
            Mọi sản phẩm số đăng tải tại Antigravity (gồm kịch bản flow n8n/Make, ebook, prompt, tài khoản chia sẻ) đều được kiểm định kỹ thuật khắt khe. Chúng tôi cam kết bảo mật 100% dữ liệu thanh toán của người dùng thông qua các ngân hàng đối tác Napas247 hàng đầu Việt Nam.
          </p>
        </div>
      </div>
    </div>
  );
}
