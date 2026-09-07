"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  Sliders,
  Users,
  Car,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard-stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-3xl border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right">
      
      {/* Welcome Banner & Quick Action */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border border-red-500/30 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1 rounded-full inline-block">
            لوحة قيادة المتجر والتحكم المباشر
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            مرحباً بك في لوحة تحكم متجر قطع غيار بلس
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            يمكنك من هنا متابعة مبيعاتك، إدارة طلبات العملاء، والتعديل الكامل على أقسام وواجهة المتجر.
          </p>
        </div>

        <Link
          href="/admin/store-customizer"
          className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-red-600/30 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          <Sliders className="w-5 h-5" />
          <span>تعديل أقسام المتجر (Live)</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">إجمالي المبيعات</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalSales?.toFixed(2) || "0.00"} ر.س</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            مبيعات تراكمية موثقة
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">عدد الطلبات</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalOrders || 0} طلبات</p>
          <p className="text-[11px] text-amber-400 font-bold">
            {stats?.pendingOrders || 0} طلبات بانتظار المعالجة
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">قطع الغيار بالمستودع</span>
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalProducts || 0} صنف</p>
          <p className="text-[11px] text-slate-400">
            موزعة على {stats?.totalCategories || 0} تصنيفات رئيسية
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">تنبيهات المخزون المنخفض</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400">{stats?.lowStockCount || 0} قطع</p>
          <p className="text-[11px] text-rose-400 font-bold">تتطلب إعادة الطلب والتزويد</p>
        </div>

      </div>

      {/* Low Stock Warning & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-black text-white text-base">أحدث طلبات العملاء</h3>
            <Link href="/admin/orders" className="text-xs text-red-500 hover:underline font-bold">
              عرض الكل
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((ord: any) => (
                <div
                  key={ord.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-extrabold text-amber-400 font-mono">{ord.orderNumber}</p>
                    <p className="text-slate-300">{ord.customerName} - {ord.city}</p>
                  </div>
                  <div className="text-left space-y-1">
                    <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg font-bold">
                      {ord.status}
                    </span>
                    <p className="font-black text-white">{ord.totalAmount} ر.س</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">لا توجد طلبات جديدة حالياً</p>
            )}
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-black text-white text-base text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              قائمة مخزون قطع الغيار المنخفض
            </h3>
            <Link href="/admin/products" className="text-xs text-red-500 hover:underline font-bold">
              إدارة المخزون
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.lowStockList && stats.lowStockList.length > 0 ? (
              stats.lowStockList.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{p.titleAr}</p>
                    <p className="text-[10px] text-slate-400 font-mono">OEM: {p.oemNumber}</p>
                  </div>
                  <span className="bg-rose-950 border border-rose-500/40 text-rose-300 font-bold px-3 py-1 rounded-xl">
                    المتبقي: {p.stock}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-400 py-4 text-center">جميع قطع الغيار بمستويات مخزون آمنة ✅</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
