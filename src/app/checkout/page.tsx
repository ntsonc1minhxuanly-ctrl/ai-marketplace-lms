"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  ArrowLeft, 
  QrCode, 
  CheckCircle2, 
  Smartphone, 
  Coins, 
  Loader2,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, getDiscountedTotal, couponCode, discountValue, clearCart } = useCart();
  const { data: session, update } = useSession();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"BANK_TRANSFER" | "MOMO" | "WALLET">("BANK_TRANSFER");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  const totalAmount = getDiscountedTotal();
  const user = session?.user as any;

  // Khởi tạo mã hóa đơn ngẫu nhiên
  useEffect(() => {
    const randCode = "INV" + Math.floor(100000 + Math.random() * 900000);
    setOrderCode(randCode);
  }, []);

  if (cartItems.length === 0 && !isPaid) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-slate-400">Vui lòng quay lại cửa hàng để chọn sản phẩm trước khi thanh toán.</p>
        <Link href="/shop" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all inline-block">
          Quay lại Cửa hàng
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Giả lập thời gian kết nối tạo VietQR/Momo QR
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 1500);
  };

  const handleSimulatePaymentWebhook = async () => {
    setIsProcessing(true);
    
    // Giả lập gửi callback API đến webhook Sepay / Momo tự động
    setTimeout(async () => {
      setIsProcessing(false);
      
      // 1. Lưu thông tin đơn hàng đã mua vào localStorage để hiển thị trong "Thư viện"
      const purchasedProductIds = cartItems.map(item => item.product.id);
      const savedPurchases = localStorage.getItem("purchased_products") || "[]";
      try {
        const parsed = JSON.parse(savedPurchases);
        localStorage.setItem("purchased_products", JSON.stringify([...parsed, ...purchasedProductIds]));
      } catch (e) {
        localStorage.setItem("purchased_products", JSON.stringify(purchasedProductIds));
      }

      // 2. Cộng doanh số affiliate giới thiệu nếu có
      // 3. Dispatch sự kiện thanh toán thành công để ClientLayout phát tín hiệu thông báo
      const event = new CustomEvent("payment_success", {
        detail: { amount: totalAmount, type: "PURCHASE" }
      });
      window.dispatchEvent(event);

      // 4. Reset giỏ hàng
      clearCart();

      // 5. Điều hướng sang thư viện sản phẩm của người dùng
      router.push("/dashboard?tab=library");
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/shop" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Thanh Toán Đơn Hàng</h1>
          <p className="text-xs text-slate-400">Xem lại giỏ hàng và quét QR Banking thanh toán tự động.</p>
        </div>
      </div>

      {!isPaid ? (
        /* PHASE 1: REVIEW AND SELECT PAYMENT METHOD */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart item summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-white/5 pb-2">Danh sách sản phẩm</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs">
                    <div className="space-y-0.5 max-w-[75%]">
                      <p className="font-bold text-white truncate">{item.product.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{item.product.type} (x{item.quantity})</p>
                    </div>
                    <span className="font-bold text-slate-200">
                      {((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Price calculations */}
              <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
                {couponCode && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Mã voucher: {couponCode}</span>
                    <span>-{(cartItems.reduce((acc, item) => acc + (item.product.salePrice ?? item.product.price) * item.quantity, 0) * discountValue).toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                  <span>Tổng tiền thanh toán</span>
                  <span className="text-blue-400 text-base">{totalAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>

            {/* Select Method */}
            <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-white/5 pb-2">Phương thức thanh toán</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "bg-blue-950/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <QrCode className="w-6 h-6" />
                  <span className="text-[10px] font-bold">QR Banking (VietQR)</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("MOMO")}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    paymentMethod === "MOMO"
                      ? "bg-pink-950/20 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Ví Momo QR</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("WALLET")}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    paymentMethod === "WALLET"
                      ? "bg-purple-950/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Coins className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Thanh toán bằng Ví</span>
                </button>
              </div>
            </div>
          </div>

          {/* Checkout Right Box CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl glass-panel bg-slate-900/60 text-center space-y-6">
              <div className="p-3 bg-blue-950/30 border border-blue-800/30 rounded-xl inline-flex text-blue-400">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Xác nhận thanh toán an toàn</h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Hệ thống sử dụng mã hóa bảo mật SSL 256-bit. Dữ liệu tài khoản của bạn được bảo mật tuyệt đối theo các tiêu chuẩn quốc tế.
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tạo giao dịch...
                  </>
                ) : (
                  <>
                    Tiếp tục đặt hàng ({totalAmount.toLocaleString("vi-VN")}đ)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* PHASE 2: GENERATED QR SCAN & SIMULATE webhook CALL */
        <div className="p-6 md:p-8 rounded-2xl glass-panel bg-slate-900/80 max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Giao Dịch Đã Được Khởi Tạo</h2>
            <p className="text-xs text-slate-400">Vui lòng quét mã bên dưới để thanh toán tự động trong 15 phút.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* QR Code image simulation */}
            <div className="bg-white p-4 rounded-xl max-w-[240px] mx-auto border-4 border-slate-950 shadow-2xl flex flex-col items-center">
              {/* VietQR or Momo logo mockup */}
              <div className="flex justify-between items-center w-full mb-2 border-b pb-1.5">
                <span className="text-[10px] font-bold text-slate-800 uppercase">
                  {paymentMethod === "BANK_TRANSFER" ? "VietQR / Napas247" : "Momo E-Wallet"}
                </span>
                <span className="text-[9px] font-bold text-slate-500">24/7 Auto</span>
              </div>
              <img 
                src={paymentMethod === "BANK_TRANSFER" 
                  ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=vietqr-mock-payment-account-19022026888-amount-${totalAmount}-description-${orderCode}` 
                  : "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=momo-mock-payment-amount"
                } 
                alt="QR Code thanh toan" 
                className="w-48 h-48" 
              />
              <span className="text-[9px] text-slate-500 mt-2">Quét mã bằng ứng dụng Ngân hàng / Momo</span>
            </div>

            {/* Account Transfer Info */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng:</span>
                  <span className="font-bold text-white">MB Bank (Quân Đội)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <span className="font-bold text-white text-blue-400">1902 2026 888</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <span className="font-bold text-white">ANTIGRAVITY CO LTD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tiền:</span>
                  <span className="font-bold text-white text-emerald-400">{totalAmount.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                  <span className="text-slate-500 font-bold text-blue-500">Nội dung ck:</span>
                  <span className="font-black text-white text-sm uppercase tracking-wider">{orderCode}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 leading-normal bg-blue-950/20 border border-blue-900/30 p-3 rounded-lg text-blue-300">
                💡 **Lưu ý quan trọng**: Quý khách cần chuyển đúng số tiền và điền chính xác nội dung ghi chú chuyển khoản để hệ thống kích hoạt sản phẩm tự động.
              </div>
            </div>
          </div>

          {/* Webhook simulation triggers for tester */}
          <div className="border-t border-white/5 pt-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-dashed border-blue-800/40 text-center space-y-3">
              <p className="text-[11px] text-blue-400 font-bold">
                🛠️ Hộp Công Cụ Giả Lập Cổng Thanh Toán (Sandbox Tester)
              </p>
              <p className="text-[10px] text-slate-500 max-w-md mx-auto">
                Bình thường, hệ thống sẽ đợi webhook từ Sepay/VietQR. Nhấp nút bên dưới để mô phỏng sự kiện ngân hàng chuyển khoản thành công gửi tín hiệu về website ngay lập tức.
              </p>
              <button
                onClick={handleSimulatePaymentWebhook}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isProcessing ? "Đang gửi webhook..." : "Simulate Bank Transfer Success"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
