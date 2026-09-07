"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  Search,
  ShoppingCart,
  Heart,
  Car,
  Phone,
  LayoutDashboard,
  Globe,
  Menu,
  X
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const store = (useStore() || {}) as any;
  const cart = store.cart || [];
  const wishlist = store.wishlist || [];
  const selectedVehicle = store.selectedVehicle || null;

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ar");

  useEffect(() => {
    const savedLang = typeof window !== "undefined" ? localStorage.getItem("app_lang") || "ar" : "ar";
    setCurrentLang(savedLang);
    if (typeof document !== "undefined") {
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = savedLang;
    }
  }, []);

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_lang", lang);
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
      window.location.reload();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const totalCartCount = Array.isArray(cart)
    ? cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)
    : 0;

  const handleGarageClick = () => {
    if (typeof store.openVehicleModal === "function") {
      store.openVehicleModal();
    } else if (typeof store.setIsVehicleModalOpen === "function") {
      store.setIsVehicleModalOpen(true);
    } else {
      router.push("/products");
    }
  };

  const t = {
    ar: {
      allProducts: "كافة قطع الغيار",
      brakes: "الفرامل والمكابح",
      engine: "المحرك والبواجي",
      oils: "الزيوت والفلاتر",
      suspension: "التعليق والمساعدات",
      electrical: "الكهرباء والإنارة",
      searchPlaceholder: "ابحث برقم القطعة (OEM) أو اسم الماركة...",
      searchBtn: "بحث",
      selectVehicle: selectedVehicle ? `${selectedVehicle.make || ""} ${selectedVehicle.model || ""}` : "حدد سيارتك للتوافق",
      myGarage: "كراج سيارتي",
      cart: "السلة",
      dashboard: "لوحة التحكم",
      codNotice: "توصيل سريع لجميع مدن المغرب | الدفع عند الاستلام (COD)",
      contactUs: "اتصل بنا"
    },
    fr: {
      allProducts: "Toutes les pièces",
      brakes: "Freinage",
      engine: "Moteur & Allumage",
      oils: "Huiles & Filtres",
      suspension: "Suspension",
      electrical: "Électricité & Éclairage",
      searchPlaceholder: "Rechercher par référence OEM ou marque...",
      searchBtn: "Recherche",
      selectVehicle: selectedVehicle ? `${selectedVehicle.make || ""} ${selectedVehicle.model || ""}` : "Sélectionnez votre véhicule",
      myGarage: "Mon Garage",
      cart: "Panier",
      dashboard: "Admin",
      codNotice: "Livraison partout au Maroc | Paiement à la livraison",
      contactUs: "Contactez-nous"
    },
    en: {
      allProducts: "All Auto Parts",
      brakes: "Brakes",
      engine: "Engine & Sparks",
      oils: "Oils & Filters",
      suspension: "Suspension",
      electrical: "Electrical & Lighting",
      searchPlaceholder: "Search by OEM number or brand...",
      searchBtn: "Search",
      selectVehicle: selectedVehicle ? `${selectedVehicle.make || ""} ${selectedVehicle.model || ""}` : "Select Your Vehicle",
      myGarage: "My Garage",
      cart: "Cart",
      dashboard: "Dashboard",
      codNotice: "Fast Delivery across Morocco | Cash on Delivery",
      contactUs: "Contact Us"
    }
  }[currentLang as "ar" | "fr" | "en"] || {
    allProducts: "كافة قطع الغيار",
    brakes: "الفرامل والمكابح",
    engine: "المحرك والبواجي",
    oils: "الزيوت والفلاتر",
    suspension: "التعليق والمساعدات",
    electrical: "الكهرباء والإنارة",
    searchPlaceholder: "ابحث برقم القطعة (OEM)...",
    searchBtn: "بحث",
    selectVehicle: "حدد سيارتك",
    myGarage: "كراج سيارتي",
    cart: "السلة",
    dashboard: "لوحة التحكم",
    codNotice: "توصيل سريع لجميع مدن المغرب",
    contactUs: "اتصل بنا"
  };

  const navCategories = [
    { slug: "", label: t.allProducts },
    { slug: "brakes", label: t.brakes },
    { slug: "engine", label: t.engine },
    { slug: "oils-filters", label: t.oils },
    { slug: "suspension", label: t.suspension },
    { slug: "electrical-lighting", label: t.electrical },
  ];

  return (
    <header className="w-full bg-[#0b1120] text-white sticky top-0 z-50 shadow-md border-b border-gray-800">
      {/* Top Banner */}
      <div className="bg-red-600 text-xs py-1.5 px-4 text-center font-medium flex justify-between items-center max-w-7xl mx-auto">
        <span className="truncate">{t.codNotice}</span>
        <div className="flex items-center gap-4 text-white">
          <a href="tel:+212769381637" className="hidden sm:flex items-center gap-1 hover:underline">
            <Phone className="w-3.5 h-3.5" />
            <span dir="ltr">0769381637</span>
          </a>
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-red-700 px-2 py-0.5 rounded text-[11px]">
            <Globe className="w-3 h-3 text-red-200" />
            <button
              type="button"
              onClick={() => changeLanguage("ar")}
              className={`px-1 rounded ${currentLang === "ar" ? "font-bold underline" : "opacity-80"}`}
            >
              العربية
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => changeLanguage("fr")}
              className={`px-1 rounded ${currentLang === "fr" ? "font-bold underline" : "opacity-80"}`}
            >
              FR
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => changeLanguage("en")}
              className={`px-1 rounded ${currentLang === "en" ? "font-bold underline" : "opacity-80"}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-red-600 p-2 rounded-lg text-white font-black text-xl">CP</div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
              CarParts<span className="text-red-500">.MA</span>
            </span>
            <span className="text-[10px] text-gray-400 block -mt-1">المغرب Auto Pièces</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex items-center relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="absolute left-1 top-1 bottom-1 bg-red-600 hover:bg-red-700 text-white px-4 rounded-md text-xs font-semibold flex items-center gap-1 rtl:left-1 rtl:right-auto ltr:right-1 ltr:left-auto"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.searchBtn}</span>
          </button>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Garage Selector */}
          <button
            type="button"
            onClick={handleGarageClick}
            className="hidden lg:flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg text-xs"
          >
            <Car className="w-4 h-4 text-amber-400" />
            <div className="text-right rtl:text-right ltr:text-left">
              <span className="text-[10px] text-gray-400 block">{t.myGarage}</span>
              <span className="font-bold text-gray-100 max-w-[130px] truncate block">{t.selectVehicle}</span>
            </div>
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-semibold">
            <ShoppingCart className="w-4 h-4" />
            <span>{t.cart}</span>
            <span className="bg-black/30 px-1.5 py-0.5 rounded text-xs">{totalCartCount}</span>
          </Link>

          {/* Dashboard */}
          <Link href="/admin" className="hidden sm:flex items-center gap-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-2.5 py-2 rounded-lg text-xs text-gray-300">
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">{t.dashboard}</span>
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="bg-[#111827] border-t border-gray-800/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 text-xs font-medium no-scrollbar">
          {navCategories.map((item) => {
            const href = item.slug ? `/products?category=${item.slug}` : "/products";
            return (
              <Link
                key={item.slug || "all"}
                href={href}
                className="whitespace-nowrap px-3 py-1.5 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
