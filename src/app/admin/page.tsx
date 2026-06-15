"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { MOCK_PRODUCTS, MOCK_COURSE_DETAILS } from "@/lib/mockData";
import { 
  Settings, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Layers, 
  Wallet, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Tag,
  BookOpen,
  Globe,
  FileText,
  PlayCircle,
  Key,
  Copy,
  Check
} from "lucide-react";
import Link from "next/link";

function AdminContent() {
  const { data: session } = useSession();

  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [activeSubTab, setActiveSubTab] = useState("products");

  // Website Settings State
  const [siteName, setSiteName] = useState("Antigravity AI");
  const [siteDesc, setSiteDesc] = useState("Marketplace Công cụ AI, Khóa học Automations & Tài liệu số");
  const [hotline, setHotline] = useState("+84 (0) 987 654 321");
  const [supportEmail, setSupportEmail] = useState("support@antigravity.vn");
  const [address, setAddress] = useState("Số 12 Khu đô thị Sala, Phường An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh");
  const [showConfigSuccess, setShowConfigSuccess] = useState(false);

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

  // Products CRUD States
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newType, setNewType] = useState("AI_TOOL");

  // Mock Deposits awaiting approval
  const [pendingDeposits, setPendingDeposits] = useState([
    { id: "dep-101", user: "Lê Minh Hùng", amount: 200000, code: "DEP881232", time: "10 phút trước" },
    { id: "dep-102", user: "Hoàng Kim Yến", amount: 500000, code: "DEP112344", time: "1 giờ trước" }
  ]);

  // LMS Course Editor States
  const [selectedCourseId, setSelectedCourseId] = useState<string>("prod-course-1");
  const [courseChapters, setCourseChapters] = useState<any[]>([]);
  const [showLmsSuccess, setShowLmsSuccess] = useState(false);

  const user = session?.user as any;

  // Load Sepay Configuration on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSepayWebhookUrl(`${window.location.origin}/api/payment/webhook`);
    }

    async function loadSepayConfig() {
      try {
        const res = await fetch("/api/admin/sepay-config");
        if (res.ok) {
          const data = await res.json();
          setSepayApiKey(data.config.apiKey);
          setSepayWebhookSecret(data.config.webhookSecret);
          setSelectedBankId(data.config.selectedBankId);
          setSepayBanks(data.banks);
        }
      } catch (e) {
        console.error("Lỗi tải cấu hình Sepay", e);
      }
    }
    loadSepayConfig();
  }, []);

  // Sync LMS Course syllabus details
  useEffect(() => {
    const details = (MOCK_COURSE_DETAILS as any)[selectedCourseId];
    if (details) {
      setCourseChapters(JSON.parse(JSON.stringify(details.chapters)));
    } else {
      setCourseChapters([]);
    }
  }, [selectedCourseId]);

  // Block access if not ADMIN role
  if (!session || user?.role !== "ADMIN") {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="p-3 bg-red-950/30 border border-red-800/30 text-red-400 rounded-xl inline-flex">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Quyền Truy Cập Bị Từ Chối</h2>
        <p className="text-xs text-slate-400">Bạn cần đăng nhập bằng tài khoản Quản trị viên của bạn (**thanhson029@gmail.com** / **09082012a**) để truy cập trang quản lý này.</p>
        <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all inline-block">
          Đăng nhập Admin
        </Link>
      </div>
    );
  }

  // Website Settings Form save
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfigSuccess(true);
    setTimeout(() => setShowConfigSuccess(false), 3000);
  };

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
        setSelectedBankId(data.config.selectedBankId);
        setSepaySuccess(true);
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

  // LMS Update Lessons logic
  const handleUpdateLesson = (chapterIndex: number, lessonIndex: number, field: string, value: string) => {
    const updated = [...courseChapters];
    updated[chapterIndex].lessons[lessonIndex][field] = value;
    setCourseChapters(updated);
  };

  const handleSaveLmsSyllabus = () => {
    setShowLmsSuccess(true);
    setTimeout(() => setShowLmsSuccess(false), 3000);
  };

  // Products CRUD handlers
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) return;

    const newProd = {
      id: `prod-added-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      description: "Mô tả chi tiết sản phẩm mới được tạo lập bởi admin.",
      shortDesc: "Tóm tắt tính năng sản phẩm mới.",
      price: parseFloat(newPrice),
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      type: newType as any,
      rating: 5.0,
      reviewsCount: 1
    };

    setProducts([newProd, ...products]);
    setNewTitle("");
    setNewPrice("");
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Wallet Approvals handler
  const handleApproveDeposit = (id: string, user: string, amount: number) => {
    setPendingDeposits(pendingDeposits.filter(d => d.id !== id));
    const event = new CustomEvent("payment_success", {
      detail: { amount, type: "DEPOSIT" }
    });
    window.dispatchEvent(event);
    alert(`Đã duyệt cộng số dư ví +${amount.toLocaleString("vi-VN")}đ tự động cho ${user}!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-2">
        <Settings className="w-7 h-7 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin CMS Dashboard</h1>
          <p className="text-xs text-slate-400">Trang quản trị toàn diện: Cấu hình website, chỉnh sửa khóa học LMS, sản phẩm marketplace & duyệt nạp ví.</p>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Doanh thu tháng này", count: "32,800,000đ", icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
          { label: "Tổng số đơn hàng", count: "128 đơn", icon: <ShoppingBag className="w-5 h-5 text-blue-400" /> },
          { label: "Người dùng đăng ký", count: "1,204 users", icon: <Users className="w-5 h-5 text-purple-400" /> },
          { label: "Số lượng sản phẩm", count: `${products.length} mặt hàng`, icon: <Layers className="w-5 h-5 text-cyan-400" /> }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">{item.label}</p>
              <p className="text-base font-black text-white mt-1">{item.count}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: "products", label: "Quản lý sản phẩm", icon: <Layers className="w-4 h-4" /> },
          { id: "lms_editor", label: "Chỉnh sửa khóa học (LMS)", icon: <BookOpen className="w-4 h-4" /> },
          { id: "sepay_settings", label: "Cấu hình Sepay", icon: <Key className="w-4 h-4" /> },
          { id: "site_settings", label: "Cấu hình Website", icon: <Globe className="w-4 h-4" /> },
          { id: "deposits", label: "Duyệt nạp ví QR", icon: <Wallet className="w-4 h-4" /> },
          { id: "add_product", label: "Thêm sản phẩm", icon: <Plus className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeSubTab === tab.id
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PRODUCTS LIST */}
      {activeSubTab === "products" && (
        <div className="glass-panel p-5 rounded-2xl bg-slate-900/60 space-y-4">
          <h2 className="text-sm font-bold text-white mb-2">Quản lý kho sản phẩm số đang bán</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400 border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500">
                  <th className="py-2.5">Tên sản phẩm</th>
                  <th className="py-2.5">Phân loại</th>
                  <th className="py-2.5">Giá tiền</th>
                  <th className="py-2.5">Đánh giá</th>
                  <th className="py-2.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-bold text-white truncate max-w-[240px]">{prod.title}</td>
                    <td className="py-3 text-[10px] uppercase font-semibold text-blue-400">{prod.type}</td>
                    <td className="py-3 font-bold text-slate-200">{prod.price.toLocaleString("vi-VN")}đ</td>
                    <td className="py-3 text-amber-400">★ {prod.rating}</td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LMS CURRICULUM EDITOR */}
      {activeSubTab === "lms_editor" && (
        <div className="glass-panel p-5 rounded-2xl bg-slate-900/60 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white">Chỉnh Sửa Giáo Trình & Bài Giảng LMS</h2>
              <p className="text-[11px] text-slate-400">Thay đổi tiêu đề bài giảng, video clip bài học và tài liệu PDF/Docx đính kèm của từng khóa học.</p>
            </div>
            
            {/* Course Selector */}
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-slate-950 border border-white/10 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer font-bold"
            >
              <option value="prod-course-1">Khóa Prompt Engineering</option>
              <option value="prod-course-2">Khóa Thiết Lập Phễu Bán Hàng</option>
            </select>
          </div>

          {showLmsSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-xs font-semibold animate-pulse">
              ✓ Cập nhật giáo trình khóa học thành công! Các bài học mới đã được lưu vào hệ thống LMS.
            </div>
          )}

          {courseChapters.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Không tìm thấy chương học nào cho khóa học này.
            </div>
          ) : (
            <div className="space-y-6">
              {courseChapters.map((chap, chapIdx) => (
                <div key={chap.id} className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-purple-400">{chap.title}</span>
                    <span className="text-[10px] text-slate-500">Chương {chap.order}</span>
                  </div>

                  <div className="space-y-4 pl-2">
                    {chap.lessons.map((les: any, lesIdx: number) => (
                      <div key={les.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        {/* Title input */}
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Tiêu đề bài học:
                          </label>
                          <input
                            type="text"
                            value={les.title}
                            onChange={(e) => handleUpdateLesson(chapIdx, lesIdx, "title", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Video Url input */}
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                            <PlayCircle className="w-3 h-3" /> Đường dẫn Video bài giảng:
                          </label>
                          <input
                            type="text"
                            value={les.videoUrl || ""}
                            onChange={(e) => handleUpdateLesson(chapIdx, lesIdx, "videoUrl", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>

                        {/* Attachment 1: PDF */}
                        <div className="md:col-span-2.5 space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Tài liệu đính kèm (PDF):
                          </label>
                          <input
                            type="text"
                            value={les.pdfUrl || ""}
                            onChange={(e) => handleUpdateLesson(chapIdx, lesIdx, "pdfUrl", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>

                        {/* Lesson duration */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold uppercase">Thời lượng (phút):</label>
                          <input
                            type="number"
                            value={les.duration}
                            onChange={(e) => handleUpdateLesson(chapIdx, lesIdx, "duration", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSaveLmsSyllabus}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              >
                Cập nhật giáo trình khóa học
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SEPAY GATEWAY CONFIGURATION */}
      {activeSubTab === "sepay_settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Settings form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 rounded-2xl bg-slate-900/60 space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-white/5 pb-2">Cấu Hình Cổng Sepay</h2>

              {sepaySuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-xs font-semibold">
                  ✓ Lưu cấu hình và xác minh kết nối Sepay thành công!
                </div>
              )}

              {sepayError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/30 text-red-400 text-xs font-semibold">
                  ⚠️ {sepayError}
                </div>
              )}

              <form onSubmit={handleSaveSepayConfig} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" /> Sepay API Key:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập Token kết nối API từ Sepay..."
                    value={sepayApiKey}
                    onChange={(e) => setSepayApiKey(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500" /> Webhook Secret Key (Mã bảo mật Webhook):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập khóa kiểm tra chữ ký webhook của Sepay..."
                    value={sepayWebhookSecret}
                    onChange={(e) => setSepayWebhookSecret(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Webhook dynamic url display */}
                <div className="space-y-1.5 border-t border-white/5 pt-4">
                  <label className="text-slate-400 font-bold block mb-1">Webhook URL của Website (Copy dán vào Sepay):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={sepayWebhookUrl}
                      className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-300 focus:outline-none font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={copyWebhookUrl}
                      className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors inline-flex items-center gap-1 shrink-0"
                    >
                      {webhookCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingSepay}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {isVerifyingSepay ? "Đang xác thực kết nối..." : "Lưu & Xác minh kết nối"}
                </button>
              </form>
            </div>
          </div>

          {/* Linked Bank Accounts */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Tài khoản ngân hàng đã liên kết (Sepay)</h3>
            
            {sepayBanks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/30 border border-white/5 text-center text-xs text-slate-500">
                Hãy nhập API Key và lưu để tải danh sách tài khoản ngân hàng liên kết từ Sepay.
              </div>
            ) : (
              <div className="space-y-3">
                {sepayBanks.map((bank) => (
                  <div 
                    key={bank.id} 
                    onClick={async () => {
                      setSelectedBankId(bank.id);
                      // Tự động lưu lựa chọn ngân hàng mặc định
                      await fetch("/api/admin/sepay-config", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          apiKey: sepayApiKey,
                          webhookSecret: sepayWebhookSecret,
                          selectedBankId: bank.id
                        })
                      });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedBankId === bank.id
                        ? "bg-blue-950/20 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                        : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-6 bg-white p-1 rounded flex items-center justify-center shrink-0">
                        <img src={bank.logo} alt={bank.bankName} className="max-h-full object-contain" />
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <p className="font-bold text-white">{bank.bankName}</p>
                        <p className="text-[10px] text-slate-500">Số tài khoản: <span className="font-mono text-slate-300">{bank.accountNumber}</span></p>
                        <p className="text-[10px] text-slate-500">Chủ tài khoản: <span className="text-slate-300">{bank.accountName}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {selectedBankId === bank.id ? (
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-900">Mặc định</span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Chọn</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: WEBSITE CONFIG EDITOR */}
      {activeSubTab === "site_settings" && (
        <div className="glass-panel p-6 rounded-2xl bg-slate-900/60 max-w-xl mx-auto space-y-6">
          <h2 className="text-sm font-bold text-white border-b border-white/5 pb-2">Thay Đổi Cấu Hình & Thông Tin Website</h2>

          {showConfigSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-xs font-semibold animate-pulse">
              ✓ Đã lưu cấu hình website thành công lên live production!
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Tên Website chính (Brand Name):</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Mô tả Website (Meta Description):</label>
              <textarea
                required
                rows={2}
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 leading-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Số điện thoại Hotline:</label>
                <input
                  type="text"
                  required
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Email hỗ trợ khách hàng:</label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Địa chỉ đăng ký kinh doanh:</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              Lưu cấu hình hệ thống
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: DEPOSIT RECONCILIATIONS APPROVALS */}
      {activeSubTab === "deposits" && (
        <div className="glass-panel p-5 rounded-2xl bg-slate-900/60 space-y-4">
          <h2 className="text-sm font-bold text-white mb-2">Duyệt nạp tiền Ví điện tử (Sepay VietQR)</h2>
          
          {pendingDeposits.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Không có giao dịch nạp ví nào đang chờ duyệt.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDeposits.map((dep) => (
                <div key={dep.id} className="p-4 rounded-xl border border-white/5 bg-slate-950 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white">{dep.user}</div>
                    <div className="text-[10px] text-slate-500">Mã nạp: {dep.code} - {dep.time}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-emerald-400">+{dep.amount.toLocaleString("vi-VN")}đ</span>
                    <button
                      onClick={() => handleApproveDeposit(dep.id, dep.user, dep.amount)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Duyệt cộng tiền
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: ADD PRODUCT FORM */}
      {activeSubTab === "add_product" && (
        <div className="glass-panel p-6 rounded-2xl bg-slate-900/60 max-w-xl mx-auto">
          <h2 className="text-sm font-bold text-white border-b border-white/5 pb-2 mb-4">Đăng bán sản phẩm mới</h2>
          
          <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Tên sản phẩm:</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Tài khoản Midjourney 1 Tháng"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Giá bán (VND):</label>
                <input
                  type="number"
                  required
                  placeholder="250000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Phân loại:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="AI_TOOL">Công cụ AI</option>
                  <option value="COURSE">Khóa học online</option>
                  <option value="AI_ACCOUNT">Tài khoản AI Premium</option>
                  <option value="PROMPT">Prompt AI</option>
                  <option value="TEMPLATE">Template Notion/Figma</option>
                  <option value="WORKFLOW">Workflow n8n JSON</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Đăng bán sản phẩm
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Đang tải trang Admin CMS...</div>}>
      <AdminContent />
    </Suspense>
  );
}
