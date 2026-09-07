"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, ShieldCheck, Truck, Package, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function TrackOrderPage() {
  const { storeSettings } = useStore();
  const [orderQuery, setOrderQuery] = useState("");
  const [orderResult, setOrderResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const currency = storeSettings?.currency || "ر.س";

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const found = data.data.find(
          (o: any) =>
            o.orderNumber.toLowerCase() === orderQuery.trim().toLowerCase() ||
            o.customerPhone.includes(orderQuery.trim())
        );
        setOrderResult(found || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full">
        
        {/* Title & Search Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-500">
            <Truck className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">تتبع حالة طلب قطع الغيار</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              أدخل رقم الطلب (مثل CP-10291) أو رقم الجوال لمتابعة الشحنة لحظة بلحظة
            </p>
          </div>

          <form onSubmit={handleTrack} className="max-w-md mx-auto flex items-center gap-2">
            <input
              type="text"
              required
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="رقم الطلب أو الجوال..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
            >
              استعلام
            </button>
          </form>
        </div>

        {/* Order Result Card */}
        {searched && (
          <div>
            {loading ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center animate-pulse">
                <p className="text-slate-400">جاري الاستعلام عن بيانات الطلب...</p>
              </div>
            ) : orderResult ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-right">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs text-slate-400">تفاصيل الطلب رقم:</span>
                    <h3 className="text-xl font-black text-amber-400 font-mono">{orderResult.orderNumber}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">الحالة الحالية:</span>
                    <span className="bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-extrabold px-3 py-1 rounded-xl text-xs">
                      {orderResult.status}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs py-4 border-b border-slate-800">
                  <div className={`p-2 rounded-xl border ${orderResult.status === "جديد" || orderResult.status === "قيد المعالجة" || orderResult.status === "تم الشحن" || orderResult.status === "تم التسليم" ? "bg-emerald-950 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                    <p className="font-bold">1. استلام الطلب</p>
                  </div>
                  <div className={`p-2 rounded-xl border ${orderResult.status === "قيد المعالجة" || orderResult.status === "تم الشحن" || orderResult.status === "تم التسليم" ? "bg-emerald-950 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                    <p className="font-bold">2. الفحص والمطابقة</p>
                  </div>
                  <div className={`p-2 rounded-xl border ${orderResult.status === "تم الشحن" || orderResult.status === "تم التسليم" ? "bg-emerald-950 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                    <p className="font-bold">3. الشحن والتوصيل</p>
                  </div>
                  <div className={`p-2 rounded-xl border ${orderResult.status === "تم التسليم" ? "bg-emerald-950 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                    <p className="font-bold">4. تسليم العميل</p>
                  </div>
                </div>

                {/* Details list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p><span className="text-slate-500">اسم العميل:</span> {orderResult.customerName}</p>
                  <p><span className="text-slate-500">رقم الهاتف:</span> {orderResult.customerPhone}</p>
                  <p><span className="text-slate-500">المدينة والعنوان:</span> {orderResult.city} - {orderResult.shippingAddress}</p>
                  <p><span className="text-slate-500">السيارة المرتبطة:</span> {orderResult.vehicleInfo || "غير محددة"}</p>
                  <p><span className="text-slate-500">المبلغ الكلي:</span> {orderResult.totalAmount} {currency}</p>
                  <p><span className="text-slate-500">طريقة الدفع:</span> {orderResult.paymentMethod} ({orderResult.paymentStatus})</p>
                </div>

                {/* Items in order */}
                {orderResult.items && orderResult.items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white">القطع المطلوبة:</h4>
                    <div className="space-y-1.5">
                      {orderResult.items.map((it: any) => (
                        <div key={it.id} className="bg-slate-950 p-2.5 rounded-xl text-xs flex justify-between">
                          <span>{it.productTitle} (OEM: {it.oemNumber})</span>
                          <span className="font-bold text-amber-400">{it.quantity} × {it.price} {currency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-white">لم يتم العثور على أي طلب برقم الاستعلام المدخل</h3>
                <p className="text-xs text-slate-400">تأكد من كتابة رقم الطلب بشكل صحيح كـ CP-10291 أو رقم الهاتف</p>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
