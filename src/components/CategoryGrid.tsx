"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Disc, Zap, Flame, Droplets, ShieldCheck } from "lucide-react";

export default function CategoryGrid() {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") || "ar";
    setLang(saved);
  }, []);

  const content = {
    ar: {
      title: "أقسام قطع الغيار الرئيسية",
      subtitle: "اختر التصنيف للوصول السريع إلى القطعة المطلوبة لسيارتك",
      viewAll: "تصفح الكل",
      cats: [
        { name: "الفرامل والمكابح", desc: "أقمشة وهوبات وزيوت", slug: "brakes", icon: Disc, color: "text-red-500" },
        { name: "المحرك والبواجي", desc: "بواجي، سيور، فلاتر هواء", slug: "engine", icon: Flame, color: "text-orange-500" },
        { name: "الزيوت والفلاتر", desc: "زيوت تخليقية وفلاتر زيت", slug: "oils-filters", icon: Droplets, color: "text-amber-500" },
        { name: "التعليق والمساعدات", desc: "مساعدات، مقصات، وأذرعة", slug: "suspension", icon: ShieldCheck, color: "text-blue-500" },
        { name: "الكهرباء والإنارة LED", desc: "أنوار LED، ديناموهات...", slug: "electrical-lighting", icon: Zap, color: "text-yellow-500" },
      ]
    },
    fr: {
      title: "Catégories Principales",
      subtitle: "Choisissez une catégorie pour trouver rapidement la pièce adaptée",
      viewAll: "Voir tout",
      cats: [
        { name: "Freinage", desc: "Plaquettes, disques et liquides", slug: "brakes", icon: Disc, color: "text-red-500" },
        { name: "Moteur & Allumage", desc: "Bougies, courroies, filtres", slug: "engine", icon: Flame, color: "text-orange-500" },
        { name: "Huiles & Filtres", desc: "Huiles synthétiques et filtres", slug: "oils-filters", icon: Droplets, color: "text-amber-500" },
        { name: "Suspension", desc: "Amortisseurs et triangles", slug: "suspension", icon: ShieldCheck, color: "text-blue-500" },
        { name: "Électricité & LED", desc: "Ampoules LED, alternateurs...", slug: "electrical-lighting", icon: Zap, color: "text-yellow-500" },
      ]
    },
    en: {
      title: "Main Categories",
      subtitle: "Select a category to quickly find the right part for your car",
      viewAll: "View All",
      cats: [
        { name: "Brakes", desc: "Pads, rotors, and fluids", slug: "brakes", icon: Disc, color: "text-red-500" },
        { name: "Engine & Ignition", desc: "Spark plugs, belts, air filters", slug: "engine", icon: Flame, color: "text-orange-500" },
        { name: "Oils & Filters", desc: "Synthetic oils and oil filters", slug: "oils-filters", icon: Droplets, color: "text-amber-500" },
        { name: "Suspension", desc: "Shocks, struts, control arms", slug: "suspension", icon: ShieldCheck, color: "text-blue-500" },
        { name: "Electrical & LED", desc: "LED bulbs, alternators...", slug: "electrical-lighting", icon: Zap, color: "text-yellow-500" },
      ]
    }
  }[lang as "ar" | "fr" | "en"] || {
    title: "أقسام قطع الغيار الرئيسية",
    subtitle: "اختر التصنيف للوصول السريع إلى القطعة المطلوبة لسيارتك",
    viewAll: "تصفح الكل",
    cats: []
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">{content.title}</h2>
          <p className="text-xs md:text-sm text-gray-400 mt-1">{content.subtitle}</p>
        </div>
        <Link href="/products" className="text-red-500 hover:text-red-400 text-xs md:text-sm font-bold flex items-center gap-1">
          {content.viewAll} &larr;
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {content.cats.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="bg-[#111827] border border-gray-800 hover:border-red-600/50 p-4 rounded-xl flex flex-col items-center text-center transition group hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <span className="font-bold text-sm text-white group-hover:text-red-500 transition">{cat.name}</span>
              <span className="text-[11px] text-gray-400 mt-1 line-clamp-1">{cat.desc}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
