"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold text-white">Liên Hệ Hỗ Trợ</h1>
        <p className="text-xs text-slate-400">Bạn cần tư vấn giải pháp tự động hóa hay cần hỗ trợ đơn hàng? Gửi tin nhắn ngay cho chúng tôi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact details */}
        <div className="md:col-span-5 space-y-4 text-xs">
          <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">Thông tin liên lạc</h3>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-white">Trụ sở chính:</p>
                <p className="text-slate-400 leading-relaxed">Số 12 Khu đô thị Sala, Phường An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-purple-500 shrink-0" />
              <div>
                <p className="font-bold text-white">Hotline CSKH:</p>
                <p className="text-slate-400">+84 (0) 987 654 321</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-cyan-500 shrink-0" />
              <div>
                <p className="font-bold text-white">Email tiếp nhận:</p>
                <p className="text-slate-400">support@antigravity.vn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="md:col-span-7">
          <div className="p-6 rounded-2xl glass-panel bg-slate-900/60 space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Gửi tin nhắn liên hệ</h3>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Yêu cầu hỗ trợ đã được gửi đi! Chúng tôi sẽ phản hồi lại email của bạn trong vòng 2 tiếng.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Họ và tên của bạn:</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Email nhận phản hồi:</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Nội dung yêu cầu chi tiết:</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mô tả cụ thể thắc mắc của bạn..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Gửi tin nhắn đi
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
