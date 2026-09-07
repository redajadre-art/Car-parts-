"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Layers,
  Tag,
  Wrench,
  ShieldCheck,
  Eye,
  Save,
  MessageSquare,
  Volume2,
} from "lucide-react";

export default function StoreCustomizerPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "categories" | "promos" | "custom" | "announcement">("hero");

  // Hero Slides state
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // Promo Banners state
  const [promoBanners, setPromoBanners] = useState<any[]>([]);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  // Custom Sections state
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [whyUsItems, setWhyUsItems] = useState<any[]>([]);
  const [mechanicTip, setMechanicTip] = useState<any>({ tipTitle: "", tipContent: "", buttonText: "", buttonLink: "" });

  // Store Settings state
  const [settings, setSettings] = useState<any>({
    storeNameAr: "",
    sloganAr: "",
    announcementBarText: "",
    announcementEnabled: true,
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Hero slides
      const resH = await fetch("/api/hero-slides");
      const dataH = await resH.json();
      if (dataH.success) setHeroSlides(dataH.data);

      // Categories
      const resC = await fetch("/api/categories");
      const dataC = await resC.json();
      if (dataC.success) setCategories(dataC.data);

      // Promos
      const resP = await fetch("/api/promotional-banners");
      const dataP = await resP.json();
      if (dataP.success) setPromoBanners(dataP.data);

      // Custom Sections
      const resCS = await fetch("/api/custom-sections");
      const dataCS = await resCS.json();
      if (dataCS.success && Array.isArray(dataCS.data)) {
        setCustomSections(dataCS.data);
        const wUs = dataCS.data.find((s: any) => s.sectionKey === "why_choose_us");
        if (wUs && wUs.contentJson) {
          try { setWhyUsItems(typeof wUs.contentJson === "string" ? JSON.parse(wUs.contentJson) : wUs.contentJson); } catch {}
        }
        const mTip = dataCS.data.find((s: any) => s.sectionKey === "mechanic_tip");
        if (mTip && mTip.contentJson) {
          try { setMechanicTip(typeof mTip.contentJson === "string" ? JSON.parse(mTip.contentJson) : mTip.contentJson); } catch {}
        }
      }

      // Settings
      const resS = await fetch("/api/store-settings");
      const dataS = await resS.json();
      if (dataS.success && dataS.data) setSettings(dataS.data);

    } catch (e) {
      console.error(e);
    }
  };

  // Save Hero Slide
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = editingSlide.id;
      const url = isEdit ? `/api/hero-slides/${editingSlide.id}` : "/api/hero-slides";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSlide),
      });

      const data = await res.json();
      if (data.success) {
        setIsSlideModalOpen(false);
        setEditingSlide(null);
        loadAllData();
        triggerSuccess("تم حفظ البنر بنجاح");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: number) => {
    if (!confirm("هل أنت تأكد من حذف هذا البنر؟")) return;
    try {
      await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
      loadAllData();
      triggerSuccess("تم الحذف بنجاح");
    } catch (e) {
      console.error(e);
    }
  };

  // Save Promo Banner
  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = editingPromo.id;
      const url = isEdit ? `/api/promotional-banners/${editingPromo.id}` : "/api/promotional-banners";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPromo),
      });

      const data = await res.json();
      if (data.success) {
        setIsPromoModalOpen(false);
        setEditingPromo(null);
        loadAllData();
        triggerSuccess("تم حفظ العرض الترويجي بنجاح");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePromo = async (id: number) => {
    if (!confirm("هل أنت تأكد من حذف العرض؟")) return;
    try {
      await fetch(`/api/promotional-banners/${id}`, { method: "DELETE" });
      loadAllData();
      triggerSuccess("تم الحذف بنجاح");
    } catch (e) {
      console.error(e);
    }
  };

  // Save Custom Section (Why Choose Us & Mechanic Tip)
  const handleSaveCustomSections = async () => {
    setSaving(true);
    try {
      // Save why_choose_us
      await fetch("/api/custom-sections/why_choose_us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleAr: "لماذا يثق بنا آلاف أصحاب السيارات والمركبات؟",
          subtitleAr: "نوفر لك تجربة تسوق قطع غيار السيارات السلسة والأكثر أماناً والموثوقة بالكامل",
          contentJson: whyUsItems,
          isActive: true,
        }),
      });

      // Save mechanic_tip
      await fetch("/api/custom-sections/mechanic_tip", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleAr: "نصيحة المهندس الميكانيكي لليوم",
          subtitleAr: "تغيير فلاتر وزيوت المحرك في مواعيدها يرفع عمر المحرك الافتراضي بنسبة 40%",
          contentJson: mechanicTip,
          isActive: true,
        }),
      });

      triggerSuccess("تم حفظ التعديلات الخاصة بالكتل المخصصة بنجاح");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Save Announcement Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
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
        triggerSuccess("تم حفظ إعدادات شريط التنبيه واسم المتجر بنجاح");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const triggerSuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(""), 3000);
  };

  return (
    <div className="space-y-8 text-right">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1 rounded-full inline-block mb-1">
            أداة التعديل المباشر
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            مخصص كافة أقسام واجهة المتجر (Store Sections Customizer)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            من هنا يمكنك التعديل الفوري على أي قسم في واجهة المتجر: البنرات، الأقسام، العروض، والكتل الترويجية
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccess}</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "hero"
              ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          1. الشرائح الإعلانية (Hero Slides)
        </button>

        <button
          onClick={() => setActiveTab("promos")}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "promos"
              ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Tag className="w-4 h-4" />
          2. العروض والبنرات الترويجية
        </button>

        <button
          onClick={() => setActiveTab("custom")}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "custom"
              ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Wrench className="w-4 h-4" />
          3. الكتل المخصصة ("لماذا نحن" ونصح الفني)
        </button>

        <button
          onClick={() => setActiveTab("announcement")}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "announcement"
              ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Volume2 className="w-4 h-4" />
          4. شريط التنبيه العلوي (Announcement Bar)
        </button>
      </div>

      {/* TAB 1: HERO SLIDES EDITOR */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">إدارة شرائح البنر الرئيسي (Hero Slider)</h2>
            <button
              onClick={() => {
                setEditingSlide({
                  titleAr: "",
                  subtitleAr: "",
                  badgeAr: "تخفيضات موسمية",
                  buttonTextAr: "تصفح القطع الآن",
                  buttonLink: "/products",
                  imageUrl: "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
                  displayOrder: heroSlides.length + 1,
                  isActive: true,
                });
                setIsSlideModalOpen(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              إضافة شريحة بنر جديدة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroSlides.map((slide) => (
              <div
                key={slide.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-950">
                  <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg ${slide.isActive ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
                    {slide.isActive ? "مفعل بالصفحة" : "معطل"}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">
                    {slide.badgeAr || "خصم خاص"}
                  </span>
                  <h3 className="text-base font-black text-white line-clamp-1">{slide.titleAr}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{slide.subtitleAr}</p>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold">الترتيب: {slide.displayOrder}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingSlide(slide);
                        setIsSlideModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700"
                      title="تعديل"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:text-rose-300 hover:bg-slate-700"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROMOTIONAL BANNERS */}
      {activeTab === "promos" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">إدارة كتل العروض الترويجية في منتصف الواجهة</h2>
            <button
              onClick={() => {
                setEditingPromo({
                  titleAr: "",
                  subtitleAr: "",
                  discountTag: "وفر 20% الآن",
                  buttonText: "تسوق العرض",
                  buttonLink: "/products",
                  imageUrl: "https://images.pexels.com/photos/4294075/pexels-photo-4294075.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=900",
                  bgGradient: "from-amber-600 to-red-700",
                  isActive: true,
                });
                setIsPromoModalOpen(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              إضافة عرض ترويجي جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promoBanners.map((promo) => (
              <div
                key={promo.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full">
                    {promo.discountTag}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${promo.isActive ? "text-emerald-400 bg-emerald-950" : "text-rose-400 bg-rose-950"}`}>
                    {promo.isActive ? "ظاهر بالصفحة الرئيسية" : "مخفي"}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{promo.titleAr}</h3>
                  <p className="text-xs text-slate-400 mt-1">{promo.subtitleAr}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setEditingPromo(promo);
                      setIsPromoModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePromo(promo.id)}
                    className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC CUSTOM SECTIONS */}
      {activeTab === "custom" && (
        <div className="space-y-8">
          
          {/* Why Choose Us Custom Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              تعديل ميزات وحصانات المتجر (قسم "لماذا يثق بنا العملاء؟")
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whyUsItems.map((item, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">العنصر رقم #{idx + 1}</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">عنوان الميزة</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...whyUsItems];
                        updated[idx].title = e.target.value;
                        setWhyUsItems(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">الوصف المختصر</label>
                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) => {
                        const updated = [...whyUsItems];
                        updated[idx].desc = e.target.value;
                        setWhyUsItems(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mechanic Tip Custom Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Wrench className="w-5 h-5 text-amber-400" />
              تعديل قسم "نصيحة المهندس الميكانيكي"
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان النصيحة الرئيسي</label>
                <input
                  type="text"
                  value={mechanicTip.tipTitle || ""}
                  onChange={(e) => setMechanicTip({ ...mechanicTip, tipTitle: e.target.value })}
                  placeholder="كيف تعتني بنظام المكابح قبل الصيف؟"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">محتوى ونص النصيحة</label>
                <textarea
                  rows={3}
                  value={mechanicTip.tipContent || ""}
                  onChange={(e) => setMechanicTip({ ...mechanicTip, tipContent: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSaveCustomSections}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "جاري الحفظ..." : "حفظ التغييرات الكتلية"}</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 4: ANNOUNCEMENT BAR & GLOBAL SETTINGS */}
      {activeTab === "announcement" && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-2xl">
          <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Volume2 className="w-5 h-5 text-amber-400" />
            تعديل شريط التنبيه والإعلان أعلى المتجر
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-white">تفعيل إظهار شريط التنبيه العلوي</span>
              <input
                type="checkbox"
                checked={settings.announcementEnabled}
                onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                className="w-5 h-5 accent-red-600 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">نص شريط الإعلان العلوي</label>
              <textarea
                rows={2}
                value={settings.announcementBarText || ""}
                onChange={(e) => setSettings({ ...settings, announcementBarText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "جاري الحفظ..." : "حفظ إعدادات التنبيه"}</span>
          </button>
        </form>
      )}

      {/* Modal for Hero Slide Edit */}
      {isSlideModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleSaveSlide} className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold border-b border-slate-800 pb-3">تعديل / إضافة شريحة بنر رئيسي</h3>

            <div>
              <label className="block text-xs font-bold mb-1">العنوان الرئيسي *</label>
              <input
                type="text"
                required
                value={editingSlide.titleAr}
                onChange={(e) => setEditingSlide({ ...editingSlide, titleAr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">الوصف الفرعي *</label>
              <textarea
                rows={2}
                required
                value={editingSlide.subtitleAr}
                onChange={(e) => setEditingSlide({ ...editingSlide, subtitleAr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">نص الشارة (Badge)</label>
                <input
                  type="text"
                  value={editingSlide.badgeAr || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badgeAr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">رابط الصورة (Image URL) *</label>
                <input
                  type="text"
                  required
                  value={editingSlide.imageUrl}
                  onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white dir-ltr text-right"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={editingSlide.isActive}
                  onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded"
                />
                <span>تفعيل البنر بالنظام</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="bg-slate-800 text-xs px-4 py-2 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-xs font-bold px-5 py-2 rounded-xl"
                >
                  حفظ
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Modal for Promo Banner Edit */}
      {isPromoModalOpen && editingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleSavePromo} className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold border-b border-slate-800 pb-3">تعديل / إضافة عرض ترويجي</h3>

            <div>
              <label className="block text-xs font-bold mb-1">عنوان العرض *</label>
              <input
                type="text"
                required
                value={editingPromo.titleAr}
                onChange={(e) => setEditingPromo({ ...editingPromo, titleAr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">الوصف الفرعي *</label>
              <textarea
                rows={2}
                required
                value={editingPromo.subtitleAr}
                onChange={(e) => setEditingPromo({ ...editingPromo, subtitleAr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">علامة التخفيض Tag</label>
                <input
                  type="text"
                  value={editingPromo.discountTag || ""}
                  onChange={(e) => setEditingPromo({ ...editingPromo, discountTag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">رابط الصورة *</label>
                <input
                  type="text"
                  required
                  value={editingPromo.imageUrl}
                  onChange={(e) => setEditingPromo({ ...editingPromo, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white dir-ltr text-right"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={editingPromo.isActive}
                  onChange={(e) => setEditingPromo({ ...editingPromo, isActive: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded"
                />
                <span>تفعيل العرض بالصفحة</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="bg-slate-800 text-xs px-4 py-2 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-xs font-bold px-5 py-2 rounded-xl"
                >
                  حفظ
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
