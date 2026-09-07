"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Disc,
  Cpu,
  Droplets,
  Shield,
  Zap,
  Wind,
  Wrench,
  ChevronLeft,
  Layers,
} from "lucide-react";

interface Category {
  id: number;
  slug: string;
  nameAr: string;
  descriptionAr?: string;
  iconName: string;
  imageUrl: string;
  isFeatured: boolean;
}

const iconMap: Record<string, any> = {
  Disc,
  Cpu,
  Droplets,
  Shield,
  Zap,
  Wind,
  Wrench,
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data.filter((c: Category) => c.isFeatured));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-36 bg-slate-800 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-red-600" />
            أقسام قطع الغيار الرئيسية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            اختر التصنيف للوصول السريع إلى القطعة المطلوبة لسيارتك
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 group"
        >
          <span>تصفح الكل</span>
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.iconName] || Wrench;

          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-red-500/50 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Image Preview Background subtle */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundImage: `url(${cat.imageUrl})` }}
              />

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-850 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-red-600 dark:text-red-500 group-hover:bg-gradient-to-tr group-hover:from-red-600 group-hover:to-amber-500 group-hover:text-white transition-all duration-300 shadow-md mb-3 z-10">
                <IconComponent className="w-7 h-7 group-hover:scale-110 transition-transform" />
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors z-10">
                {cat.nameAr}
              </h3>

              {cat.descriptionAr && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 z-10">
                  {cat.descriptionAr}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
