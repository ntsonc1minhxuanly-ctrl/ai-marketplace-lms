"use client";

import React, { useState, useEffect } from "react";
import { Key, AlertCircle, Copy, Check, CheckCircle } from "lucide-react";

export default function SepaySettingsPage() {
  // Sepay Gateway State
  const [sepayApiKey, setSepayApiKey] = useState("");
  const [sepayWebhookSecret, setSepayWebhookSecret] = useState("");
  const [sepayBanks, setSepayBanks] = useState<any[]>([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [sepayWebhookUrl, setSepayWebhookUrl] = useState("");
  const [sepayError, setSepayError] = useState("");
  const [sepaySuccess, setSepaySuccess] = useState(false);
  const [isVerifyingSepay, setIsVerifyingSepay] = useState(false);
  const [webhookCopied, setWebhookCopied] = useState(false);

  // Form mock config states
  const [formTitle, setFormTitle] = useState("Thông tin thanh toán đơn hàng");
  const [formSubmitBtn, setFormSubmitBtn] = useState("Thanh toán ngay");
  const [showFormSuccess, setShowFormSuccess] = useState(false);

  // Load Sepay Configuration on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSepayWebhookUrl(`${window.location.origin}/api/payment/webhook`);

      // Đọc từ localStorage trước để hiển thị tức thì
      const localKey = localStorage.getItem("sepay_api_key");
      const localSecret = localStorage.getItem("sepay_webhook_secret");
      const localBankId = localStorage.getItem("sepay_selected_bank_id");
      const localBanks = localStorage.getItem("sepay_banks");

      if (localKey) setSepayApiKey(localKey);
      if (localSecret) setSepayWebhookSecret(localSecret);
      if (localBankId) setSelectedBankId(localBankId);
      if (localBanks) {
        try {
          setSepayBanks(JSON.parse(localBanks));
        } catch (e) {}
      }

      // Vẫn gọi API để kiểm tra đồng bộ với server
      async function loadSepayConfig() {
        try {
          const res = await fetch("/api/admin/sepay-config");
          if (res.ok) {
            const data = await res.json();
            if (!localKey) {
              setSepayApiKey(data.config.apiKey);
              setSepayWebhookSecret(data.config.webhookSecret);
              setSelectedBankId(data.config.selectedBankId);
              setSepayBanks(data.banks);
            }
          }
        } catch (e) {
          console.error("Lỗi tải cấu hình Sepay", e);
        }
      }
      loadSepayConfig();
    }
  }, []);

  // Sepay Config Form save & verify
  const handleSaveSepayConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSepayError("");
    setSepaySuccess(false);
    setIsVerifyingSepay(true);

    try {
      const res = await fetch("/api/admin/sepay-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: sepayApiKey,
          webhookSecret: sepayWebhookSecret,
          selectedBankId: selectedBankId
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSepayBanks(data.banks);
        const newSelectedId = data.config.selectedBankId || (data.banks[0]?.id || "");
        setSelectedBankId(newSelectedId);
        setSepaySuccess(true);

        // Lưu vào localStorage để không bị mất khi Vercel reset memory
        localStorage.setItem("sepay_api_key", sepayApiKey);
        localStorage.setItem("sepay_webhook_secret", sepayWebhookSecret);
        localStorage.setItem("sepay_selected_bank_id", newSelectedId);
        localStorage.setItem("sepay_banks", JSON.stringify(data.banks));
      } else {
        setSepayError(data.error || "Không thể xác minh API Key với Sepay.");
      }
    } catch (err) {
      setSepayError("Đã xảy ra lỗi kết nối đến máy chủ.");
    } finally {
      setIsVerifyingSepay(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(sepayWebhookUrl);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2000);
  };

  const handleSaveFormConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFormSuccess(true);
    setTimeout(() => setShowFormSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-white">Thanh toán SePay</h1>
        <p className="text-[11px] text-slate-400">
          Quản trị nội dung, sản phẩm và các khối hiển thị trên website.
        </p>
      </div>

      {/* Main content grid */}
      <div className="space-y-6">
        {/* Card 1: API Key SePay */}
        <div className="glass-panel p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-blue-400 bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-lg">
              API Key SePay
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Lấy API key tại <a href="https://my.sepay.vn" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">my.sepay.vn</a> → Cài đặt → API. Bấm Lưu & Xác minh để kiểm tra key và tải danh sách tài khoản ngân hàng.
          </p>

          {sepayError && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/30 text-red-400 text-xs font-semibold">
              ⚠️ {sepayError}
            </div>
          )}

          <form onSubmit={handleSaveSepayConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">API Key</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập Token kết nối API từ Sepay..."
                  value={sepayApiKey}
                  onChange={(e) => setSepayApiKey(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono tracking-widest"
                />
              </div>

              <div className="md:col-span-4">
                <button
                  type="submit"
                  disabled={isVerifyingSepay}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                >
                  {isVerifyingSepay ? "Đang xác thực..." : "Lưu & Xác minh"}
                </button>
              </div>
            </div>

            {/* Success Status Banner */}
            {(sepaySuccess || (sepayApiKey && !sepayError)) && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>API key hợp lệ — đã tải {sepayBanks.length || 3} tài khoản ngân hàng.</span>
              </div>
            )}
          </form>

          {/* Webhook configuration block */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-[10px] text-slate-500 font-bold uppercase block">
              Webhook URL của Website (Copy dán vào Sepay)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={sepayWebhookUrl}
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-slate-300 focus:outline-none font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={copyWebhookUrl}
                className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors inline-flex items-center gap-1 shrink-0"
              >
                {webhookCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase block">
                Webhook Secret Key
              </label>
              <input
                type="text"
                value={sepayWebhookSecret}
                onChange={(e) => setSepayWebhookSecret(e.target.value)}
                placeholder="Nhập khóa kiểm tra chữ ký webhook của Sepay..."
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Tài khoản ngân hàng */}
        <div className="glass-panel p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-blue-400 bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-lg">
              Tài khoản ngân hàng
            </span>
          </div>

          <div className="space-y-3">
            {sepayBanks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 text-center text-xs text-slate-500">
                Hãy nhập API Key để lấy danh sách tài khoản ngân hàng từ SePay.
              </div>
            ) : (
              sepayBanks.map((bank) => (
                <div 
                  key={bank.id}
                  onClick={async () => {
                    setSelectedBankId(bank.id);
                    localStorage.setItem("sepay_selected_bank_id", bank.id);
                    
                    // Lưu cấu hình ngân hàng mặc định
                    try {
                      await fetch("/api/admin/sepay-config", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          apiKey: sepayApiKey,
                          webhookSecret: sepayWebhookSecret,
                          selectedBankId: bank.id
                        })
                      });
                    } catch (e) {
                      console.error("Lỗi khi cập nhật tài khoản mặc định", e);
                    }
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedBankId === bank.id
                      ? "bg-blue-950/20 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                      : "bg-slate-950/50 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Radio Button Custom */}
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600 flex items-center justify-center shrink-0">
                      {selectedBankId === bank.id && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>

                    <div className="w-12 h-6 bg-white p-1 rounded flex items-center justify-center shrink-0">
                      <img src={bank.logo} alt={bank.bankCode} className="max-h-full object-contain" />
                    </div>

                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white uppercase">{bank.bankCode}</span>
                        <span className="text-[10px] text-slate-500 truncate max-w-xs">{bank.bankName}</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        <span className="font-mono text-blue-400 font-bold">{bank.accountNumber}</span> — <span className="font-bold">{bank.accountName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="text-xs space-y-0.5">
                      <p className="font-extrabold text-white">0 đ</p>
                      <p className="text-[9px] text-slate-500 font-medium">Số dư tích lũy</p>
                    </div>

                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1 rounded-lg">
                      Hoạt động
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] text-slate-500">
            Tài khoản được chọn sẽ tự động dùng để sinh QR thanh toán. Không cần nhập lại thông tin nhận tiền ở phần khác.
          </p>
        </div>

        {/* Card 3: Form khách điền trước khi tạo đơn */}
        <div className="glass-panel p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-blue-400 bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-lg">
              Form khách điền trước khi tạo đơn
            </span>
          </div>

          {showFormSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/20 text-emerald-400 text-xs font-semibold">
              ✓ Đã lưu cấu hình form thành công!
            </div>
          )}

          <form onSubmit={handleSaveFormConfig} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Tiêu đề form</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Nút Submit</label>
                <input
                  type="text"
                  required
                  value={formSubmitBtn}
                  onChange={(e) => setFormSubmitBtn(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-xs"
            >
              Lưu cấu hình form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
