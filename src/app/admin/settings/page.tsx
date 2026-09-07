"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Check, Store } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    storeNameAr: "",
    storeNameEn: "",
    sloganAr: "",
    sloganEn: "",
    phoneNumber: "",
    whatsappNumber: "",
    email: "",
    address: "",
    currency: "ر.س",
    logoUrl: "",
    footerAboutAr: "",
    taxNumber: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/store-settings");
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/store-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-right max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-500" />
            إعدادات المتجر العامة والهوية
          </h1>
          <p className="text-xs text-slate-400 mt-1">تحديث اسم المتجر، الشعار، أرقام التواصل، والبيانات الضريبية</p>
        </div>

        {saveSuccess && (
          <span className="bg-emerald-950 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
            <Check className="w-4 h-4" /> تم الحفظ بنجاح!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">اسم المتجر بالعربية *</label>
            <input
              type="text"
              required
              value={settings.storeNameAr || ""}
              onChange={(e) => setSettings({ ...settings, storeNameAr: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">اسم المتجر بالإنجليزية</label>
            <input
              type="text"
              value={settings.storeNameEn || ""}
              onChange={(e) => setSettings({ ...settings, storeNameEn: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white dir-ltr text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الشعار والوصف المختصر بالعربية</label>
            <input
              type="text"
              value={settings.sloganAr || ""}
              onChange={(e) => setSettings({ ...settings, sloganAr: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">العملة المستعملة</label>
            <input
              type="text"
              value={settings.currency || "ر.س"}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">رقم هاتف المبيعات</label>
            <input
              type="text"
              value={settings.phoneNumber || ""}
              onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white dir-ltr text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">رقم الواتساب للتواصل والخدمة</label>
            <input
              type="text"
              value={settings.whatsappNumber || ""}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white dir-ltr text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني للدعم</label>
            <input
              type="email"
              value={settings.email || ""}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white dir-ltr text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الرقم الضريبي للمتجر</label>
            <input
              type="text"
              value={settings.taxNumber || ""}
              onChange={(e) => setSettings({ ...settings, taxNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-amber-400 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">العنوان والمقر الرئيسي</label>
          <input
            type="text"
            value={settings.address || ""}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">عن المتجر (المعروض بالفوتر)</label>
          <textarea
            rows={3}
            value={settings.footerAboutAr || ""}
            onChange={(e) => setSettings({ ...settings, footerAboutAr: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "جاري الحفظ..." : "حفظ الإعدادات العامة"}</span>
        </button>
      </form>
    </div>
  );
}
