"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  ShoppingCart,
  Heart,
  Star,
  CheckCircle2,
  AlertTriangle,
  BadgeCheck,
  ShieldAlert,
  Eye,
} from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    titleAr: string;
    slug: string;
    sku: string;
    oemNumber: string;
    brand: string;
    condition: string;
    price: string;
    salePrice?: string | null;
    stock: number;
    rating: string;
    reviewsCount: number;
    descriptionAr: string;
    imagesList?: string[];
    images?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    selectedVehicle,
    storeSettings,
  } = useStore();

  const isWish = isInWishlist(product.id);

  // Extract primary image
  let images: string[] = [];
  if (Array.isArray(product.imagesList) && product.imagesList.length > 0) {
    images = product.imagesList;
  } else if (typeof product.images === "string") {
    try {
      images = JSON.parse(product.images);
    } catch {
      images = [product.images];
    }
  }

  const primaryImage = images[0] || "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800";

  const priceNum = parseFloat(product.price);
  const salePriceNum = product.salePrice ? parseFloat(product.salePrice) : null;

  const discountPercent = salePriceNum
    ? Math.round(((priceNum - salePriceNum) / priceNum) * 100)
    : 0;

  const currency = storeSettings?.currency || "ر.س";

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between relative">
      
      {/* Product Image Area */}
      <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-950 overflow-hidden">
        
        {/* Badges Overlay */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 items-end">
          {salePriceNum && discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md animate-pulse">
              خصم {discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
              الأكثر مبيعاً 🔥
            </span>
          )}
        </div>

        {/* Condition Tag */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="bg-slate-900/80 backdrop-blur-md border border-slate-700 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-md">
            {product.condition}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute bottom-2.5 left-2.5 z-10 p-2 rounded-xl backdrop-blur-md transition-all ${
            isWish
              ? "bg-red-600 text-white shadow-lg"
              : "bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-900"
          }`}
          title="إضافة للمفضلة"
        >
          <Heart className={`w-4 h-4 ${isWish ? "fill-white" : ""}`} />
        </button>

        {/* Main Image */}
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.titleAr}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Product Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between text-right space-y-2.5">
        
        <div>
          {/* Brand & OEM Part Number */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono mb-1">
            <span className="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-md text-[11px]">
              {product.brand}
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[11px]">
              OEM: {product.oemNumber}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-red-600 dark:hover:text-red-400 transition-colors leading-snug">
              {product.titleAr}
            </h3>
          </Link>
        </div>

        {/* Vehicle Fitment Indicator Banner */}
        {selectedVehicle && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-2 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>مطابق لـ {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</span>
            </div>
          </div>
        )}

        {/* Rating & Stock Status */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
          </div>

          <div className="text-[11px]">
            {product.stock > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                متوفر بالأنبار ({product.stock})
              </span>
            ) : (
              <span className="text-rose-500 font-medium">غير متوفر حالياً</span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-right">
            {salePriceNum ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-red-600 dark:text-red-400">
                  {salePriceNum.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {priceNum.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {currency}
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {priceNum.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {currency}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-1.5 text-xs font-bold shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">أضف للسلة</span>
          </button>
        </div>

      </div>
    </div>
  );
}
