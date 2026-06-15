"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MockProduct } from "@/lib/mockData";

export interface CartItem {
  product: MockProduct;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: MockProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  couponCode: string;
  discountValue: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getCartTotal: () => number;
  getDiscountedTotal: () => number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountValue, setDiscountValue] = useState<number>(0); // Tỷ lệ phần trăm giảm giá (ví dụ: 0.1 là 10%)
  const [isCartOpen, setCartOpen] = useState<boolean>(false);

  // Load giỏ hàng từ localStorage lúc khởi động
  useEffect(() => {
    const savedCart = localStorage.getItem("ai_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Lỗi đọc giỏ hàng", e);
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("ai_cart", JSON.stringify(items));
  };

  const addToCart = (product: MockProduct) => {
    const existsIndex = cartItems.findIndex((item) => item.product.id === product.id);
    let newItems = [...cartItems];
    if (existsIndex > -1) {
      newItems[existsIndex].quantity += 1;
    } else {
      newItems.push({ product, quantity: 1 });
    }
    saveCart(newItems);
    setCartOpen(true); // Tự động mở giỏ hàng mini
  };

  const removeFromCart = (productId: string) => {
    const newItems = cartItems.filter((item) => item.product.id !== productId);
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
    setCouponCode("");
    setDiscountValue(0);
  };

  const applyCoupon = (code: string): boolean => {
    const formatted = code.toUpperCase().trim();
    if (formatted === "DISCOUNT10" || formatted === "AI2026") {
      setCouponCode(formatted);
      setDiscountValue(formatted === "AI2026" ? 0.2 : 0.1); // Giảm 20% hoặc 10%
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscountValue(0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return acc + price * item.quantity;
    }, 0);
  };

  const getDiscountedTotal = () => {
    const total = getCartTotal();
    return total - total * discountValue;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        couponCode,
        discountValue,
        applyCoupon,
        removeCoupon,
        getCartTotal,
        getDiscountedTotal,
        isCartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng trong CartProvider");
  }
  return context;
}
