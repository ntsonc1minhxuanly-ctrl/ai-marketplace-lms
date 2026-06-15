"use client";

import React from "react";
import Link from "next/link";
import { MockProduct } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingCart, Zap, Download, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: MockProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setCartOpen } = useCart();
  const router = useRouter();

  const price = product.salePrice ?? product.price;
  const originalPrice = product.salePrice ? product.price : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setCartOpen(false);
    router.push("/checkout");
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "AI_TOOL":
        return { text: "Công cụ AI", style: "from-blue-600 to-cyan-600 text-blue-100" };
      case "COURSE":
        return { text: "Khóa học", style: "from-purple-600 to-indigo-600 text-purple-100" };
      case "PROMPT":
        return { text: "Prompt AI", style: "from-pink-600 to-rose-600 text-rose-100" };
      case "EBOOK":
        return { text: "Ebook", style: "from-amber-500 to-orange-600 text-orange-100" };
      case "AI_ACCOUNT":
        return { text: "Tài khoản AI", style: "from-emerald-600 to-teal-600 text-emerald-100" };
      case "WORKFLOW":
        return { text: "Workflow", style: "from-violet-600 to-fuchsia-600 text-violet-100" };
      default:
        return { text: "Tài liệu", style: "from-slate-600 to-slate-800 text-slate-100" };
    }
  };

  const typeMeta = getTypeLabel(product.type);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full group relative">
      {/* Product Image Cover */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-video overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Type Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r shadow-lg uppercase tracking-wider ${typeMeta.style}`}>
          {typeMeta.text}
        </span>
      </Link>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold ml-1 text-slate-200">{product.rating}</span>
          </div>
          <span className="text-[10px] text-slate-500">({product.reviewsCount} đánh giá)</span>
        </div>

        {/* Title */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed flex-1">
          {product.shortDesc}
        </p>

        {/* Price Tag */}
        <div className="flex items-baseline gap-2 mt-4 pt-3 border-t border-white/5">
          <span className="text-base font-extrabold text-white">
            {price.toLocaleString("vi-VN")}đ
          </span>
          {originalPrice && (
            <span className="text-xs text-slate-500 line-through">
              {originalPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Thêm giỏ
          </button>
          
          <button 
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-extrabold text-white transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" /> Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
