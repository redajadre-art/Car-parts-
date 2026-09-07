"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ShieldCheck, Wrench, Search, Sparkles } from "lucide-react";

interface HeroSlide {
  id: number;
  titleAr: string;
  subtitleAr: string;
  badgeAr?: string;
  buttonTextAr?: string;
  buttonLink?: string;
  imageUrl: string;
  isActive: boolean;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/hero-slides");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const active = data.data.filter((s: HeroSlide) => s.isActive);
        setSlides(active);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (loading) {
    return (
      <div className="w-full h-[450px] bg-slate-900 animate-pulse rounded-2xl my-4 max-w-7xl mx-auto" />
    );
  }

  if (slides.length === 0) return null;

  const current = slides[currentIndex];

  return (
    <div className="relative w-full max-w-7xl mx-auto my-4 px-4 sm:px-6 lg:px-8">
      <div className="relative h-[480px] sm:h-[520px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
        
        {/* Slide Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105 group-hover:scale-100"
          style={{ backgroundImage: `url(${current.imageUrl})` }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        </div>

        {/* Slide Content */}
        <div className="relative h-full max-w-2xl px-6 sm:px-12 flex flex-col justify-center text-right z-10 space-y-5">
          {current.badgeAr && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full w-max shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{current.badgeAr}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            {current.titleAr}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed line-clamp-3">
            {current.subtitleAr}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={current.buttonLink || "/products"}
              className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>{current.buttonTextAr || "تصفح القطع الآن"}</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>فحص ومطابقة 100% برقم الهيكل (VIN)</span>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % slides.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentIndex === i
                      ? "w-8 bg-red-500 shadow-md shadow-red-500/50"
                      : "w-2.5 bg-slate-600 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
