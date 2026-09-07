"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

interface CustomSectionBlockProps {
  title?: string;
  subtitle?: string;
  categorySlug?: string;
  products?: any[];
}

export default function CustomSectionBlock({
  title,
  subtitle,
  categorySlug,
  products = [],
}: CustomSectionBlockProps) {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") || "ar";
    setLang(saved);
  }, []);

  const t = {
    ar: {
      defaultTitle: "قطع الغيار الممتازة والأكثر طلباً",
      defaultSubtitle: "أفضل القطع الأصلية المتوافقة وبأفضل الأسعار بالمغرب",
      viewAll: "عرض كل المنتجات",
    },
    fr: {
      defaultTitle: "Pièces Populaires & Recommandées",
      defaultSubtitle: "Pièces d'origine certifiées aux meilleurs prix au Maroc",
      viewAll: "Voir tous les produits",
    },
    en: {
      defaultTitle: "Featured & Best Selling Auto Parts",
      defaultSubtitle: "Top certified OEM parts at the best prices in Morocco",
      viewAll: "View All Products",
    },
  }[lang as "ar" | "fr" | "en"] || {
    defaultTitle: "قطع الغيار الممتازة والأكثر طلباً",
    defaultSubtitle: "أفضل القطع الأصلية المتوافقة وبأفضل الأسعار بالمغرب",
    viewAll: "عرض كل المنتجات",
  };

  const displayTitle = title || t.defaultTitle;
  const displaySubtitle = subtitle || t.defaultSubtitle;
  const targetLink = categorySlug ? `/products?category=${categorySlug}` : "/products";

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-lg">✨</span>
            <h2 className="text-xl md:text-2xl font-black text-white">{displayTitle}</h2>
          </div>
          <p className="text-xs md:text-sm text-gray-400 mt-1">{displaySubtitle}</p>
        </div>
        <Link
          href={targetLink}
          className="text-red-500 hover:text-red-400 text-xs md:text-sm font-bold flex items-center gap-1"
        >
          {t.viewAll}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-gray-400 text-sm">
            {lang === "fr"
              ? "Chargement des pièces..."
              : lang === "en"
              ? "Loading parts..."
              : "جاري تحميل المنتجات..."}
          </div>
        )}
      </div>
    </section>
  );
}
