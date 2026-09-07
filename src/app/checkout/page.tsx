"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Building2,
  ArrowRight,
  Car,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export default function CheckoutPage() {
  const {
    cart,
    cartTotal,
    clearCart,
    selectedVehicle,
    storeSettings,
  } = useStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("الرياض");
  const [paymentMethod, setPaymentMethod] = useState("الدفع عند الاستلام");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const currency = storeSettings?.currency || "ر.س";

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) return;
    setIsSubmitting(true);

    try {
      const items = cart.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.titleAr,
        oemNumber: item.product.oemNumber,
        price: item.product.salePrice || item.product.price,
        quantity: item.quantity,
      }));

      const vehicleString = selectedVehicle
        ? `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year} ${selectedVehicle.engine || ""}`
        : "";

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress,
          city,
          vehicleInfo: vehicleString,
          totalAmount: cartTotal,
          paymentMethod,
          notes,
          items,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.data);
        clearCart();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans dir-rtl">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              تم استلام طلبك بنجاح!
            </h1>

            <p className="text-sm text-slate-300">
              رقم الطلب الخاص بك هو: <span className="text-amber-400 font-extrabold text-lg">{orderSuccess.orderNumber}</span>
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-right">
              <p><span className="text-slate-400">اسم العميل:</span> {orderSuccess.customerName}</p>
              <p><span className="text-slate-400">رقم التواصل:</span> {orderSuccess.customerPhone}</p>
              <p><span className="text-slate-400">عنوان التوصيل:</span> {orderSuccess.city} - {orderSuccess.shippingAddress}</p>
              <p><span className="text-slate-400">طريقة الدفع:</span> {orderSuccess.paymentMethod}</p>
              <p><span className="text-slate-400">إجمالي المبلغ:</span> {orderSuccess.totalAmount} {currency}</p>
            </div>

            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>سيقوم فريق الدعم الفني بمراجعة رقم الشاسي ومطابقة قطع غيار طلبك ثم التواصل معك فوراً للتأكيد.</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/orders/track"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition-all"
              >
                تتبع حالة الطلب
              </Link>
              <Link
                href="/products"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
              >
                متابعة التسوق
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-red-500" />
          إتمام الطلب والشحن
        </h1>

        {cart.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">السلة فارغة حالياً</h3>
            <p className="text-xs text-slate-400">أضف بعض قطع الغيار للبدء في طلب الشحن</p>
            <Link
              href="/products"
              className="inline-block bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-right">
              
              {/* Step 1: Customer Info */}
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  بيانات العميل والتواصل
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: فهد عبد الله العتيبي"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رقم الجوال / الواتساب *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0501234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 dir-ltr text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني (اختياري)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="fahad@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 dir-ltr text-right"
                  />
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  عنوان التوصيل والشحن
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">المدينة *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="مكة المكرمة">مكة المكرمة</option>
                      <option value="المدينة المنورة">المدينة المنورة</option>
                      <option value="الخبر">الخبر</option>
                      <option value="الأحساء">الخبر / الأحساء</option>
                      <option value="تبوك">تبوك</option>
                      <option value="قصيم / بريدة">القصيم / بريدة</option>
                      <option value="مدينة أخرى">مدينة أخرى داخل المملكة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">العنوان ورقم الشارع والحي *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="اسم الحي - الشارع الرئيسي - رقم المبنى"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  طريقة الدفع الفوري
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("الدفع عند الاستلام")}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      paymentMethod === "الدفع عند الاستلام"
                        ? "bg-red-600/10 border-red-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Banknote className="w-6 h-6 text-emerald-400 mb-2" />
                    <div>
                      <h4 className="text-xs font-bold text-white">الدفع عند الاستلام</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">ادفع نقدياً للمندوب بعد معاينة الشحنة</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("بطاقة ائتمانية / مدى")}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      paymentMethod === "بطاقة ائتمانية / مدى"
                        ? "bg-red-600/10 border-red-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-amber-400 mb-2" />
                    <div>
                      <h4 className="text-xs font-bold text-white">مدى / فيزا / أبل باي</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">دفع إلكتروني آمن ومشفر 100%</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("تحويل بنكي")}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      paymentMethod === "تحويل بنكي"
                        ? "bg-red-600/10 border-red-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Building2 className="w-6 h-6 text-sky-400 mb-2" />
                    <div>
                      <h4 className="text-xs font-bold text-white">تحويل بنكي مباشر</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">حساب مصرف الراجحي / الأهلي</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">ملاحظات إضافية أو رقم الشاسي VIN</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="يمكنك تزويدنا برقم هيكل سيارتك VIN للتأكد من الملاءمة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

            </div>

            {/* Summary Sidebar Column */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit space-y-6 text-right">
              <h3 className="text-base font-black text-white border-b border-slate-800 pb-3">
                ملخص الطلب ({cart.length} قطعة)
              </h3>

              {selectedVehicle && (
                <div className="bg-emerald-950/60 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ربط السيارة: {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</span>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                    <div>
                      <p className="font-bold text-white line-clamp-1">{item.product.titleAr}</p>
                      <p className="text-[10px] text-slate-400">العدد: {item.quantity} × {item.product.salePrice || item.product.price} {currency}</p>
                    </div>
                    <span className="font-bold text-red-400">
                      {(parseFloat(item.product.salePrice || item.product.price) * item.quantity).toFixed(2)} {currency}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs border-t border-slate-800 pt-3 text-slate-300">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{cartTotal.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>تكلفة الشحن والتوصيل:</span>
                  <span className="text-emerald-400 font-bold">مجاناً ⚡</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>الإجمالي الكلي:</span>
                  <span className="text-red-500 text-lg">{cartTotal.toFixed(2)} {currency}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-xl shadow-red-600/30 text-sm transition-all"
              >
                {isSubmitting ? "جاري إنشاء الطلب..." : "تأكيد وإرسال الطلب الآن"}
              </button>

              <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                معاملتك آمنة وتخضع لضمان الفحص والقطع الأصلية
              </div>
            </div>

          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
