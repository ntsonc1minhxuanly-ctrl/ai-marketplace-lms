import { NextResponse } from "next/server";
import { getSepayConfig, globalPaidOrders } from "@/lib/sepay";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get("orderCode")?.toUpperCase().trim();

    if (!orderCode) {
      return NextResponse.json({ error: "Thiếu tham số orderCode" }, { status: 400 });
    }

    // 1. Kiểm tra trong cache xem có đơn hàng nào được đánh dấu thanh toán thành công (qua webhook)
    if (globalPaidOrders.has(orderCode)) {
      return NextResponse.json({ paid: true, source: "webhook_cache" });
    }

    // 2. Nếu chưa có trong cache, và API key là thật, ta sẽ chủ động gọi API SePay v2 để quét giao dịch
    const config = getSepayConfig();
    const apiKey = (searchParams.get("apiKey") || config.apiKey)?.trim();

    if (apiKey && !apiKey.startsWith("sepay_api_key_test_") && apiKey !== "test" && apiKey !== "demo") {
      try {
        console.log(`[Check Status] Đang thăm dò SePay API v2 cho mã: ${orderCode}`);
        const res = await fetch("https://userapi.sepay.vn/v2/transactions", {
          headers: {
            Authorization: `Bearer ${apiKey}`
          },
          next: { revalidate: 0 } as any
        });

        if (res.ok) {
          const json = await res.json();
          if (json.status === "success" && Array.isArray(json.data)) {
            // Duyệt qua danh sách giao dịch để xem có giao dịch nào khớp với orderCode không
            const foundTx = json.data.find((tx: any) => {
              const content = (tx.transaction_content || "").toUpperCase();
              return content.includes(orderCode);
            });

            if (foundTx) {
              console.log(`[Check Status] Tìm thấy giao dịch khớp trên SePay API: ${foundTx.amount_in}đ`);
              globalPaidOrders.add(orderCode);
              return NextResponse.json({ paid: true, source: "sepay_api" });
            }
          }
        } else {
          console.error(`[Check Status] API SePay v2 trả về mã lỗi: ${res.status}`);
        }
      } catch (err) {
        console.error("[Check Status] Lỗi kết nối SePay API:", err);
      }
    }

    return NextResponse.json({ paid: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
