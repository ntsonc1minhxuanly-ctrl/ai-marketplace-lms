"use client";

import React from "react";
import { useParams } from "next/navigation";
import { MOCK_BLOG_POSTS } from "@/lib/mockData";
import { Calendar, User, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function BlogDetailPage() {
  const { slug } = useParams();

  // Tìm bài viết khớp với slug
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Không tìm thấy bài viết</h2>
        <p className="text-xs text-slate-400">Bài viết này không tồn tại hoặc đã bị gỡ xuống.</p>
        <Link href="/blog" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Blog
        </Link>
      </div>
    );
  }

  // Lấy danh sách bài viết liên quan (loại trừ bài viết hiện tại)
  const relatedPosts = MOCK_BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  // JSON-LD Article Schema
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": [post.image],
    "datePublished": post.createdAt,
    "dateModified": post.createdAt,
    "author": {
      "@type": "Person",
      "name": post.authorName
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="lg:col-span-12 flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/" className="hover:text-slate-300">Trang chủ</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-slate-300">Blog</Link>
        <span>/</span>
        <span className="text-slate-300 truncate">{post.title}</span>
      </div>

      {/* Main post body content */}
      <article className="lg:col-span-8 space-y-6">
        <div className="space-y-4">
          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 text-[9px] font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-white/5 pb-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              Tác giả: {post.authorName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Đăng ngày: {new Date(post.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Feature Image */}
        <div className="rounded-2xl overflow-hidden border border-white/8 bg-slate-900/40 aspect-video">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Rich content body */}
        <div 
          className="prose prose-invert max-w-none text-slate-300 text-xs md:text-sm leading-relaxed space-y-4 pt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Post FAQs (If any) */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="space-y-4 border-t border-white/5 pt-8 mt-8">
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              Câu hỏi thường gặp liên quan
            </h2>
            <div className="space-y-3">
              {post.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/5 bg-slate-900/30 space-y-1.5">
                  <h3 className="text-xs font-bold text-white">{faq.q}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Sidebar - Related articles */}
      <div className="lg:col-span-4 space-y-6">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Bài viết liên quan</h3>
        <div className="space-y-4">
          {relatedPosts.map((rel) => (
            <Link 
              href={`/blog/${rel.slug}`} 
              key={rel.id} 
              className="glass-panel p-4 rounded-xl flex flex-col gap-3 hover:border-purple-500/35 transition-colors group block"
            >
              <img src={rel.image} alt={rel.title} className="w-full h-32 object-cover rounded-lg" />
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wide">{rel.category}</span>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {rel.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
