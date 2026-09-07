"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Wrench,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const { storeSettings } = useStore();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-right mt-16">
      
      {/* Top Value Proposition Grid */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">فحص التوافق برقم الشاسي VIN</h4>
              <p className="text-xs text-slate-400">مطابقة دقيقة 100% للقطعة المناسبة لسيارتك</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">شحن سريع و تغليف آمن</h4>
              <p className="text-xs text-slate-400">توصيل لجميع مناطق المملكة والخليج خلال 24-48 ساعة</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">ضمان استرجاع وسهولة الاستبدال</h4>
              <p className="text-xs text-slate-400">ضمان 14 يوم على جميع القطع غير المركبة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Store Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">
                {storeSettings?.storeNameAr || "قطع غيار بلس"}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {storeSettings?.footerAboutAr ||
                "متجر متخصص في توفير أفضل قطع غيار السيارات الأصلية والمعتمدة لجميع الماركات العالمية، مع خدمة فحص التوافق برقم الهيكل والتوصيل السريع."}
            </p>
            {storeSettings?.taxNumber && (
              <p className="text-xs text-amber-400 font-mono">
                الرقم الضريبي: {storeSettings.taxNumber}
              </p>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-r-2 border-red-600 pr-2">
              أقسام قطع الغيار
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/products?category=brakes" className="hover:text-red-400 transition-colors">أنظمة الفرامل والمكابح</Link></li>
              <li><Link href="/products?category=engine" className="hover:text-red-400 transition-colors">قطع المحرك والبواجي</Link></li>
              <li><Link href="/products?category=oils-filters" className="hover:text-red-400 transition-colors">الزيوت والفلاتر</Link></li>
              <li><Link href="/products?category=suspension" className="hover:text-red-400 transition-colors">التعليق والمساعدات</Link></li>
              <li><Link href="/products?category=electrical-lighting" className="hover:text-red-400 transition-colors">الكهرباء والإضاءة LED</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-r-2 border-amber-500 pr-2">
              خدمة العملاء
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/orders/track" className="hover:text-amber-400 transition-colors">تتبع حالة طلبك</Link></li>
              <li><Link href="/checkout" className="hover:text-amber-400 transition-colors">سلة التسوق وإتمام الطلب</Link></li>
              <li><Link href="/admin" className="text-amber-400 font-bold hover:underline">دخول لوحة التحكم (للمسؤولين)</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-r-2 border-emerald-500 pr-2">
              تواصل معنا
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              {storeSettings?.address && (
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{storeSettings.address}</span>
                </p>
              )}
              {storeSettings?.phoneNumber && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`tel:${storeSettings.phoneNumber}`} className="hover:text-white dir-ltr">
                    {storeSettings.phoneNumber}
                  </a>
                </p>
              )}
              {storeSettings?.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-400 shrink-0" />
                  <a href={`mailto:${storeSettings.email}`} className="hover:text-white">
                    {storeSettings.email}
                  </a>
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-slate-800/80 py-4 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لـ {storeSettings?.storeNameAr || "قطع غيار بلس"}</p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span>مدعوم بفيزا | مدى | Apple Pay | الدفع عند الاستلام</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
