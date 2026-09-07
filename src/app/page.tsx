"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import PromoBanners from "@/components/PromoBanners";
import CustomSectionBlock from "@/components/CustomSectionBlock";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Sparkles, Flame, ShieldCheck, ChevronLeft, SlidersHorizontal, Search, Car } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function HomePage() {
  const { selectedVehicle } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedVehicle]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = "/api/products";
      if (selectedVehicle) {
        url += `?make=${encodeURIComponent(selectedVehicle.make)}&model=${encodeURIComponent(
          selectedVehicle.model
        )}&year=${selectedVehicle.year}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFeaturedProducts(data.data.slice(0, 8));
        const best = data.data.filter((p: any) => p.isBestSeller);
        setBestSellers(best.length > 0 ? best.slice(0, 4) : data.data.slice(0, 4));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl">
      {/* Header / Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Selected Vehicle Active Notice Banner */}
        {selectedVehicle && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 text-right">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    تم تفعيل تصفية الكراج لسيارتك: <span className="text-emerald-400 font-extrabold">{selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    جميع المنتجات المعروضة أدناه مفحوصة وموافقة تماماً لسيارتك.
                  </p>
                </div>
              </div>
              <Link
                href="/products"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0"
              >
                عرض كافة القطع المتوافقة
              </Link>
            </div>
          </div>
        )}

        {/* Categories Grid Section */}
        <CategoryGrid />

        {/* Featured Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                قطع الغيار الممتازة والأكثر طلباً
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                قطع أصلية وتجارية درجة أولى بأسعار منافسة مع الضمان
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-red-500 hover:text-red-400 flex items-center gap-1 group"
            >
              <span>عرض كل المنتجات</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">لا توجد منتجات مطابقة لسيارتك حالياً</h3>
              <p className="text-xs text-slate-400">جرب تغيير السيارت المختارة أو ابحث بدون تصفية الكراج</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Promotional Banners */}
        <PromoBanners />

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-red-500" />
                  الأعلى مبيعاً والقطع الأساسية للصيانة
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  قطع الفرامل، الفلاتر، الشمعات والبواجي الأكثر اعتماداً
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections (Editable in Admin: Why Us & Mechanic Adviser) */}
        <CustomSectionBlock />
      </main>

      {/* Cart Side Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
}
