import { NextResponse } from "next/server";
import { getSepayConfig, updateSepayConfig, verifySepayApiKey } from "@/lib/sepay";

export async function GET() {
  try {
    const config = getSepayConfig();
    const banks = await verifySepayApiKey(config.apiKey);
    return NextResponse.json({ config, banks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey, webhookSecret, selectedBankId } = body;

    // Xác thực API Key để lấy danh sách ngân hàng liên kết
    const banks = await verifySepayApiKey(apiKey);

    // Cập nhật cấu hình
    const updated = updateSepayConfig({
      apiKey,
      webhookSecret,
      selectedBankId: selectedBankId || (banks[0]?.id || "")
    });

    return NextResponse.json({ success: true, config: updated, banks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
