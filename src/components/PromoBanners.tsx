"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Tag } from "lucide-react";

interface PromoBanner {
  id: number;
  titleAr: string;
  subtitleAr: string;
  discountTag?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl: string;
  bgGradient?: string;
  isActive: boolean;
}

export default function PromoBanners() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/promotional-banners");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBanners(data.data.filter((b: PromoBanner) => b.isActive));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (banners.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className={`relative rounded-3xl overflow-hidden shadow-xl border border-slate-800 bg-gradient-to-r ${
              b.bgGradient || "from-red-900 to-amber-900"
            } p-6 sm:p-8 flex flex-col justify-between group min-h-[220px]`}
          >
            {/* Background Image Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-35 transition-opacity duration-500"
              style={{ backgroundImage: `url(${b.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />

            <div className="relative z-10 space-y-2 text-right">
              {b.discountTag && (
                <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
                  <Tag className="w-3.5 h-3.5" />
                  {b.discountTag}
                </span>
              )}

              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {b.titleAr}
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
                {b.subtitleAr}
              </p>
            </div>

            <div className="relative z-10 pt-4 text-right">
              <Link
                href={b.buttonLink || "/products"}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <span>{b.buttonText || "تسوق العرض"}</span>
                <ArrowLeft className="w-4 h-4 text-red-600" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
