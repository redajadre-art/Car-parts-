"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Plus, Trash2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "DISCOUNT10",
    discountType: "percentage",
    discountValue: "10.00",
    minOrderAmount: "100.00",
    isActive: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      if (data.success) setCouponsList(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadCoupons();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-red-500" />
            إدارة كودات الخصم والكوبونات
          </h1>
          <p className="text-xs text-slate-400 mt-1">أنشئ أكواد خصم نسبية أو مبالغ ثابتة للعملاء</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          إنشاء كوبون جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {couponsList.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-amber-400 font-mono">{c.code}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.isActive ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"}`}>
                {c.isActive ? "مفعل" : "معطل"}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              قيمة الخصم: <span className="font-bold text-white">{c.discountValue} {c.discountType === "percentage" ? "%" : "ر.س"}</span>
            </p>
            <p className="text-xs text-slate-400">
              الحد الأدنى للطلب: {c.minOrderAmount} ر.س
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold border-b border-slate-800 pb-3">إنشاء كود خصم جديد</h3>

            <div>
              <label className="block text-xs font-bold mb-1">كود الخصم (رمز) *</label>
              <input
                type="text"
                required
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                placeholder="CAR15"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-400 font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">نوع الخصم</label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ر.س)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">القيمة</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">الحد الأدنى للطلب (ر.س)</label>
              <input
                type="number"
                value={newCoupon.minOrderAmount}
                onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 text-xs px-4 py-2 rounded-xl">إلغاء</button>
              <button type="submit" className="bg-red-600 text-xs font-bold px-5 py-2 rounded-xl">إنشاء الكوبون</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
