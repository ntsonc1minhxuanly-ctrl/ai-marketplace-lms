import React from "react";

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-xs md:text-sm text-slate-300 leading-relaxed">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-6">Chính Sách Hoàn Tiền (Refund Policy)</h1>
      
      <div className="glass-panel p-6 rounded-2xl bg-slate-900/60 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Đặc thù của sản phẩm số</h2>
        <p>
          Do các sản phẩm của Antigravity bao gồm khóa học video trực tuyến, tài liệu PDF, kịch bản JSON và template Notion là các sản phẩm số có đặc thù tải về ngay lập tức sau khi kích hoạt thanh toán. Vì vậy, chúng tôi không hỗ trợ hoàn trả tiền mặt nếu lý do đến từ phía chủ quan của khách hàng.
        </p>

        <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Các trường hợp được hoàn tiền</h2>
        <p>
          Chúng tôi cam kết hoàn trả 100% chi phí mua hàng hoặc cộng lại số dư ví nếu:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Liên kết tải file hoặc key bản quyền bị hỏng mà đội ngũ kỹ thuật không thể khắc phục trong vòng 48 giờ.</li>
          <li>Tài khoản AI Premium (ChatGPT Plus, Midjourney) dùng chung bị lỗi đăng nhập liên tục quá 3 ngày làm gián đoạn công việc của bạn.</li>
          <li>Bạn chuyển khoản thừa so với hóa đơn tạo ra (phần thừa sẽ được tự động cộng vào Ví tiền tài khoản).</li>
        </ul>

        <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Quy trình gửi yêu cầu hoàn tiền</h2>
        <p>
          Quý khách gửi email yêu cầu về hộp thư **support@antigravity.vn** kèm theo thông tin mã hóa đơn (Ví dụ: INV12345) và minh chứng hình ảnh/video mô tả lỗi. Đội ngũ đối soát tài chính sẽ hoàn tất xử lý và chuyển khoản hoàn tiền trong vòng 5 ngày làm việc.
        </p>
      </div>
    </div>
  );
}
