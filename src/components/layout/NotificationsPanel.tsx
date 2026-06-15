"use client";

import React from "react";
import { Bell, Check, ShoppingBag, BookOpen, AlertCircle, Info } from "lucide-react";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "ORDER" | "COURSE" | "PROMO" | "INFO";
  createdAt: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationsPanel({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAllAsRead,
  onMarkAsRead 
}: NotificationsPanelProps) {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <ShoppingBag className="w-4 h-4 text-blue-400" />;
      case "COURSE":
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case "PROMO":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      {/* Popover */}
      <div className="absolute right-4 top-16 w-80 sm:w-96 rounded-xl border border-white/8 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
          <div className="flex items-center gap-1.5 text-white font-bold text-sm">
            <Bell className="w-4 h-4 text-blue-500" />
            <span>Thông báo ({notifications.filter(n => !n.isRead).length})</span>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Đánh dấu đã đọc
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[320px] overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Bạn không có thông báo mới nào.
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors relative flex gap-2.5 ${
                  notif.isRead 
                    ? "bg-transparent border-white/5 text-slate-400 hover:bg-white/5" 
                    : "bg-blue-950/20 border-blue-800/20 text-slate-200 hover:bg-blue-950/30"
                }`}
              >
                {/* Status Dot */}
                {!notif.isRead && (
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                )}
                
                {/* Icon Circle */}
                <div className="p-2 rounded-lg bg-slate-950 border border-white/5 shrink-0 self-start">
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="space-y-0.5 pr-2">
                  <h4 className="font-bold text-white leading-snug">{notif.title}</h4>
                  <p className="leading-relaxed text-[11px]">{notif.message}</p>
                  <p className="text-[9px] text-slate-500 mt-1">
                    {new Date(notif.createdAt).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})} - {new Date(notif.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
