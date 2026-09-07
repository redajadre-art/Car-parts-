"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Headphones,
  Wrench,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const iconComponents: Record<string, any> = {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Headphones,
  Wrench,
  CheckCircle2,
};

export default function CustomSectionBlock() {
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/custom-sections");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSections(data.data.filter((s: any) => s.isActive));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const whyUs = sections.find((s) => s.sectionKey === "why_choose_us");
  const mechanicTip = sections.find((s) => s.sectionKey === "mechanic_tip");

  return (
    <div className="space-y-12 py-8">
      {/* 1. Why Choose Us Block */}
      {whyUs && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
                مميزات متجر قطع غيار بلس
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {whyUs.titleAr}
              </h2>
              <p className="text-sm text-slate-400 mt-2">{whyUs.subtitleAr}</p>
            </div>

            {/* Render List Items */}
            {whyUs.contentJson && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(() => {
                  try {
                    const items = typeof whyUs.contentJson === "string" ? JSON.parse(whyUs.contentJson) : whyUs.contentJson;
                    if (!Array.isArray(items)) return null;
                    return items.map((item: any, idx: number) => {
                      const IconComp = iconComponents[item.icon] || ShieldCheck;
                      return (
                        <div
                          key={idx}
                          className="bg-slate-950/70 border border-slate-800 hover:border-red-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 text-right flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white mb-4 shadow-lg">
                              <IconComp className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    });
                  } catch {
                    return null;
                  }
                })()}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2. Mechanic Adviser Tip Section */}
      {mechanicTip && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-red-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-right">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Wrench className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  {mechanicTip.titleAr}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {mechanicTip.subtitleAr}
                </h3>
                {(() => {
                  try {
                    const parsed = typeof mechanicTip.contentJson === "string" ? JSON.parse(mechanicTip.contentJson) : mechanicTip.contentJson;
                    if (parsed?.tipContent) {
                      return (
                        <p className="text-xs text-slate-300 max-w-xl">
                          {parsed.tipContent}
                        </p>
                      );
                    }
                  } catch {
                    return null;
                  }
                })()}
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href="/products?category=brakes"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <span>استشر الميكانيكي وتسوق</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
