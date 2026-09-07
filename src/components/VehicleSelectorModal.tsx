"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Car, Check, X, Sliders, Shield, AlertCircle } from "lucide-react";

interface VehicleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleSelectorModal({
  isOpen,
  onClose,
}: VehicleSelectorModalProps) {
  const { selectedVehicle, setSelectedVehicle } = useStore();

  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
      if (selectedVehicle) {
        setSelectedMake(selectedVehicle.make);
        setSelectedModel(selectedVehicle.model);
        setSelectedYear(selectedVehicle.year);
        setSelectedEngine(selectedVehicle.engine || "");
      }
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVehiclesList(data.data);
        const uniqueMakes = Array.from(new Set(data.data.map((v: any) => v.make))) as string[];
        setMakes(uniqueMakes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedMake) {
      const filtered = vehiclesList.filter((v) => v.make === selectedMake);
      setAvailableModels(filtered);
    } else {
      setAvailableModels([]);
    }
  }, [selectedMake, vehiclesList]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (selectedMake && selectedModel && selectedYear) {
      setSelectedVehicle({
        make: selectedMake,
        model: selectedModel,
        year: selectedYear,
        engine: selectedEngine,
      });
      onClose();
    }
  };

  const handleClear = () => {
    setSelectedVehicle(null);
    setSelectedMake("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedEngine("");
    onClose();
  };

  const years = Array.from({ length: 27 }, (_, i) => String(2026 - i));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">تحديد نوع وسنة السيارة (كراجي)</h3>
              <p className="text-xs text-slate-400">لإظهار قطع الغيار المطابقة لسيارتك 100%</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-right">
          {/* Step 1: Select Make */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              1. اختر الشركة المصنعة (الماركة)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {makes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSelectedMake(m);
                    setSelectedModel("");
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedMake === m
                      ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30"
                      : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Model */}
          {selectedMake && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                2. اختر الموديل ({selectedMake})
              </label>
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  const found = availableModels.find(
                    (v) => v.model === e.target.value
                  );
                  if (found) setSelectedEngine(found.engine);
                }}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-red-500"
              >
                <option value="">-- اختر موديل السيارة --</option>
                {availableModels.map((v) => (
                  <option key={v.id} value={v.model}>
                    {v.model} ({v.yearStart} - {v.yearEnd}) [{v.engine}]
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 3: Select Year */}
          {selectedModel && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  3. سنة الصنع
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="">-- سنة الصنع --</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  4. سعة المحرك (اختياري)
                </label>
                <input
                  type="text"
                  value={selectedEngine}
                  onChange={(e) => setSelectedEngine(e.target.value)}
                  placeholder="مثال: 2.5L 4-Cyl"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          {/* Compatibility Guarantee Banner */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-3 text-emerald-400 text-xs">
            <Shield className="w-5 h-5 shrink-0 text-emerald-400" />
            <p>
              عند تحديد سيارتك، سيقوم المتجر بتلقائية بتصفية وفحص توافق قطع الغيار وإظهار الشارة الخضراء <b>"متوافق 100%"</b>.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          {selectedVehicle ? (
            <button
              onClick={handleClear}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold px-3 py-2 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
            >
              إلغاء اختيار السيارة
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              إغلاق
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedMake || !selectedModel || !selectedYear}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              حفظ وربط الكراج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
