"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
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
  Tag
} from "lucide-react";
import Link from "next/link";

function AdminContent() {
  const { data: session } = useSession();

  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [activeSubTab, setActiveSubTab] = useState("products");

  // Mock Admin states
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newType, setNewType] = useState("AI_TOOL");

  // Mock Deposits awaiting approval
  const [pendingDeposits, setPendingDeposits] = useState([
    { id: "dep-101", user: "Lê Minh Hùng", amount: 200000, code: "DEP881232", time: "10 phút trước" },
    { id: "dep-102", user: "Hoàng Kim Yến", amount: 500000, code: "DEP112344", time: "1 giờ trước" }
  ]);

  const user = session?.user as any;

  // Chặn truy cập nếu không phải ADMIN
  if (!session || user?.role !== "ADMIN") {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="p-3 bg-red-950/30 border border-red-800/30 text-red-400 rounded-xl inline-flex">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Quyền Truy Cập Bị Từ Chối</h2>
        <p className="text-xs text-slate-400">Bạn cần đăng nhập bằng tài khoản Quản trị viên (admin@dev.com) để truy cập trang này.</p>
        <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all inline-block">
          Đăng nhập Admin
        </Link>
      </div>
    );
  }

  // Quản lý CRUD Sản phẩm giả lập
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

  // Duyệt nạp tiền giả lập
  const handleApproveDeposit = (id: string, user: string, amount: number) => {
    setPendingDeposits(pendingDeposits.filter(d => d.id !== id));
    
    // Bắn thông báo nạp thành công giả lập
    const event = new CustomEvent("payment_success", {
      detail: { amount, type: "DEPOSIT" }
    });
    window.dispatchEvent(event);
    alert(`Đã duyệt cộng tiền +${amount.toLocaleString("vi-VN")}đ thành công cho ${user}!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-2">
        <Settings className="w-7 h-7 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin CMS Dashboard</h1>
          <p className="text-xs text-slate-400">Trang quản trị vận hành marketplace, hệ thống khóa học lms, ví điện tử và vouchers.</p>
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

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        {[
          { id: "products", label: "Quản lý sản phẩm" },
          { id: "deposits", label: "Duyệt nạp ví" },
          { id: "add_product", label: "Thêm sản phẩm mới" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === tab.id
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: PRODUCTS LIST */}
      {activeSubTab === "products" && (
        <div className="glass-panel p-5 rounded-2xl bg-slate-900/60 space-y-4">
          <h2 className="text-sm font-bold text-white mb-2">Danh sách mặt hàng đang kinh doanh</h2>
          
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

      {/* SUB-TAB 2: DEPOSIT RECONCILIATIONS APPROVALS */}
      {activeSubTab === "deposits" && (
        <div className="glass-panel p-5 rounded-2xl bg-slate-900/60 space-y-4">
          <h2 className="text-sm font-bold text-white mb-2">Yêu cầu nạp tiền ví chờ duyệt (Sepay VietQR)</h2>
          
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

      {/* SUB-TAB 3: ADD PRODUCT FORM */}
      {activeSubTab === "add_product" && (
        <div className="glass-panel p-6 rounded-2xl bg-slate-900/60 max-w-xl mx-auto">
          <h2 className="text-sm font-bold text-white border-b border-white/5 pb-2 mb-4">Thêm sản phẩm kinh doanh mới</h2>
          
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
