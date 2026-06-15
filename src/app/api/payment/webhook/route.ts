import { NextResponse } from "next/server";
import { getSepayConfig } from "@/lib/sepay";

export async function POST(req: Request) {
  try {
    const config = getSepayConfig();
    const body = await req.json();

    // 1. Kiểm tra xác thực Webhook Secret Key gửi từ Sepay qua headers
    // Cổng Sepay thường gửi key trong header 'x-api-key' hoặc custom header tùy chọn
    const sepayKeyHeader = req.headers.get("x-sepay-secret-key") || req.headers.get("x-api-key");
    
    if (sepayKeyHeader && sepayKeyHeader !== config.webhookSecret) {
      return NextResponse.json({ error: "Lỗi xác thực Webhook Token!" }, { status: 401 });
    }

    // 2. Phân tích thông tin giao dịch nhận từ Sepay
    // Cấu trúc payload chuẩn của Sepay:
    // {
    //   id: 12345,
    //   amount_in: 500000,
    //   transaction_content: "INV994210",
    //   transaction_date: "2026-06-15 22:50:00",
    //   account_number: "19022026888",
    //   reference_number: "FT261688820"
    // }
    const amount = parseFloat(body.amount_in || "0");
    const content = (body.transaction_content || "").toUpperCase().trim();
    const txCode = body.reference_number || `FT_${Date.now()}`;

    console.log(`[Sepay Webhook] Giao dịch nạp tiền: ${amount}đ | Nội dung: "${content}" | Ref: ${txCode}`);

    if (amount <= 0 || !content) {
      return NextResponse.json({ status: "ignored", message: "Số tiền hoặc nội dung không hợp lệ" });
    }

    // 3. Phân loại đối soát giao dịch
    if (content.includes("DEP")) {
      // Đối soát NẠP VÍ THÀNH VIÊN
      console.log(`[Đối soát] Nhận yêu cầu nạp tiền ví thành viên. Mã nạp: ${content}`);
      return NextResponse.json({
        status: "success",
        type: "DEPOSIT",
        amount,
        code: content,
        message: `Đã cộng số dư ví +${amount.toLocaleString("vi-VN")}đ tự động thành công.`
      });
    } else if (content.includes("INV")) {
      // Đối soát THANH TOÁN ĐƠN HÀNG
      console.log(`[Đối soát] Nhận thanh toán cho đơn hàng. Mã hóa đơn: ${content}`);
      return NextResponse.json({
        status: "success",
        type: "PURCHASE",
        amount,
        code: content,
        message: "Đơn hàng đã được đổi sang trạng thái PAID, kích hoạt tài liệu số thành công."
      });
    }

    return NextResponse.json({ status: "ignored", message: "Nội dung chuyển khoản không chứa từ khóa đối soát" });
  } catch (error: any) {
    console.error("Lỗi webhook Sepay:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
