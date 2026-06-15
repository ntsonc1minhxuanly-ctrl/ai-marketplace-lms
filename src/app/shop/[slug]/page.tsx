"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_COURSE_DETAILS } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import { 
  Star, 
  ShoppingCart, 
  Zap, 
  ArrowLeft, 
  BookOpen, 
  Download, 
  ExternalLink,
  ShieldAlert,
  PlayCircle,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart, setCartOpen } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Tìm sản phẩm khớp với slug
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Không tìm thấy sản phẩm</h2>
        <p className="text-xs text-slate-400">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị ẩn.</p>
        <Link href="/shop" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Trở lại cửa hàng
        </Link>
      </div>
    );
  }

  // Lấy chi tiết khóa học nếu sản phẩm thuộc dạng COURSE
  const courseDetail = product.type === "COURSE" ? (MOCK_COURSE_DETAILS as any)[product.id] : null;

  const price = product.salePrice ?? product.price;
  const originalPrice = product.salePrice ? product.price : null;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    setCartOpen(false);
    router.push("/checkout");
  };

  // SEO Product Schema
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.image,
    "description": product.shortDesc,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://antigravity.vn/shop/${product.slug}`,
      "priceCurrency": "VND",
      "price": price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewsCount
    }
  };

  // FAQs riêng cho từng sản phẩm
  const productFaqs = [
    { q: "Tôi sẽ nhận sản phẩm bằng cách nào?", a: "Ngay sau khi giao dịch chuyển khoản thành công, sản phẩm sẽ được tự động đưa vào 'Thư viện sản phẩm' trong Dashboard của bạn. Bạn có thể tải file hoặc lấy key bản quyền tại đó." },
    { q: "Sản phẩm có được cập nhật trọn đời không?", a: "Có. Tất cả các template Notion, kịch bản n8n và sách Ebook sẽ được cập nhật phiên bản mới miễn phí trực tiếp trong thư viện tài khoản của bạn." }
  ];

  return (
    <div className="space-y-10">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-300">Trang chủ</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-slate-300">Cửa hàng</Link>
        <span>/</span>
        <span className="text-slate-300 truncate">{product.title}</span>
      </div>

      {/* Product Hero Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Image & details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="rounded-2xl overflow-hidden border border-white/8 bg-slate-900/40 aspect-video relative">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 font-bold uppercase text-[10px]">
                {product.type}
              </span>
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold ml-1 text-slate-200">{product.rating}</span>
                <span className="text-slate-500 ml-1">({product.reviewsCount} đánh giá)</span>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-300 text-xs md:text-sm leading-relaxed border-t border-white/5 pt-6 space-y-4">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Syllabus / Chapters List (For Online Courses) */}
          {courseDetail && (
            <div className="space-y-4 border-t border-white/5 pt-8">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Nội dung khóa học (Curriculum)
              </h2>
              <div className="space-y-3">
                {courseDetail.chapters.map((chap: any, idx: number) => (
                  <div key={chap.id} className="p-4 rounded-xl border border-white/5 bg-slate-900/30 space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-200">{chap.title}</h3>
                    <div className="space-y-1.5 pl-3">
                      {chap.lessons.map((les: any) => (
                        <div key={les.id} className="flex items-center justify-between text-xs text-slate-400 hover:text-white py-1">
                          <span className="flex items-center gap-2">
                            <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                            {les.title}
                          </span>
                          <span className="text-[10px] text-slate-500">{les.duration} phút</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Purchase Box */}
        <div className="lg:col-span-5 sticky top-20 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400">Giá bán độc quyền:</span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-black text-white">
                  {price.toLocaleString("vi-VN")}đ
                </span>
                {originalPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    {originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
              {originalPrice && (
                <span className="inline-block px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold">
                  Tiết kiệm {((1 - price / originalPrice) * 100).toFixed(0)}%
                </span>
              )}
            </div>

            {/* Buy CTA */}
            <div className="space-y-2">
              <button 
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                <Zap className="w-4 h-4 fill-current" />
                Mua ngay (Kích hoạt tự động)
              </button>
              
              <button 
                onClick={handleAddToCart}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5 inline mr-1.5" />
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* Safety Badges */}
            <div className="text-[11px] text-slate-500 space-y-2 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Tự động kích hoạt sau khi chuyển khoản 10s</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Hỗ trợ kỹ thuật 24/7 trực tuyến</span>
              </div>
              {product.demoUrl && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  <Link href={product.demoUrl} className="text-blue-400 hover:underline">
                    Xem bản chạy thử (Demo)
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Product FAQs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Câu hỏi về sản phẩm này</h3>
            {productFaqs.map((faq, idx) => (
              <div key={idx} className="glass-panel rounded-xl overflow-hidden text-xs">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-slate-200 hover:bg-white/5 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className={`w-3.5 h-3.5 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180 text-blue-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-3 border-t border-white/5 bg-slate-900/30 text-[11px] text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
