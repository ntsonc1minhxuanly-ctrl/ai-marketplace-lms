"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { MOCK_PRODUCTS, MOCK_COURSE_DETAILS } from "@/lib/mockData";
import { 
  User as UserIcon, 
  Wallet, 
  BookOpen, 
  Download, 
  Share2, 
  Bell, 
  DollarSign, 
  LayoutDashboard, 
  LogOut,
  FolderLock,
  ChevronRight,
  TrendingUp,
  Link as LinkIcon,
  Check,
  QrCode
} from "lucide-react";
import Link from "next/link";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Đọc tab hoạt động từ URL
  const activeTabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(activeTabParam);

  const [referralCopied, setReferralCopied] = useState(false);
  const [walletDepositAmount, setWalletDepositAmount] = useState("100000");
  const [depositQrCode, setDepositQrCode] = useState(false);
  const [depositCode, setDepositCode] = useState("");

  // Purchased items states (loaded from localStorage or default Mock)
  const [purchasedIds, setPurchasedIds] = useState<string[]>(["prod-prompt-1", "prod-ebook-1"]);
  const [walletBalance, setWalletBalance] = useState(0);

  const user = session?.user as any;

  // Sync tab state from URL
  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  // Load purchases and balance
  useEffect(() => {
    const savedPurchases = localStorage.getItem("purchased_products");
    if (savedPurchases) {
      try {
        const parsed = JSON.parse(savedPurchases);
        setPurchasedIds(prev => Array.from(new Set([...prev, ...parsed])));
      } catch (e) {}
    }

    if (user?.balance) {
      setWalletBalance(user.balance);
    }
  }, [user]);

  // Sinh mã nạp ví
  const handleGenerateDepositQR = () => {
    const code = "DEP" + Math.floor(100000 + Math.random() * 900000);
    setDepositCode(code);
    setDepositQrCode(true);
  };

  // Giả lập nạp ví thành công
  const handleSimulateDepositWebhook = () => {
    const amount = parseFloat(walletDepositAmount);
    setWalletBalance(prev => prev + amount);
    setDepositQrCode(false);

    // Bắn sự kiện nạp thành công
    const event = new CustomEvent("payment_success", {
      detail: { amount, type: "DEPOSIT" }
    });
    window.dispatchEvent(event);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`);
  };

  const copyReferralLink = () => {
    const link = `https://antigravity.vn/?ref=${user?.referralCode || 'guest-ref'}`;
    navigator.clipboard.writeText(link);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  if (!session) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Bạn chưa đăng nhập</h2>
        <p className="text-xs text-slate-400">Vui lòng đăng nhập để xem thông tin trang cá nhân.</p>
        <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all inline-block">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // Lấy các sản phẩm đã mua
  const boughtProducts = MOCK_PRODUCTS.filter(p => purchasedIds.includes(p.id));
  const boughtCourses = boughtProducts.filter(p => p.type === "COURSE");
  const boughtDigitalItems = boughtProducts.filter(p => p.type !== "COURSE");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar navigation */}
      <div className="lg:col-span-3 glass-panel rounded-2xl p-4 space-y-1">
        <div className="px-3 py-4 border-b border-white/5 mb-3 text-center lg:text-left">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg mx-auto lg:mx-0">
            {user?.name?.[0] || "U"}
          </div>
          <h3 className="text-sm font-bold text-white mt-3 truncate">{user?.name}</h3>
          <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
        </div>

        {[
          { id: "overview", label: "Tổng quan", icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: "library", label: "Thư viện đã mua", icon: <FolderLock className="w-4 h-4" /> },
          { id: "courses", label: "Khóa học của tôi", icon: <BookOpen className="w-4 h-4" /> },
          { id: "wallet", label: "Ví tiền & Nạp tiền", icon: <Wallet className="w-4 h-4" /> },
          { id: "referral", label: "Giới thiệu bạn bè", icon: <Share2 className="w-4 h-4" /> },
          { id: "affiliate", label: "Affiliate Dashboard", icon: <DollarSign className="w-4 h-4" /> },
          { id: "profile", label: "Thông tin cá nhân", icon: <UserIcon className="w-4 h-4" /> }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === item.id 
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-white hover:bg-red-950/20 border-t border-white/5 mt-3 pt-3"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Tổng Quan Tài Khoản</h2>
            
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-950/40 text-blue-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Số dư ví điện tử</p>
                  <p className="text-base font-black text-white mt-0.5">{walletBalance.toLocaleString("vi-VN")}đ</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-950/40 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Khóa học của tôi</p>
                  <p className="text-base font-black text-white mt-0.5">{boughtCourses.length} khóa học</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-950/40 text-emerald-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Mã Referral giới thiệu</p>
                  <p className="text-xs font-bold text-slate-200 mt-1 truncate max-w-[130px]">{user?.referralCode || "UUID"}</p>
                </div>
              </div>
            </div>

            {/* Quick action card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-white/8 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">🔥 Bắt đầu kiếm thêm thu nhập thụ động</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Chia sẻ link tiếp thị liên kết (Affiliate) của bạn cho bạn bè, nhận ngay **20% đến 40%** hoa hồng đối tác khi họ mua bất kỳ sản phẩm nào.
                </p>
              </div>
              <button 
                onClick={() => handleTabChange("referral")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                Nhận link Affiliate ngay
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: LIBRARY (DIGITAL DOWNLOADS) */}
        {activeTab === "library" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Thư Viện Sản Phẩm Số Đã Mua</h2>
              <p className="text-xs text-slate-400">Tải xuống các tài liệu, template Notion, kịch bản n8n và lấy mã license key kích hoạt.</p>
            </div>

            {boughtDigitalItems.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Bạn chưa mua sản phẩm số nào. Hãy mua sách, template hoặc workflow để bắt đầu sử dụng.
              </div>
            ) : (
              <div className="space-y-4">
                {boughtDigitalItems.map((prod) => (
                  <div key={prod.id} className="p-4 rounded-xl border border-white/5 bg-slate-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5 max-w-[70%]">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 text-[9px] font-bold uppercase tracking-wider">{prod.type}</span>
                      <h3 className="text-xs font-bold text-white">{prod.title}</h3>
                      {prod.licenseKey && (
                        <p className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded w-max border border-white/5 font-mono">
                          Mã kích hoạt / License: <span className="text-slate-300 font-bold">{prod.licenseKey}</span>
                        </p>
                      )}
                    </div>

                    {prod.downloadUrl && (
                      <Link 
                        href={prod.downloadUrl}
                        target="_blank"
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Tải xuống tài liệu
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LMS ONLINE COURSES */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Khóa Học Đang Học</h2>
              <p className="text-xs text-slate-400">Nhấp vào khóa học để mở giao diện LMS theo dõi bài học và tiến độ học tập.</p>
            </div>

            {boughtCourses.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-3">
                <p>Bạn chưa tham gia khóa học nào.</p>
                <Link href="/shop?type=COURSE" className="text-xs text-blue-400 hover:underline font-bold">Tìm khóa học ngay</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {boughtCourses.map((prod) => (
                  <div key={prod.id} className="p-4 rounded-xl border border-white/5 bg-slate-900/40 space-y-4">
                    <img src={prod.image} alt={prod.title} className="w-full h-32 object-cover rounded-lg" />
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-white line-clamp-1">{prod.title}</h3>
                      <p className="text-[10px] text-slate-500">Người bán: Antigravity LMS Team</p>
                    </div>
                    {/* LMS Link */}
                    <Link 
                      href={`/courses/${prod.id}`}
                      className="w-full flex items-center justify-center gap-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all"
                    >
                      Vào lớp học <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WALLET & DEPOSITS */}
        {activeTab === "wallet" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Ví Điện Tử Của Bạn</h2>

            {/* Wallet Balance box */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-blue-900/30 to-purple-900/30 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tổng số dư khả dụng:</span>
                <p className="text-3xl font-black text-white text-glow">{walletBalance.toLocaleString("vi-VN")}đ</p>
              </div>
            </div>

            {/* Wallet deposit form */}
            <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Nạp tiền vào ví tự động</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Nhập số tiền muốn nạp (VND):</label>
                  <input 
                    type="number"
                    value={walletDepositAmount}
                    onChange={(e) => setWalletDepositAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <button
                  onClick={handleGenerateDepositQR}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5"
                >
                  Tạo mã QR Nạp Tiền
                </button>
              </div>
            </div>

            {/* Generated deposit QR code block */}
            {depositQrCode && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 max-w-lg mx-auto text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <h4 className="text-xs font-bold text-white">Quét mã QR để chuyển khoản nạp ví</h4>
                
                <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                  <div className="bg-white p-3 rounded-lg border-2 border-slate-900">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=vietqr-deposit-account-19022026888-amount-${walletDepositAmount}-desc-${depositCode}`}
                      alt="QR Code nạp tiền"
                      className="w-36 h-36"
                    />
                  </div>

                  <div className="text-xs text-left space-y-1.5 font-semibold text-slate-300">
                    <div>Ngân hàng: <span className="text-white">MB Bank</span></div>
                    <div>Số tài khoản: <span className="text-white">1902 2026 888</span></div>
                    <div>Chủ tài khoản: <span className="text-white">ANTIGRAVITY CO LTD</span></div>
                    <div className="text-blue-400 font-bold">Nội dung ghi chú ck: <span className="text-white text-sm font-black bg-slate-900 px-2 py-0.5 rounded border border-white/5">{depositCode}</span></div>
                  </div>
                </div>

                {/* Simulate Success Deposit for Testing */}
                <div className="p-4 rounded-xl border border-dashed border-emerald-800/40 bg-emerald-950/10 space-y-2">
                  <p className="text-[10px] text-slate-500">Giả lập cổng thanh toán Sepay webhook trả dữ liệu về nạp thành công:</p>
                  <button 
                    onClick={handleSimulateDepositWebhook}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Simulate Deposit Transfer Success
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REFERRAL */}
        {activeTab === "referral" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Mã Giới Thiệu & Hoa Hồng</h2>
              <p className="text-xs text-slate-400">Giới thiệu bạn bè đăng ký tài khoản qua đường link độc quyền của bạn để nhận hoa hồng giới thiệu.</p>
            </div>

            {/* Link copier */}
            <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Đường link tiếp thị của bạn</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://antigravity.vn/?ref=${user?.referralCode || 'guest-ref'}`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shrink-0 inline-flex items-center gap-1"
                >
                  {referralCopied ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
                  {referralCopied ? "Đã sao chép!" : "Sao chép link"}
                </button>
              </div>
            </div>

            {/* Leaderboard mockup */}
            <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Bảng xếp hạng đối tác tiêu biểu</h3>
              <div className="space-y-2 text-xs">
                {[
                  { rank: 1, name: "Nguyễn Văn A", sales: "128 đơn hàng", earnings: "14,500,000đ" },
                  { rank: 2, name: "Trần Thị B", sales: "94 đơn hàng", earnings: "9,800,000đ" },
                  { rank: 3, name: "Lê Hoàng C", sales: "68 đơn hàng", earnings: "6,200,000đ" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="font-bold text-slate-200">#{item.rank} {item.name}</span>
                    <div className="space-x-4 text-slate-400">
                      <span>{item.sales}</span>
                      <span className="text-emerald-400 font-bold">{item.earnings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AFFILIATE DASHBOARD */}
        {activeTab === "affiliate" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Affiliate Analytics</h2>
              <p className="text-xs text-slate-400">Theo dõi chi tiết số lượt click link, số đơn hàng phát sinh, tỷ lệ chuyển đổi và tổng hoa hồng.</p>
            </div>

            {/* Analytics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 text-center">
                <div className="text-lg md:text-xl font-black text-white">1,248</div>
                <div className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">Tổng lượt click</div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 text-center">
                <div className="text-lg md:text-xl font-black text-white">42</div>
                <div className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">Đơn hàng hoàn tất</div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 text-center">
                <div className="text-lg md:text-xl font-black text-white">3.36%</div>
                <div className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">Tỉ lệ chuyển đổi</div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 text-center">
                <div className="text-lg md:text-xl font-black text-white text-emerald-400">3,450,000đ</div>
                <div className="text-[9px] text-slate-500 mt-1 uppercase font-semibold font-sans">Doanh thu nhận được</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Thông Tin Cá Nhân</h2>
            
            <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-slate-500">Họ và tên:</span>
                  <p className="font-bold text-white">{user?.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Email:</span>
                  <p className="font-bold text-white">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Vai trò phân quyền:</span>
                  <p className="font-bold text-purple-400 uppercase">{user?.role}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Ngày đăng ký tài khoản:</span>
                  <p className="font-bold text-white">15/06/2026</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Đang tải trang Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
