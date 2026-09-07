"use client";

import React, { useState, useEffect, use } from "react";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import {
  ShoppingCart,
  Heart,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Wrench,
  ArrowRight,
  Car,
  ChevronLeft,
  Share2,
  Sparkles,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    selectedVehicle,
    storeSettings,
  } = useStore();

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewerRating] = useState(5);
  const [reviewComment, setReviewerComment] = useState("");
  const [reviewVehicle, setReviewerVehicle] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProduct(data.data);
        if (data.data.imagesList && data.data.imagesList.length > 0) {
          setSelectedImage(data.data.imagesList[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: Number(productId),
          customerName: reviewerName,
          rating: reviewRating,
          comment: reviewComment,
          vehicleModel: reviewVehicle || (selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : ""),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
        fetchProduct();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans dir-rtl">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
          <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-4" />
          <p className="text-slate-400">جاري تحميل مواصفات قطعة الغيار...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans dir-rtl">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <Wrench className="w-16 h-16 text-slate-600 mx-auto" />
          <h2 className="text-2xl font-bold">قطعة الغيار غير موجودة</h2>
          <a href="/products" className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold">
            العودة لكتالوج المنتجات
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const isWish = isInWishlist(product.id);
  const currency = storeSettings?.currency || "ر.س";
  const priceNum = parseFloat(product.price);
  const salePriceNum = product.salePrice ? parseFloat(product.salePrice) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Product Header & Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          
          {/* Left/Right Column 1: Image Gallery */}
          <div className="space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={selectedImage || "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1000"}
                alt={product.titleAr}
                className="w-full h-full object-cover"
              />

              {salePriceNum && (
                <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                  خصم مميز
                </span>
              )}

              <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl">
                {product.condition}
              </span>
            </div>

            {/* Thumbnails */}
            {product.imagesList && product.imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.imagesList.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img
                        ? "border-red-500 scale-105"
                        : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Details, Price & Fitment */}
          <div className="space-y-6 text-right flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Category & OEM Badge */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg font-bold">
                  {product.brand}
                </span>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg font-mono">
                  رقم القطعة OEM: {product.oemNumber}
                </span>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg font-mono">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {product.titleAr}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-400">({product.reviewsCount} تقييم من العملاء)</span>
              </div>

              {/* Price Box */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-baseline gap-3">
                {salePriceNum ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-red-500">
                      {salePriceNum.toFixed(2)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {priceNum.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-slate-300">{currency}</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      {priceNum.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-slate-300">{currency}</span>
                  </div>
                )}
                <span className="text-xs text-slate-400 mr-auto">شامل ضريبة القيمة المضافة</span>
              </div>

              {/* Compatibility Badge if garage selected */}
              {selectedVehicle && (
                <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-extrabold text-white">تأكيد التوافق مع سيارتك!</p>
                    <p>هذه القطعة متوافقة ومجربة 100% لسيارة {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</p>
                  </div>
                </div>
              )}

              {/* Description Summary */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.descriptionAr}
              </p>
            </div>

            {/* Actions: Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>إضافة للسلة ({quantity})</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isWish
                      ? "bg-red-600 border-red-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWish ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Security badges */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400 pt-2">
                <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ضمان الوكالة والتركيب المباشر</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>شحن سريع خلال 24 - 48 ساعة</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Product Specifications & Vehicle Fitment Matrix Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Specifications Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Wrench className="w-5 h-5 text-red-500" />
              المواصفات الفنية للقطعة
            </h3>

            {product.specificationsObj && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specificationsObj).map(([key, val]) => (
                  <div key={key} className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{key}:</span>
                    <span className="text-xs font-bold text-white">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Compatible Vehicles Matrix Table */}
            {product.fitments && product.fitments.length > 0 && (
              <div className="pt-6 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400" />
                  جدول توافق القطعة مع موديلات السيارات
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <th className="p-3">الشركة المصنعة</th>
                        <th className="p-3">الموديل</th>
                        <th className="p-3">سنوات التوافق</th>
                        <th className="p-3">ملاحظات الفني</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {product.fitments.map((fit: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-950/50">
                          <td className="p-3 font-bold text-white">{fit.make}</td>
                          <td className="p-3 font-bold text-amber-400">{fit.model}</td>
                          <td className="p-3">{fit.yearStart} - {fit.yearEnd}</td>
                          <td className="p-3 text-slate-400">{fit.notes || "تطابق كامل"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              آراء وتقييمات العملاء
            </h3>

            {/* List Reviews */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {product.reviewsList && product.reviewsList.length > 0 ? (
                product.reviewsList.map((rev: any) => (
                  <div key={rev.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 text-right">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{rev.customerName}</span>
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="mr-1">{rev.rating}</span>
                      </div>
                    </div>
                    {rev.vehicleModel && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md inline-block">
                        سيارته: {rev.vehicleModel}
                      </span>
                    )}
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">لا توجد مراجعات مكتوبة لهذه القطعة حتى الآن</p>
              )}
            </div>

            {/* Add Review Form */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-white">إضافة تقييم وتجربة تركيبه</h4>
              {reviewSubmitted ? (
                <div className="bg-emerald-950/80 text-emerald-300 p-3 rounded-xl text-xs font-bold text-center">
                  شكراً لك! تم إضافة تقييمك بنجاح.
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-2.5 text-right">
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="اسمك الكريمة..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>التقييم:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewerRating(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 text-amber-400 font-bold rounded-lg p-1.5 text-xs"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5 ممتاز)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5 جيد جداً)</option>
                      <option value={3}>⭐⭐⭐ (3/5 متوسط)</option>
                    </select>
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    placeholder="اكتب انطباعك ورأيك عن جودة ومطابقة قطعة الغيار..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                  >
                    إرسال التقييم
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
