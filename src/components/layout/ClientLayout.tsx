"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MiniCart from "./MiniCart";
import NotificationsPanel, { SystemNotification } from "./NotificationsPanel";
import { useCart } from "@/context/CartContext";

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    title: "🎁 Chào mừng bạn tham gia Antigravity!",
    message: "Bạn vừa được tặng 150K khi tạo tài khoản test thành công. Nhập mã voucher AI2026 để được giảm 20% đơn hàng đầu tiên.",
    isRead: false,
    type: "PROMO",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 phút trước
  },
  {
    id: "notif-2",
    title: "⚡ Cập nhật bài giảng mới",
    message: "Khóa học 'Làm Chủ Prompt Engineering' vừa ra mắt 2 bài học mới tại Chương 2. Xem ngay!",
    isRead: false,
    type: "COURSE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 giờ trước
  }
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isCartOpen, setCartOpen } = useCart();
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Lắng nghe sự kiện thanh toán giả lập thành công để bắn thông báo thời gian thực
  useEffect(() => {
    const handlePaymentSuccess = (e: Event) => {
      const customEvent = e as CustomEvent;
      const amount = customEvent.detail?.amount || 0;
      const type = customEvent.detail?.type || "DEPOSIT";

      const newNotif: SystemNotification = {
        id: `notif-${Date.now()}`,
        title: type === "DEPOSIT" ? "💰 Nạp tiền thành công!" : "🎉 Thanh toán đơn hàng thành công!",
        message: type === "DEPOSIT" 
          ? `Tài khoản của bạn đã được cộng +${amount.toLocaleString("vi-VN")}đ tự động từ Sepay VietQR.` 
          : `Bạn đã thanh toán đơn hàng thành công. Sản phẩm số đã được kích hoạt trong thư viện của bạn.`,
        isRead: false,
        type: "ORDER",
        createdAt: new Date().toISOString()
      };

      setNotifications(prev => [newNotif, ...prev]);
    };

    window.addEventListener("payment_success", handlePaymentSuccess);
    return () => {
      window.removeEventListener("payment_success", handlePaymentSuccess);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 bg-grid-pattern relative">
      {/* Background glow top */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar 
        onToggleCart={() => setCartOpen(!isCartOpen)} 
        onToggleNotifications={() => setNotificationsOpen(!isNotificationsOpen)}
        unreadCount={unreadCount}
      />

      <NotificationsPanel 
        isOpen={isNotificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onMarkAsRead={handleMarkAsRead}
      />

      <MiniCart 
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
