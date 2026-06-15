import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-xs md:text-sm text-slate-300 leading-relaxed">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-6">Điều Khoản Dịch Vụ (Terms of Service)</h1>
      
      <div className="glass-panel p-6 rounded-2xl bg-slate-900/60 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Bản quyền và Giấy phép sản phẩm</h2>
        <p>
          Mọi kịch bản tự động hóa n8n, template Notion, Ebook và tài liệu học tập được cấp phép cho khách hàng sử dụng cá nhân hoặc nội bộ doanh nghiệp. Khách hàng không được quyền sao chép thương mại, bán lại hoặc phân phối trái phép các sản phẩm số này trên các kênh chia sẻ công cộng.
        </p>

        <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Quy định sử dụng tài khoản AI</h2>
        <p>
          Đối với tài khoản dùng chung (ChatGPT Plus, Midjourney), quý khách cần tuân thủ nghiêm ngặt hướng dẫn sử dụng: không thay đổi thông tin mật khẩu, không chia sẻ cho người khác ngoài số lượng session quy định. Mọi hành vi vi phạm sẽ bị khóa tài khoản vĩnh viễn và không được hoàn tiền.
        </p>

        <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Hạn ngạch và giới hạn AI Tool</h2>
        <p>
          Các công cụ AI trực tiếp trên Antigravity được tính phí dựa trên số dư ví hoặc cấp miễn phí hàng ngày cho tài khoản thành viên. Quý khách không được chạy các mã lệnh cào dữ liệu (scraping) hoặc spam gửi yêu cầu liên tục làm tắc nghẽn API Google AI Studio Hub.
        </p>
      </div>
    </div>
  );
}
