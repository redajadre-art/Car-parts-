"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Tag,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    storeSettings,
  } = useStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponDiscountError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isCartOpen) return null;

  const currency = storeSettings?.currency || "ر.س";

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponDiscountError("");
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponCode.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        const c = data.data;
        if (cartTotal < parseFloat(c.minOrderAmount || "0")) {
          setCouponDiscountError(`الحد الأدنى للطلب لاستخدام هذا الكود هو ${c.minOrderAmount} ${currency}`);
          return;
        }

        if (c.discountType === "percentage") {
          const disc = (cartTotal * parseFloat(c.discountValue)) / 100;
          setCouponDiscount(disc);
        } else {
          setCouponDiscount(parseFloat(c.discountValue));
        }
        setCouponApplied(true);
      } else {
        setCouponDiscountError(data.error || "كود الخصم غير صحيح");
      }
    } catch (e) {
      setCouponDiscountError("حدث خطأ أثناء تطبيق الكود");
    }
  };

  const finalTotal = Math.max(0, cartTotal - couponDiscount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-r border-slate-800 text-white shadow-2xl flex flex-col justify-between">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">سلة الشراء ({cart.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-right">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-slate-300">سلتك فارغة حالياً</h3>
                <p className="text-xs text-slate-500">تصفح متجرنا وأضف قطع الغيار التي تحتاجها إلى السلة</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const p = item.product;
                const price = parseFloat(p.salePrice || p.price);
                let img = "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200";
                if (Array.isArray(p.imagesList) && p.imagesList.length > 0) img = p.imagesList[0];
                else if (typeof p.images === "string") {
                  try { img = JSON.parse(p.images)[0]; } catch {}
                }

                return (
                  <div
                    key={p.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 relative"
                  >
                    <img
                      src={img}
                      alt={p.titleAr}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {p.titleAr}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">OEM: {p.oemNumber}</p>
                      <p className="text-xs font-black text-red-400">
                        {price.toFixed(2)} {currency}
                      </p>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(p.id)}
                        className="text-slate-500 hover:text-rose-500 p-1"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(p.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(p.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-4">
              
              {/* Coupon Code Section */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="كود الخصم (مثل CAR15)"
                    disabled={couponApplied}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {couponApplied ? "مطبق ✅" : "تطبيق"}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
                {couponApplied && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    تم تطبيق الخصم بنجاح (-{couponDiscount.toFixed(2)} {currency})
                  </p>
                )}
              </div>

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{cartTotal.toFixed(2)} {currency}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>خصم الكوبون:</span>
                    <span>-{couponDiscount.toFixed(2)} {currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-red-500">{finalTotal.toFixed(2)} {currency}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold py-3.5 rounded-xl shadow-xl shadow-red-600/30 text-center text-sm flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <span>متابعة إتمام الطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ضمان مطابقة وتغليف آمن قبل الشحن
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
