"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import ProductCard from "@/components/shop/ProductCard";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc params từ URL
  const queryParam = searchParams.get("q") || "";
  const typeParam = searchParams.get("type") || "ALL";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedType, setSelectedType] = useState(typeParam);
  const [sortBy, setSortBy] = useState("POPULAR");

  // Đồng bộ URL params
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setSelectedType(typeParam);
  }, [typeParam]);

  // Bộ lọc danh mục tiếng Việt
  const categories = [
    { value: "ALL", label: "Tất cả sản phẩm" },
    { value: "AI_TOOL", label: "Công cụ AI" },
    { value: "COURSE", label: "Khóa học online" },
    { value: "AI_ACCOUNT", label: "Tài khoản AI Plus" },
    { value: "PROMPT", label: "Prompt AI" },
    { value: "EBOOK", label: "Ebooks" },
    { value: "WORKFLOW", label: "Workflow n8n" },
    { value: "TEMPLATE", label: "Templates" }
  ];

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    const params = new URLSearchParams(searchParams.toString());
    if (type === "ALL") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    router.push(`/shop?${params.toString()}`);
  };

  // Lọc và Sắp xếp
  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesSearch = searchQuery
      ? prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesType = selectedType === "ALL" ? true : prod.type === selectedType;

    return matchesSearch && matchesType;
  }).sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;

    if (sortBy === "PRICE_ASC") return priceA - priceB;
    if (sortBy === "PRICE_DESC") return priceB - priceA;
    if (sortBy === "RATING") return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // Mặc định là phổ biến
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Cửa Hàng Sản Phẩm Số</h1>
        <p className="text-xs text-slate-400">Mua sắm công cụ AI, khóa học tự động hóa và tài khoản premium kích hoạt tự động.</p>
      </div>

      {/* Filters & Search Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="lg:col-span-6 flex gap-2 p-1.5 rounded-xl bg-slate-900 border border-white/10 focus-within:border-blue-500 transition-colors">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white focus:outline-none"
          />
          <button type="submit" className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shrink-0 transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Sort selector */}
        <div className="lg:col-span-6 flex gap-3 justify-end items-center">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ArrowUpDown className="w-4 h-4" />
            <span>Sắp xếp:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-white/10 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="POPULAR">Phổ biến nhất</option>
            <option value="RATING">Đánh giá tốt nhất</option>
            <option value="PRICE_ASC">Giá tăng dần</option>
            <option value="PRICE_DESC">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleTypeChange(cat.value)}
            className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
              selectedType === cat.value
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-slate-500 text-sm space-y-2">
          <p>Không tìm thấy sản phẩm nào khớp với bộ lọc hiện tại.</p>
          <button 
            onClick={() => { setSearchQuery(""); handleTypeChange("ALL"); }}
            className="text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Đang tải cửa hàng...</div>}>
      <ShopContent />
    </Suspense>
  );
}
