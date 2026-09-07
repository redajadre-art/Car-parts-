"use client";

import React, { useState, useEffect } from "react";
import { Car, Plus, Trash2 } from "lucide-react";

export default function AdminVehiclesPage() {
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: "تويوتا",
    model: "",
    yearStart: 2018,
    yearEnd: 2024,
    engine: "2.5L 4-Cyl",
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      if (data.success) setVehiclesList(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.model) return;
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicle),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadVehicles();
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
            <Car className="w-6 h-6 text-emerald-400" />
            قاعدة بيانات السيارات وأداة التوافق
          </h1>
          <p className="text-xs text-slate-400 mt-1">إدارة الشركات، الموديلات، سعة المحرك والسنوات لأداة كراجي</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          إضافة موديل سيارة جديد
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-slate-300">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                <th className="p-4">الشركة المصنعة</th>
                <th className="p-4">الموديل</th>
                <th className="p-4">سنة البداية - النهاية</th>
                <th className="p-4">نوع المحرك</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">جاري التحميل...</td></tr>
              ) : vehiclesList.map((v) => (
                <tr key={v.id} className="hover:bg-slate-950/40">
                  <td className="p-4 font-bold text-white">{v.make}</td>
                  <td className="p-4 font-bold text-amber-400">{v.model}</td>
                  <td className="p-4">{v.yearStart} - {v.yearEnd}</td>
                  <td className="p-4 font-mono text-slate-300">{v.engine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold border-b border-slate-800 pb-3">إضافة سيارة جديدة للقاعدة</h3>

            <div>
              <label className="block text-xs font-bold mb-1">الشركة المصنعة (الماركة)</label>
              <input
                type="text"
                required
                value={newVehicle.make}
                onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                placeholder="تويوتا، نيسان، فورد..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">الموديل</label>
              <input
                type="text"
                required
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                placeholder="كامري، باترول، النترا..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">سنة البدء</label>
                <input
                  type="number"
                  value={newVehicle.yearStart}
                  onChange={(e) => setNewVehicle({ ...newVehicle, yearStart: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">سنة الانتهاء</label>
                <input
                  type="number"
                  value={newVehicle.yearEnd}
                  onChange={(e) => setNewVehicle({ ...newVehicle, yearEnd: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">نوع ومواصفات المحرك</label>
              <input
                type="text"
                value={newVehicle.engine}
                onChange={(e) => setNewVehicle({ ...newVehicle, engine: e.target.value })}
                placeholder="2.5L 4-Cyl, 5.7L V8"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
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
              <button type="submit" className="bg-emerald-600 text-xs font-bold px-5 py-2 rounded-xl">
                إضافة
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
