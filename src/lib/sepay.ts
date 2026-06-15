export interface SepayBankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  logo: string;
}

export interface SepayConfig {
  apiKey: string;
  webhookSecret: string;
  isActive: boolean;
  selectedBankId: string;
}

// Bộ lưu trữ cấu hình tạm thời phía máy chủ (Memory cache)
let globalSepayConfig: SepayConfig = {
  apiKey: "sepay_api_key_test_12345",
  webhookSecret: "sepay_webhook_secret_xyz",
  isActive: true,
  selectedBankId: "bank-3"
};

// Tài khoản ngân hàng giả lập liên kết sẵn với tài khoản Sepay
export const MOCK_SEPAY_BANKS: SepayBankAccount[] = [
  {
    id: "bank-1",
    bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
    bankCode: "BIDV",
    accountNumber: "3710833176",
    accountName: "NONG THANH SON",
    logo: "https://api.vietqr.io/img/BIDV.png"
  },
  {
    id: "bank-2",
    bankName: "Ngân hàng Quân Đội (MB Bank)",
    bankCode: "MBB",
    accountNumber: "19022026888",
    accountName: "ANTIGRAVITY CO LTD",
    logo: "https://api.vietqr.io/img/MB.png"
  },
  {
    id: "bank-3",
    bankName: "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
    bankCode: "VPB",
    accountNumber: "90354965",
    accountName: "TRAN PHUOC VINH",
    logo: "https://api.vietqr.io/img/VPB.png"
  }
];

// Bộ lưu trữ danh sách ngân hàng thực tế/mock đang hoạt động
let cachedSepayBanks: SepayBankAccount[] = [...MOCK_SEPAY_BANKS];

// Bộ lưu trữ danh sách các mã đơn hàng / mã nạp ví đã đối soát thành công
export const globalPaidOrders = new Set<string>();

export function getSepayConfig(): SepayConfig {
  return globalSepayConfig;
}

export function updateSepayConfig(config: Partial<SepayConfig>): SepayConfig {
  globalSepayConfig = { ...globalSepayConfig, ...config };
  return globalSepayConfig;
}

// Kiểm tra API Key và trả về danh sách ngân hàng liên kết từ SePay API v2
export async function verifySepayApiKey(apiKey: string): Promise<SepayBankAccount[]> {
  if (!apiKey.trim()) {
    throw new Error("API Key không được trống!");
  }
  
  // Nếu dùng API key demo hoặc sandbox test của hệ thống
  if (apiKey.startsWith("sepay_api_key_test_") || apiKey === "test" || apiKey === "demo") {
    cachedSepayBanks = [...MOCK_SEPAY_BANKS];
    return MOCK_SEPAY_BANKS;
  }
  
  try {
    const res = await fetch("https://userapi.sepay.vn/v2/bank-accounts", {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      next: { revalidate: 0 } as any
    });
    
    if (!res.ok) {
      throw new Error(`SePay API phản hồi lỗi: ${res.status}`);
    }
    
    const json = await res.json();
    if (json.status === "success" && Array.isArray(json.data)) {
      const parsedBanks = json.data.map((b: any) => ({
        id: b.id.toString(),
        bankName: b.bank_full_name || b.bank_short_name || b.bank_code,
        bankCode: b.bank_code,
        accountNumber: b.account_number,
        accountName: b.account_holder_name,
        logo: `https://api.vietqr.io/img/${b.bank_code}.png`
      }));
      
      cachedSepayBanks = parsedBanks.length > 0 ? parsedBanks : [...MOCK_SEPAY_BANKS];
      return cachedSepayBanks;
    } else {
      throw new Error(json.message || "Cấu trúc phản hồi SePay không hợp lệ.");
    }
  } catch (err: any) {
    console.error("Lỗi khi kết nối API SePay v2:", err);
    throw new Error(`Lỗi kết nối API SePay: ${err.message}`);
  }
}

// Lấy thông tin tài khoản ngân hàng đang được chọn làm mặc định
export function getActiveBankAccount(): SepayBankAccount {
  const config = getSepayConfig();
  const matched = cachedSepayBanks.find(b => b.id === config.selectedBankId);
  return matched || cachedSepayBanks[0] || MOCK_SEPAY_BANKS[0];
}
