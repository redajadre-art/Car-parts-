"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Wrench,
  ShieldCheck,
  Eye,
} from "lucide-react";

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>({
    titleAr: "",
    oemNumber: "",
    sku: "",
    brand: "تويوتا أصلي OEM",
    condition: "أصلي OEM",
    categoryId: "",
    price: "",
    salePrice: "",
    stock: 10,
    descriptionAr: "",
    images: "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800",
    isFeatured: true,
    isBestSeller: false,
    selectedVehicleIds: [] as number[],
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resP, resC, resV] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/vehicles"),
      ]);

      const dataP = await resP.json();
      const dataC = await resC.json();
      const dataV = await resV.json();

      if (dataP.success) setProductsList(dataP.data);
      if (dataC.success) setCategoriesList(dataC.data);
      if (dataV.success) setVehiclesList(dataV.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = editingProduct.id;
      const url = isEdit ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingProduct,
          vehicleFitments: editingProduct.selectedVehicleIds,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت تأكد من حذف قطعة الغيار هذه؟")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = productsList.filter(
    (p) =>
      p.titleAr.toLowerCase().includes(search.toLowerCase()) ||
      p.oemNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-red-500" />
            إدارة قطع الغيار والكتالوج (OEM & Aftermarket)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            إضافة وتحديث المنتجات، أرقام القطع OEM، الأسعار، والمخزون
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct({
              titleAr: "",
              oemNumber: "",
              sku: `SKU-${Date.now()}`,
              brand: "تويوتا أصلي OEM",
              condition: "أصلي OEM",
              categoryId: categoriesList[0]?.id || 1,
              price: "150.00",
              salePrice: "",
              stock: 20,
              descriptionAr: "قطعة غيار ذات كفاءة عالية أصلية وكالة مضمونة.",
              images: "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800",
              isFeatured: true,
              isBestSeller: false,
              selectedVehicleIds: [],
            });
            setIsModalOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قطعة غيار جديدة</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث برقم OEM أو اسم القطعة أو الماركة..."
          className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl p-3 pr-9 focus:outline-none focus:border-red-500"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-slate-300">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                <th className="p-4">قطعة الغيار</th>
                <th className="p-4">رقم القطعة (OEM)</th>
                <th className="p-4">الماركة والدرجة</th>
                <th className="p-4">السعر</th>
                <th className="p-4">المخزون</th>
                <th className="p-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">جاري التحميل...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">لا توجد قطع غيار مطابقة</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-950/40">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <img
                        src={p.imagesList?.[0] || "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100"}
                        alt=""
                        className="w-10 h-10 object-cover rounded-xl border border-slate-800 shrink-0"
                      />
                      <span>{p.titleAr}</span>
                    </td>
                    <td className="p-4 font-mono text-amber-400 font-bold">{p.oemNumber}</td>
                    <td className="p-4">
                      <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg">
                        {p.brand} ({p.condition})
                      </span>
                    </td>
                    <td className="p-4 font-black text-white">
                      {p.salePrice ? (
                        <div>
                          <span className="text-red-400">{p.salePrice} ر.س</span>
                          <span className="text-[10px] text-slate-500 line-through mr-1.5">{p.price}</span>
                        </div>
                      ) : (
                        <span>{p.price} ر.س</span>
                      )}
                    </td>
                    <td className="p-4 font-bold">
                      {p.stock <= 10 ? (
                        <span className="text-rose-400 bg-rose-950 px-2 py-0.5 rounded-md">{p.stock} (منخفض)</span>
                      ) : (
                        <span className="text-emerald-400">{p.stock} متوفر</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct({
                              ...p,
                              categoryId: p.categoryId,
                              images: p.imagesList?.[0] || p.images,
                              selectedVehicleIds: [],
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 text-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">تعديل / إضافة قطعة غيار</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم القطعة باللغة العربية *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.titleAr}
                  onChange={(e) => setEditingProduct({ ...editingProduct, titleAr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">رقم القطعة الأصلي (OEM Number) *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.oemNumber}
                  onChange={(e) => setEditingProduct({ ...editingProduct, oemNumber: e.target.value })}
                  placeholder="مثال: 90919-02258"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">الماركة المصنعة *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  placeholder="Toyota, Denso, Bosch, Brembo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">حالة ودرجة التصنيع *</label>
                <select
                  value={editingProduct.condition}
                  onChange={(e) => setEditingProduct({ ...editingProduct, condition: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="أصلي OEM">أصلي OEM (وكالة)</option>
                  <option value="درجة أولى الممتاز">درجة أولى الممتاز (تايواني)</option>
                  <option value="مجدد أصلية">مجدد مع الضمان</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">القسم / التصنيف *</label>
                <select
                  value={editingProduct.categoryId}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">رمز الـ SKU</label>
                <input
                  type="text"
                  value={editingProduct.sku}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">السعر الأصلي (ر.س) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">سعر الخصم (اختياري)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.salePrice || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">المخزون المتوفر *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">رابط الصورة (Image URL) *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.images}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white dir-ltr text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">الوصف والمواصفات الفنية للقطعة</label>
              <textarea
                rows={3}
                value={editingProduct.descriptionAr}
                onChange={(e) => setEditingProduct({ ...editingProduct, descriptionAr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <div className="flex items-center gap-4 text-xs font-bold">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                  <span>منتج مميز بالرئيسية</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                  <span>الأكثر مبيعاً 🔥</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 text-xs px-4 py-2.5 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg"
                >
                  {saving ? "جاري الحفظ..." : "حفظ قطعة الغيار"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
