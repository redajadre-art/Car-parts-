"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Car,
  Wrench,
  Sparkles,
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCat = searchParams.get("category") || "";
  const initialWishlist = searchParams.get("wishlist") === "true";

  const { selectedVehicle, wishlist, storeSettings } = useStore();

  const [productsList, setProductsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [onlyCompatible, setOnlyCompatible] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, selectedBrand, selectedCondition, sortOption, onlyCompatible, selectedVehicle]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategoriesList(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedBrand) params.set("brand", selectedBrand);
      if (selectedCondition) params.set("condition", selectedCondition);
      if (sortOption) params.set("sort", sortOption);

      if (onlyCompatible && selectedVehicle) {
        params.set("make", selectedVehicle.make);
        params.set("model", selectedVehicle.model);
        params.set("year", selectedVehicle.year);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        let list = data.data;
        if (initialWishlist) {
          list = list.filter((p: any) => wishlist.includes(p.id));
        }
        setProductsList(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedCondition("");
    setSortOption("newest");
  };

  const brands = Array.from(
    new Set(productsList.map((p) => p.brand).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                كتالوج متجر قطع غيار السيارات
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                {initialWishlist ? "قائمة المنتجات المفضلة" : "جميع قطع الغيار ومكونات السيارات"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {productsList.length} قطعة متوفرة جاهزة للشحن والتسليم
              </p>
            </div>

            {/* Vehicle Active Pill */}
            {selectedVehicle && (
              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-3 flex items-center gap-3 text-right">
                <Car className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce" />
                <div className="text-xs">
                  <p className="text-slate-300">السيارة المختارة:</p>
                  <p className="font-extrabold text-emerald-400">
                    {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar in Catalog Header */}
          <div className="mt-6 flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم القطعة، رقم OEM (مثل 04465-33470)، أو الشركة المصنعة..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-red-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-red-500"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters Column */}
          <aside className="space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-500" />
                تصفية المنتجات
              </h3>
              {(selectedCategory || selectedBrand || selectedCondition || search) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  إعادة ضبط
                </button>
              )}
            </div>

            {/* Filter 1: Compatible Only Toggle */}
            {selectedVehicle && (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2">
                <label className="flex items-center justify-between text-xs font-bold text-emerald-300 cursor-pointer">
                  <span>إظهار القطع المطابقة لسيارتك فقط</span>
                  <input
                    type="checkbox"
                    checked={onlyCompatible}
                    onChange={(e) => setOnlyCompatible(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
              </div>
            )}

            {/* Filter 2: Categories */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                القسم / التصنيف
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-red-500"
              >
                <option value="">جميع الأقسام</option>
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Condition (أصلي / تجاري / مجدد) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                نوع القطعة والدرجة
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-red-500"
              >
                <option value="">كافة الدرجات</option>
                <option value="أصلي OEM">أصلي OEM (وكالة)</option>
                <option value="درجة أولى الممتاز">درجة أولى الممتاز (تايواني/ياباني)</option>
                <option value="مجدد أصلية">مجدد مع الضمان</option>
              </select>
            </div>

            {/* Filter 4: Brand */}
            {brands.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  الماركة المصنعة
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="">كافة الماركات</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />
                ))}
              </div>
            ) : productsList.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-4">
                <Wrench className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">لم يتم العثور على قطع غيار مطابقة</h3>
                <p className="text-xs text-slate-400">جرب البحث بكلمة أخرى أو قم بإزالة بعض الفلاتر المطبقة</p>
                <button
                  onClick={clearFilters}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  مسح جميع الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsList.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">جاري التحميل...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
