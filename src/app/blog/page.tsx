"use client";

import React, { useState } from "react";
import { MOCK_BLOG_POSTS } from "@/lib/mockData";
import Link from "next/link";
import { Search, ChevronRight, Calendar, User } from "lucide-react";

export default function BlogListPage() {
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { value: "ALL", label: "Tất cả bài viết" },
    { value: "AI", label: "Trí tuệ nhân tạo (AI)" },
    { value: "Automation", label: "Tự động hóa (n8n/Make)" },
    { value: "Marketing", label: "Marketing & Growth" },
    { value: "No-code", label: "No-code / Low-code" },
    { value: "Technology", label: "Công nghệ mới" }
  ];

  const filteredPosts = MOCK_BLOG_POSTS.filter(post => {
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCat = selectedCat === "ALL" ? true : post.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Tin Tức Công Nghệ & AI</h1>
        <p className="text-xs text-slate-400">Khám phá các cẩm nang, thủ thuật Prompt Engineering, kịch bản tự động hóa tối ưu cho doanh nghiệp.</p>
      </div>

      {/* Search & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-6 flex gap-2 p-1 bg-slate-900 border border-white/10 rounded-xl">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white focus:outline-none placeholder-slate-500"
          />
        </div>

        <div className="md:col-span-6 flex gap-2 overflow-x-auto pb-1 scrollbar-thin md:justify-end">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCat(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                selectedCat === cat.value
                  ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts list grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center text-slate-500 text-xs">
          Không tìm thấy bài viết nào khớp với từ khóa tìm kiếm.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.id} 
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group h-full"
            >
              <div className="aspect-video relative overflow-hidden border-b border-white/5">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800/40 text-[9px] font-bold text-purple-300 uppercase">
                  {post.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    {post.authorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
