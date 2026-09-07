"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sliders,
  Package,
  Layers,
  Car,
  ShoppingBag,
  Ticket,
  Star,
  Settings,
  Store,
  ArrowRight,
  Menu,
  X,
  Wrench,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "إحصائيات المتجر",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "مخصص أقسام المتجر (Live)",
      href: "/admin/store-customizer",
      icon: Sliders,
      badge: "تعديل الواجهة",
    },
    {
      name: "إدارة قطع الغيار والقطع",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "أقسام وتصنيفات المتجر",
      href: "/admin/categories",
      icon: Layers,
    },
    {
      name: "قاعدة بيانات السيارات والتوافق",
      href: "/admin/vehicles",
      icon: Car,
    },
    {
      name: "إدارة طلبات العملاء",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "الكوبونات والعروض",
      href: "/admin/coupons",
      icon: Ticket,
    },
    {
      name: "إعدادات المتجر العامة",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans dir-rtl">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-slate-900 border-l border-slate-800 flex flex-col justify-between transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-red-500">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h2 className="font-black text-white text-base leading-tight">لوحة التحكم</h2>
                <p className="text-[11px] text-amber-400 font-bold">إدارة المتجر الإلكتروني</p>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-bold">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Link to Frontend Store */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="w-full bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/30 font-bold text-xs p-3 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Store className="w-4 h-4" />
            <span>معاينة واجهة المتجر</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-black text-white">
              نظام إدارة قطع غيار بلس (CarParts Pro Admin)
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              النظام متصل وقاعدة البيانات تعمل
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
