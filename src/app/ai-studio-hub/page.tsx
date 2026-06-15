"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Terminal, 
  Layers, 
  HelpCircle, 
  Copy, 
  Check, 
  ExternalLink,
  BookOpen,
  Code
} from "lucide-react";
import Link from "next/link";

export default function AIStudioHubPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const prompts = [
    {
      id: "prompt-1",
      title: "Prompts cho Custom Chatbot Chăm Sóc Khách Hàng",
      description: "Thiết lập chatbot đóng vai là chuyên viên tư vấn nhiệt tình cho cửa hàng SaaS Marketplace.",
      content: `System Instructions:
Bạn là 'Antigravity Chatbot' - chuyên viên tư vấn khách hàng cho nền tảng Antigravity AI Marketplace.
Nhiệm vụ của bạn là giải đáp các thắc mắc về khóa học tự động hóa, tài liệu, template Notion và các lỗi kích hoạt.
Văn phong: Lịch sự, thân thiện, trả lời bằng tiếng Việt.
Nếu khách hàng hỏi về cách thanh toán, hãy bảo họ quét mã VietQR ngân hàng trên trang checkout để kích hoạt tự động.`
    },
    {
      id: "prompt-2",
      title: "Prompts cho Trợ Lý Viết Quảng Cáo Facebook Ad",
      description: "Tạo bài viết quảng cáo thu hút độc giả, thúc đẩy tỉ lệ nhấp chuột (CTR).",
      content: `System Instructions:
Bạn là chuyên gia thiết kế nội dung quảng cáo chuyển đổi cao (Copywriter).
Hãy tạo tiêu đề giật tít cùng 3 đoạn nội dung quảng bá khóa học tự động hóa n8n.
Đưa ra lời kêu gọi hành động (CTA) thúc đẩy người đọc click vào liên kết tiếp thị liên kết.`
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="space-y-2 border-b border-white/5 pb-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Terminal className="w-7 h-7 text-purple-400" />
          Google AI Studio Hub
        </h1>
        <p className="text-xs text-slate-400">Thư viện mã nguồn mở, tài liệu tích hợp API Gemini, mẫu Prompt tối ưu hóa cho doanh nghiệp chuyển đổi số.</p>
      </div>

      {/* Integration Guide Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Hướng Dẫn Tích Hợp API Gemini 1.5/2.0
            </h2>
            <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
              <p>
                Google AI Studio cung cấp cổng truy cập API miễn phí cực kỳ nhanh cho các mô hình ngôn ngữ lớn như Gemini 1.5 Flash và Pro. Dưới đây là các bước để tích hợp vào ứng dụng Next.js của bạn:
              </p>
              
              <ol className="list-decimal pl-4 space-y-2">
                <li>Truy cập <Link href="https://aistudio.google.com" target="_blank" className="text-purple-400 hover:underline inline-flex items-center gap-0.5">Google AI Studio <ExternalLink className="w-3 h-3" /></Link> và tạo API Key.</li>
                <li>Mở tệp cấu hình môi trường <code className="text-slate-200 bg-slate-950 px-1 py-0.5 rounded font-mono">.env.local</code> và khai báo biến <code className="text-slate-200 bg-slate-950 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY=YOUR_KEY_HERE</code>.</li>
                <li>Dùng thư viện chính thức hoặc API Fetch trực tiếp đến các endpoint của Google.</li>
              </ol>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Code className="w-4 h-4 text-purple-400" />
              Đoạn mã mẫu (NodeJS / NextJS App Router)
            </h2>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-[10px] text-slate-300 font-mono overflow-x-auto leading-normal">
{`export async function POST(req: Request) {
  const { prompt } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    \`https://generativetool.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  const data = await response.json();
  return Response.json({ text: data.candidates[0].content.parts[0].text });
}`}
            </pre>
          </div>
        </div>

        {/* Prompt Library side column */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Thư viện Prompt mẫu (Copy nhanh)</h2>
          <div className="space-y-4">
            {prompts.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-white/5 bg-slate-900/40 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-white">{p.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-1">{p.description}</p>
                </div>
                <div className="relative">
                  <pre className="p-2.5 rounded-lg bg-slate-950 border border-white/5 text-[9px] text-slate-400 font-mono whitespace-pre-wrap leading-normal overflow-y-auto max-h-40">
                    {p.content}
                  </pre>
                  <button
                    onClick={() => handleCopy(p.id, p.content)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
