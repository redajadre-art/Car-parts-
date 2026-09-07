"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Search,
  ShoppingCart,
  Heart,
  Car,
  Wrench,
  SlidersHorizontal,
  Phone,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  X,
  Sparkles,
} from "lucide-react";
import VehicleSelectorModal from "./VehicleSelectorModal";

export default function Navbar() {
  const {
    storeSettings,
    cartCount,
    setIsCartOpen,
    wishlist,
    selectedVehicle,
    setSelectedVehicle,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl">
      {/* Announcement Bar */}
      {storeSettings?.announcementEnabled && storeSettings.announcementBarText && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs md:text-sm py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
          <span>{storeSettings.announcementBarText}</span>
        </div>
      )}

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wrench className="w-5 h-5 md:w-6 md:h-6 text-red-500 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
                {storeSettings?.storeNameAr || "قطع غيار بلس"}
              </span>
              <span className="block text-[11px] text-amber-400 font-semibold tracking-wider uppercase">
                {storeSettings?.sloganAr ? storeSettings.sloganAr.substring(0, 32) + "..." : "متجر قطع السيارات المعتمد"}
              </span>
            </div>
          </Link>

          {/* Quick Search Bar (Search by OEM Number or Name) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برقم القطعة (OEM) مثل: 90919-02258 أو باسم القطعة..."
                className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm rounded-xl py-2.5 pr-10 pl-24 border border-slate-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-colors shadow-sm"
              >
                بحث
              </button>
            </div>
          </form>

          {/* Right Action Icons & Vehicle Selector */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Vehicle Garage Button */}
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs md:text-sm font-medium transition-all ${
                selectedVehicle
                  ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900"
                  : "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600"
              }`}
            >
              <Car className={`w-4 h-4 ${selectedVehicle ? "text-emerald-400 animate-bounce" : "text-amber-400"}`} />
              <div className="text-right hidden sm:block">
                <span className="block text-[10px] text-slate-400">كراج سيارتي</span>
                <span className="font-bold text-xs">
                  {selectedVehicle
                    ? `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}`
                    : "حدد سيارتك للتوافق"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/products?wishlist=true"
              className="relative p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="المفضلة"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm shadow-md transition-all transform active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 && (
                <span className="bg-white text-red-600 text-xs font-black px-2 py-0.5 rounded-full shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Entry Button */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">لوحة التحكم</span>
            </Link>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم القطعة OEM أو الاسم..."
              className="w-full bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl py-2 pr-9 pl-16 border border-slate-700 focus:outline-none focus:border-red-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <button
              type="submit"
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-red-600 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg"
            >
              بحث
            </button>
          </div>
        </form>
      </div>

      {/* Sub Navigation Bar */}
      <nav className="border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-none py-2.5 text-xs md:text-sm font-medium">
            <div className="flex items-center gap-1 md:gap-6 whitespace-nowrap">
              <Link
                href="/products"
                className="text-slate-200 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 font-bold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
                كافة قطع الغيار
              </Link>
              <Link
                href="/products?category=brakes"
                className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                الفرامل والمكابح
              </Link>
              <Link
                href="/products?category=engine"
                className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                المحرك والبواجي
              </Link>
              <Link
                href="/products?category=oils-filters"
                className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                الزيوت والفلاتر
              </Link>
              <Link
                href="/products?category=suspension"
                className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                التعليق والمساعدات
              </Link>
              <Link
                href="/products?category=electrical-lighting"
                className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                الكهرباء والإنارة LED
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400 shrink-0">
              <Link href="/orders/track" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                تتبع حالة الطلب
              </Link>
              {storeSettings?.phoneNumber && (
                <a href={`tel:${storeSettings.phoneNumber}`} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  {storeSettings.phoneNumber}
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Vehicle Selector Modal */}
      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />
    </header>
  );
}
