"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Wrench } from "lucide-react";

export default function Footer() {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") || "ar";
    setLang(saved);
  }, []);

  const t = {
    ar: {
      aboutTitle: "قطع غيار بلس | CarParts Maroc",
      aboutDesc: "وجهتك الموثوقة لشراء قطع الغيار الأصلية والمضمونة 100%. نوفر فحص التوافق التام برقم الهيكل مع شحن فوري.",
      taxId: "الرقم الضريبي: 310123456700003",
      partsTitle: "أقسام قطع الغيار",
      brakes: "أنظمة الفرامل والمكابح",
      engine: "قطع المحرك والبواجي",
      oils: "الزيوت والفلاتر",
      suspension: "التعليق والمساعدات",
      lighting: "LED الكهرباء والإضاءة",
      supportTitle: "خدمة العملاء",
      trackOrder: "تتبع حالة طلبك",
      cartCheckout: "سلة التسوق وإتمام الطلب",
      adminLogin: "دخول لوحة التحكم (للمسؤولين)",
      contactTitle: "تواصل معنا",
      location: "المغرب - الدار البيضاء / توصيل لجميع المدن",
      rights: "جميع الحقوق محفوظة لـ CarParts Maroc",
      payment: "الدفع عند الاستلام (COD) | دعم Apple Pay وفيزا ومدى",
    },
    fr: {
      aboutTitle: "CarParts Maroc | Pièces Auto",
      aboutDesc: "Votre destination de confiance pour les pièces auto 100% d'origine certifiées. Compatibilité garantie par numéro de châssis et expédition rapide.",
      taxId: "Identifiant Fiscal: 310123456700003",
      partsTitle: "Catégories de Pièces",
      brakes: "Systèmes de Freinage",
      engine: "Moteur & Allumage",
      oils: "Huiles & Filtres",
      suspension: "Suspension & Amortisseurs",
      lighting: "Électricité & Ampoules LED",
      supportTitle: "Service Client",
      trackOrder: "Suivi de commande",
      cartCheckout: "Panier & Commande",
      adminLogin: "Connexion Admin",
      contactTitle: "Contactez-nous",
      location: "Maroc - Casablanca / Livraison partout au pays",
      rights: "Tous droits réservés à CarParts Maroc",
      payment: "Paiement à la livraison (COD) | Apple Pay, Carte Bancaire",
    },
    en: {
      aboutTitle: "CarParts Maroc | Auto Spare Parts",
      aboutDesc: "Your trusted store for 100% genuine auto parts. Guaranteed vehicle fitment and fast nationwide shipping across Morocco.",
      taxId: "Tax ID: 310123456700003",
      partsTitle: "Categories",
      brakes: "Braking Systems",
      engine: "Engine & Ignition",
      oils: "Oils & Filters",
      suspension: "Suspension & Struts",
      lighting: "Electrical & LED Lighting",
      supportTitle: "Customer Support",
      trackOrder: "Order Tracking",
      cartCheckout: "Cart & Checkout",
      adminLogin: "Admin Login",
      contactTitle: "Contact Us",
      location: "Morocco - Casablanca / Nationwide Delivery",
      rights: "All rights reserved to CarParts Maroc",
      payment: "Cash on Delivery (COD) | Apple Pay & Credit Cards",
    },
  }[lang as "ar" | "fr" | "en"] || {
    aboutTitle: "قطع غيار بلس | CarParts Maroc",
    aboutDesc: "وجهتك الموثوقة لشراء قطع الغيار الأصلية والمضمونة 100%.",
    taxId: "الرقم الضريبي: 310123456700003",
    partsTitle: "أقسام قطع الغيار",
    brakes: "أنظمة الفرامل والمكابح",
    engine: "قطع المحرك والبواجي",
    oils: "الزيوت والفلاتر",
    suspension: "التعليق والمساعدات",
    lighting: "LED الكهرباء والإضاءة",
    supportTitle: "خدمة العملاء",
    trackOrder: "تتبع حالة طلبك",
    cartCheckout: "سلة التسوق وإتمام الطلب",
    adminLogin: "دخول لوحة التحكم",
    contactTitle: "تواصل معنا",
    location: "المغرب - الدار البيضاء / توصيل لجميع المدن",
    rights: "جميع الحقوق محفوظة لـ CarParts Maroc",
    payment: "الدفع عند الاستلام",
  };

  return (
    <footer className="bg-[#0b1120] text-gray-300 border-t border-gray-800 pt-12 pb-6 text-xs">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Brand Col */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-red-600 p-1.5 rounded text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-white">{t.aboutTitle}</span>
          </div>
          <p className="text-gray-400 leading-relaxed mb-3">{t.aboutDesc}</p>
          <span className="text-gray-500 font-mono text-[11px] block">{t.taxId}</span>
        </div>

        {/* Categories Col */}
        <div>
          <h3 className="text-white font-bold text-sm mb-3 border-r-2 border-red-600 pr-2 rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0 ltr:pl-2">
            {t.partsTitle}
          </h3>
          <ul className="space-y-2">
            <li><Link href="/products?category=brakes" className="hover:text-red-400 transition">{t.brakes}</Link></li>
            <li><Link href="/products?category=engine" className="hover:text-red-400 transition">{t.engine}</Link></li>
            <li><Link href="/products?category=oils-filters" className="hover:text-red-400 transition">{t.oils}</Link></li>
            <li><Link href="/products?category=suspension" className="hover:text-red-400 transition">{t.suspension}</Link></li>
            <li><Link href="/products?category=electrical-lighting" className="hover:text-red-400 transition">{t.lighting}</Link></li>
          </ul>
        </div>

        {/* Support Col */}
        <div>
          <h3 className="text-white font-bold text-sm mb-3 border-r-2 border-red-600 pr-2 rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0 ltr:pl-2">
            {t.supportTitle}
          </h3>
          <ul className="space-y-2">
            <li><Link href="/order-track" className="hover:text-red-400 transition">{t.trackOrder}</Link></li>
            <li><Link href="/cart" className="hover:text-red-400 transition">{t.cartCheckout}</Link></li>
            <li><Link href="/admin" className="hover:text-red-400 transition">{t.adminLogin}</Link></li>
          </ul>
        </div>

        {/* Contact Col */}
        <div>
          <h3 className="text-white font-bold text-sm mb-3 border-r-2 border-red-600 pr-2 rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0 ltr:pl-2">
            {t.contactTitle}
          </h3>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>{t.location}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500 shrink-0" />
              <a href="tel:+212769381637" dir="ltr" className="hover:underline">+212 7 69 38 16 37</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span dir="ltr">redajadre@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-[11px]">
        <span>© {new Date().getFullYear()} {t.rights}</span>
        <span>{t.payment}</span>
      </div>
    </footer>
  );
}
