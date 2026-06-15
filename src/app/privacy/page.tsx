import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-xs md:text-sm text-slate-300 leading-relaxed">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-6">Chính Sách Bảo Mật (Privacy Policy)</h1>
      
      <div className="glass-panel p-6 rounded-2xl bg-slate-900/60 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Thu thập thông tin cá nhân</h2>
        <p>
          Khi quý khách đăng ký tài khoản, giao dịch nạp tiền hoặc mua hàng, chúng tôi thu thập thông tin bao gồm: Họ tên, địa chỉ email, số điện thoại, thông tin ví điện tử ngân hàng và lịch sử giao dịch. Thông tin này giúp chúng tôi đối soát tự động qua Sepay và cấp quyền truy cập sản phẩm số.
        </p>

        <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Sử dụng thông tin</h2>
        <p>
          Thông tin được thu thập chỉ dùng cho mục đích:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Xử lý và hoàn tất giao dịch thanh toán mua hàng.</li>
          <li>Kích hoạt khóa học và cấp mã bản quyền tự động.</li>
          <li>Gửi thông báo cập nhật sản phẩm số và email hướng dẫn sử dụng.</li>
          <li>Thực hiện chương trình tiếp thị liên kết (Affiliate).</li>
        </ul>

        <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Bảo mật giao dịch</h2>
        <p>
          Dữ liệu giao dịch ngân hàng của bạn được mã hóa an toàn và kiểm tra đối chiếu trực tiếp thông qua cổng Sepay kết nối ngân hàng. Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn cho bên thứ ba ngoại trừ trường hợp được yêu cầu bởi cơ quan pháp luật Việt Nam.
        </p>
      </div>
    </div>
  );
}
