"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_BLOG_POSTS } from "@/lib/mockData";
import ProductCard from "@/components/shop/ProductCard";
import { generateAIResponse } from "@/lib/gemini";
import { 
  Cpu, 
  BookOpen, 
  Key, 
  Terminal, 
  Layers, 
  Briefcase, 
  Search, 
  ChevronRight, 
  Star, 
  CheckCircle,
  Play,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  FileCode,
  DollarSign
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive mini AI Tool state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTestAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiOutput("");
    try {
      const res = await generateAIResponse("TITLE_GEN", aiPrompt);
      setAiOutput(res);
    } catch (e) {
      setAiOutput("Đã xảy ra lỗi khi tạo tiêu đề AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Lọc sản phẩm bán chạy (chọn vài sản phẩm tiêu biểu)
  const bestSellers = MOCK_PRODUCTS.slice(0, 4);
  const featuredCourses = MOCK_PRODUCTS.filter(p => p.type === "COURSE");
  const aiToolsTease = MOCK_PRODUCTS.filter(p => p.type === "AI_TOOL");

  // Mock FAQs
  const FAQS = [
    {
      q: "Hệ thống nạp tiền và kích hoạt sản phẩm hoạt động như thế nào?",
      a: "Bạn chỉ cần chọn sản phẩm hoặc nạp tiền ví, quét mã QR Banking (VietQR) tự động được tạo. Hệ thống tích hợp webhook Sepay sẽ đối soát giao dịch và kích hoạt khóa học hoặc cấp link tải sản phẩm số, key license ngay tức thì (dưới 10 giây)."
    },
    {
      q: "Tài khoản ChatGPT Plus và Midjourney dùng chung có ổn định không?",
      a: "Các tài khoản AI tại Antigravity được cấp dưới dạng gói dùng chung (Shared) tiết kiệm hoặc tài khoản riêng tùy chọn. Chúng tôi có công cụ quản lý session giúp kết nối ổn định và tự động làm mới tài khoản nếu gặp lỗi."
    },
    {
      q: "Chương trình Affiliate giới thiệu bạn bè nhận hoa hồng như thế nào?",
      a: "Sau khi đăng ký, bạn nhận được một mã giới thiệu duy nhất. Bất kỳ ai click vào link và phát sinh đơn hàng, bạn sẽ nhận được 20% đến 40% giá trị đơn hàng được cộng trực tiếp vào ví. Bạn có thể yêu cầu rút tiền mặt về tài khoản ngân hàng của mình bất kỳ lúc nào."
    },
    {
      q: "Tôi có thể xuất hóa đơn VAT cho khóa học hay dịch vụ không?",
      a: "Có. Doanh nghiệp mua hàng có thể liên hệ bộ phận hỗ trợ support@antigravity.vn để cung cấp thông tin đăng ký kinh doanh và nhận hóa đơn VAT điện tử hợp pháp."
    }
  ];

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Antigravity AI Vietnam",
    "url": "https://antigravity.vn",
    "logo": "https://antigravity.vn/images/logo.png",
    "sameAs": [
      "https://facebook.com/antigravity.vn",
      "https://twitter.com/antigravity_vn"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-987-654-321",
      "contactType": "customer service",
      "areaServed": "VN",
      "availableLanguage": "Vietnamese"
    }
  };

  return (
    <div className="space-y-24 pb-12">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-12 md:py-20 flex flex-col items-center text-center">
        {/* Glow behind */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Hero badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-950/40 border border-blue-800/40 text-xs font-semibold text-blue-400 mb-6 animate-pulse">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Phiên Bản Đột Phá AI & Tự Động Hóa 2026</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-white max-w-4xl">
          Chợ Công Cụ AI, Khóa Học
          <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Automations & Tài Liệu Số
          </span>
        </h1>

        <p className="mt-6 text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
          Sự kết hợp hoàn hảo giữa Udemy, AppSumo và Gumroad. Nâng tầm hiệu suất công việc của bạn bằng các kịch bản n8n, prompt thiết kế sẵn, tài khoản AI và các khóa học thực chiến.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-xl flex gap-2 p-1.5 rounded-xl bg-slate-900/95 border border-white/10 focus-within:border-blue-500 transition-colors shadow-2xl backdrop-blur-md">
          <div className="flex-1 flex items-center pl-3">
            <Search className="w-4 h-4 text-slate-500 mr-2" />
            <input
              type="text"
              placeholder="Tìm kiếm tool AI, kịch bản n8n, khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-200 focus:outline-none placeholder-slate-500"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] shrink-0">
            Tìm kiếm
          </button>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 max-w-4xl w-full">
          {[
            { label: "Công Cụ AI & Tài Khoản", count: "150+" },
            { label: "Học Viên Online", count: "10,200+" },
            { label: "Đơn Thanh Toán Tự Động", count: "89,000+" },
            { label: "Đối Tác Affiliate", count: "1,200+" }
          ].map((stat, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-white/5 bg-slate-900/30 backdrop-blur-sm">
              <div className="text-xl md:text-2xl font-black text-white">{stat.count}</div>
              <div className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase tracking-wide font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. CATEGORIES BENTO GRID */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Danh Mục Nổi Bật</h2>
            <p className="text-xs text-slate-400">Khám phá các sản phẩm số được phân loại tối ưu cho workflow của bạn</p>
          </div>
        </div>

        <div className="bento-grid">
          {[
            { title: "Tool AI Độc Quyền", desc: "Viết content, tạo prompt hình ảnh, tối ưu SEO on-page.", icon: <Cpu className="w-5 h-5 text-blue-400" />, path: "/shop?type=AI_TOOL", col: "col-span-1" },
            { title: "Khóa Học Thực Chiến", desc: "Học cách tự động hóa quy trình với n8n, Make, Python.", icon: <BookOpen className="w-5 h-5 text-purple-400" />, path: "/shop?type=COURSE", col: "col-span-1 md:col-span-2" },
            { title: "Tài Khoản AI Premium", desc: "ChatGPT Plus, Midjourney, Claude Pro giá siêu ưu đãi.", icon: <Key className="w-5 h-5 text-emerald-400" />, path: "/shop?type=AI_ACCOUNT", col: "col-span-1" },
            { title: "Prompt Library", desc: "Kho câu lệnh chuẩn cho Chatbot & phần mềm vẽ tranh AI.", icon: <Terminal className="w-5 h-5 text-pink-400" />, path: "/shop?type=PROMPT", col: "col-span-1" },
            { title: "Workflow & Automation", desc: "File JSON nhập trực tiếp tự động hóa marketing & sale.", icon: <Layers className="w-5 h-5 text-violet-400" />, path: "/shop?type=WORKFLOW", col: "col-span-1" },
            { title: "Templates Notion/Figma", desc: "Bộ mẫu quản lý công việc và thiết kế giao diện SaaS.", icon: <FileCode className="w-5 h-5 text-amber-400" />, path: "/shop?type=TEMPLATE", col: "col-span-1 md:col-span-2" }
          ].map((cat, idx) => (
            <Link 
              key={idx} 
              href={cat.path}
              className={`glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between group ${cat.col}`}
            >
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5 w-max group-hover:border-blue-500/20 transition-colors">
                {cat.icon}
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-bold text-white flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                  {cat.title}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLING PRODUCTS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Sản Phẩm Bán Chạy</h2>
            <p className="text-xs text-slate-400">Những công cụ và tài liệu được khách hàng yêu thích lựa chọn nhiều nhất</p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
            Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE MINI AI TOOL PREVIEW */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-800/30 text-[10px] font-bold text-purple-400 uppercase tracking-wide">
              Trải nghiệm thực tế
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Tự Động Sinh Tiêu Đề Bài Viết Chuẩn SEO Bằng AI
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dưới đây là một mô phỏng trực tiếp từ hệ thống **AI Tools Hub**. Hãy nhập từ khóa hoặc chủ đề bạn muốn viết, AI của chúng tôi sẽ lên danh sách tiêu đề cuốn hút có tỉ lệ click chuột (CTR) cao nhất.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Không giới hạn lượt dùng thử local</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Khuyên dùng cho Copywriter & Marketer</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-3.5">
              <label className="block text-xs font-bold text-slate-300">Chủ đề hoặc từ khóa chính bài viết:</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ví dụ: kiếm tiền online, học lập trình Python, tự động hóa n8n"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button 
                  onClick={handleTestAI}
                  disabled={isAiLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isAiLoading ? "Đang xử lý..." : "Tạo ngay"}
                </button>
              </div>
              
              {/* Output screen */}
              {aiOutput && (
                <div className="p-3.5 rounded-lg bg-slate-900 border border-white/5 text-xs leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                  {aiOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED COURSES */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Khóa Học Nổi Bật</h2>
            <p className="text-xs text-slate-400">Nâng tầm kiến thức của bạn cùng các chuyên gia hàng đầu về No-code/AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. LATEST BLOG POSTS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Tin Tức Mới Nhất</h2>
            <p className="text-xs text-slate-400">Cập nhật công nghệ, thủ thuật Prompt AI và giải pháp tự động hóa</p>
          </div>
          <Link href="/blog" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
            Xem tất cả bài viết <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_BLOG_POSTS.map((post) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.id} 
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col sm:flex-row group"
            >
              <div className="sm:w-48 aspect-video sm:aspect-square shrink-0 relative overflow-hidden border-r border-white/5">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 text-[9px] font-bold uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
                <div className="text-[10px] text-slate-500 mt-4 flex justify-between items-center">
                  <span>Tác giả: {post.authorName}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER FEEDBACK */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white">Đánh Giá Từ Khách Hàng</h2>
          <p className="text-xs text-slate-400">Hơn 5000+ lập trình viên và doanh nhân chuyển đổi số tin dùng sản phẩm của chúng tôi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Phạm Thành Nam", job: "Founder Techstartup", comment: "Tôi đã tiết kiệm hàng chục triệu đồng tiền setup tự động hóa quy trình nhờ mua kịch bản n8n và notion dashboard tại đây. Thanh toán quét QR xong là kích hoạt file tải ngay tức thì.", rating: 5 },
            { name: "Nguyễn Quỳnh Chi", job: "Content Manager", comment: "Các prompt Midjourney và SEO Generator AI hoạt động cực tốt. Bản thiết kế Bento Grid và giao diện dark mode siêu mượt, trải nghiệm duyệt web nhanh đến kinh ngạc.", rating: 5 },
            { name: "Lê Đức Long", job: "Software Engineer", comment: "Khóa học Prompt Engineering rất thực tế, bài học chi tiết có kèm video ngắn gọn đi thẳng vào bản chất. Hệ thống tiến độ lms rất trực quan dễ theo dõi.", rating: 5 }
          ].map((feed, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(feed.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{feed.comment}"</p>
              <div className="pt-3 border-t border-white/5">
                <div className="text-xs font-bold text-white">{feed.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{feed.job}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white">Câu Hỏi Thường Gặp (FAQ)</h2>
          <p className="text-xs text-slate-400">Giải đáp các câu hỏi phổ biến nhất về cách vận hành hệ thống</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-xl overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-white hover:bg-white/5 transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                <HelpCircle className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-blue-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 border-t border-white/5 bg-slate-900/30 text-xs text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. CTA */}
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 border border-white/8">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">Sẵn Sàng Làm Chủ Công Nghệ AI Năm 2026?</h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Đăng ký tài khoản ngay hôm nay để nhận 150K quà tặng trải nghiệm và bắt đầu tự động hóa quy trình làm việc của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/shop" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Khám Phá Cửa Hàng
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-200 font-bold text-sm transition-all">
              Đăng Ký Tài Khoản
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
