"use client";

import React, { useState, useEffect } from "react";
import { generateAIResponse } from "@/lib/gemini";
import { useSession } from "next-auth/react";
import { 
  Cpu, 
  Terminal, 
  FileText, 
  HelpCircle, 
  Loader2, 
  Copy, 
  Check, 
  History, 
  PlayCircle 
} from "lucide-react";
import Link from "next/link";

interface GenerationHistory {
  toolName: string;
  prompt: string;
  response: string;
  createdAt: string;
}

export default function AIToolsPage() {
  const { data: session } = useSession();
  
  const [activeTool, setActiveTool] = useState("SEO_GEN");
  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  // Lưu lịch sử các lần sinh AI nội bộ
  const [history, setHistory] = useState<GenerationHistory[]>([]);

  const tools = [
    { id: "SEO_GEN", name: "SEO Generator AI", desc: "Tạo Meta Title, Description, Heading và danh sách từ khóa phụ.", limit: 10, placeholder: "Nhập từ khóa chính (Ví dụ: học tự động hóa n8n, bán hàng online)" },
    { id: "CONTENT_WRITE", name: "AI Content Writer", desc: "Viết bài viết ngắn hoặc nội dung copywrite bán hàng tự động.", limit: 5, placeholder: "Nhập chủ đề hoặc thông điệp bài viết (Ví dụ: Giới thiệu dịch vụ SEO tại Thủ Đức)" },
    { id: "PROMPT_GEN", name: "Prompt Optimizer AI", desc: "Tối ưu hóa câu lệnh thô thành prompt Midjourney/ChatGPT cực chất.", limit: 15, placeholder: "Nhập mô tả ảnh hoặc ý tưởng câu lệnh thô (Ví dụ: một lập trình viên đang ngồi code buổi tối)" },
    { id: "TITLE_GEN", name: "SEO Title Generator", desc: "Tạo 10 tiêu đề bài viết giật tít có tỉ lệ Click-through rate cực cao.", limit: 20, placeholder: "Nhập chủ đề muốn đặt tiêu đề (Ví dụ: cách kiếm tiền với chatbot)" }
  ];

  const currentTool = tools.find(t => t.id === activeTool) || tools[0];

  const handleGenerate = async () => {
    if (!promptInput.trim()) return;
    setLoading(true);
    setOutput("");
    
    try {
      const response = await generateAIResponse(activeTool, promptInput);
      setOutput(response);
      setUsageCount(prev => prev + 1);

      // Thêm vào lịch sử
      const newHistoryItem: GenerationHistory = {
        toolName: currentTool.name,
        prompt: promptInput,
        response: response,
        createdAt: new Date().toLocaleTimeString("vi-VN")
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (e) {
      setOutput("Không thể kết nối AI Studio Hub. Vui lòng kiểm tra lại cấu hình API.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Title */}
      <div className="lg:col-span-12 space-y-2 border-b border-white/5 pb-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Cpu className="w-7 h-7 text-cyan-400" />
          Hộp Công Cụ AI Studio
        </h1>
        <p className="text-xs text-slate-400">Trải nghiệm các công cụ tối ưu SEO, sinh prompt, viết bài quảng cáo được tích hợp trực tiếp từ Google AI Studio Hub.</p>
      </div>

      {/* Sidebar Tool selection */}
      <div className="lg:col-span-4 space-y-4">
        <div className="p-4 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider pl-1">Chọn công cụ AI</h3>
          <div className="space-y-1">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTool(t.id); setOutput(""); setPromptInput(""); }}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  activeTool === t.id 
                    ? "bg-cyan-950/20 border border-cyan-800/40 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="text-xs">{t.name}</div>
                <div className="text-[10px] text-slate-500 font-normal mt-1 leading-relaxed line-clamp-1">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Limit Tracker */}
        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 text-xs text-slate-400 space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Giới hạn lượt dùng trong ngày</h4>
          <div className="flex justify-between items-center text-[11px]">
            <span>Đã dùng hôm nay:</span>
            <span className="font-bold text-white">{usageCount}/{currentTool.limit} lượt</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-cyan-400 transition-all duration-300" 
              style={{ width: `${Math.min((usageCount / currentTool.limit) * 100, 100)}%` }}
            ></div>
          </div>
          {!session && (
            <p className="text-[9px] text-yellow-400/80 leading-normal">
              💡 Bạn đang dùng thử ẩn danh. Đăng nhập tài khoản để mở rộng hạn mức sử dụng miễn phí hàng ngày.
            </p>
          )}
        </div>
      </div>

      {/* Generation Workspace */}
      <div className="lg:col-span-8 space-y-6">
        <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">{currentTool.name}</h2>
            <p className="text-xs text-slate-400">{currentTool.desc}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Nhập yêu cầu / Từ khóa:</label>
              <textarea
                placeholder={currentTool.placeholder}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500 leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !promptInput.trim() || usageCount >= currentTool.limit}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 inline-flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý AI...
                </>
              ) : (
                <>
                  Bắt đầu khởi tạo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Block */}
        {output && (
          <div className="p-5 rounded-2xl border border-white/8 bg-slate-900/80 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200 relative">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                Kết quả trả về
              </h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Đã sao chép!" : "Sao chép"}
              </button>
            </div>
            
            <div className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap max-h-96 overflow-y-auto pr-1">
              {output}
            </div>
          </div>
        )}

        {/* Generation History logs */}
        {history.length > 0 && (
          <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" /> Lịch sử chạy thử trong phiên làm việc
            </h3>
            <div className="space-y-2">
              {history.map((hist, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-white/5 text-[11px] leading-relaxed">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>{hist.toolName} - {hist.createdAt}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5 italic truncate">Prompt: "{hist.prompt}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
