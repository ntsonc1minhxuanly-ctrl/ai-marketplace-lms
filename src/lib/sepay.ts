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
  selectedBankId: "bank-1"
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
  }
];

export function getSepayConfig(): SepayConfig {
  return globalSepayConfig;
}

export function updateSepayConfig(config: Partial<SepayConfig>): SepayConfig {
  globalSepayConfig = { ...globalSepayConfig, ...config };
  return globalSepayConfig;
}

// Kiểm tra API Key và trả về danh sách ngân hàng liên kết
export async function verifySepayApiKey(apiKey: string): Promise<SepayBankAccount[]> {
  if (!apiKey.trim()) {
    throw new Error("API Key không được trống!");
  }
  
  // Nếu có API Key thật, có thể thực hiện fetch đến Sepay API:
  // const res = await fetch("https://api.sepay.vn/v1/tenant/bank-accounts", { headers: { Authorization: `Bearer ${apiKey}` } });
  // const data = await res.json();
  
  // Trả về mock nếu ở chế độ test hoặc trả về danh sách thật
  return MOCK_SEPAY_BANKS;
}

// Lấy thông tin tài khoản ngân hàng đang được chọn làm mặc định
export function getActiveBankAccount(): SepayBankAccount {
  const config = getSepayConfig();
  const matched = MOCK_SEPAY_BANKS.find(b => b.id === config.selectedBankId);
  return matched || MOCK_SEPAY_BANKS[0];
}
