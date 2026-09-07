"use client";

import React, { useState, useEffect } from "react";
import { Layers, Plus, Edit2, Trash2, X } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>({
    nameAr: "",
    slug: "",
    descriptionAr: "",
    iconName: "Wrench",
    imageUrl: "https://images.pexels.com/photos/833320/pexels-photo-833320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    isFeatured: true,
    displayOrder: 1,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategoriesList(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = editingCat.id;
      const url = isEdit ? `/api/categories/${editingCat.id}` : "/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCat),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("حذف هذا القسم؟")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      loadCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-red-500" />
            إدارة أقسام وتصنيفات قطع الغيار
          </h1>
          <p className="text-xs text-slate-400 mt-1">تعديل وإضافة التصنيفات المعروضة بكتالوج المتجر</p>
        </div>

        <button
          onClick={() => {
            setEditingCat({
              nameAr: "",
              slug: "",
              descriptionAr: "",
              iconName: "Wrench",
              imageUrl: "https://images.pexels.com/photos/833320/pexels-photo-833320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
              isFeatured: true,
              displayOrder: categoriesList.length + 1,
            });
            setIsModalOpen(true);
          }}
          className="bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          إضافة قسم جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesList.map((cat) => (
          <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">Icon: {cat.iconName}</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                الترتيب: {cat.displayOrder}
              </span>
            </div>

            <h3 className="text-base font-black text-white">{cat.nameAr}</h3>
            <p className="text-xs text-slate-400">{cat.descriptionAr}</p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setEditingCat(cat);
                  setIsModalOpen(true);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-200"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-2 rounded-xl bg-slate-800 text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold border-b border-slate-800 pb-3">إضافة / تعديل القسم</h3>

            <div>
              <label className="block text-xs font-bold mb-1">اسم القسم بالعربية *</label>
              <input
                type="text"
                required
                value={editingCat.nameAr}
                onChange={(e) => setEditingCat({ ...editingCat, nameAr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">الرمز (Slug) *</label>
              <input
                type="text"
                required
                value={editingCat.slug}
                onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })}
                placeholder="brakes, engine, oils"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">رمز الأيقونة (Icon Name)</label>
              <select
                value={editingCat.iconName}
                onChange={(e) => setEditingCat({ ...editingCat, iconName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="Disc">Disc (فرامل)</option>
                <option value="Cpu">Cpu (محرك)</option>
                <option value="Droplets">Droplets (زيوت)</option>
                <option value="Shield">Shield (تعليق ومساعدات)</option>
                <option value="Zap">Zap (كهرباء وإضاءة)</option>
                <option value="Wind">Wind (تبريد وعادم)</option>
                <option value="Wrench">Wrench (عام)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">رابط صورة المعاينة</label>
              <input
                type="text"
                value={editingCat.imageUrl}
                onChange={(e) => setEditingCat({ ...editingCat, imageUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white dir-ltr text-right"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-800 text-xs px-4 py-2 rounded-xl"
              >
                إلغاء
              </button>
              <button type="submit" className="bg-red-600 text-xs font-bold px-5 py-2 rounded-xl">
                حفظ
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
