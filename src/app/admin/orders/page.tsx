"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Edit2, CheckCircle2, Eye, Printer, Filter } from "lucide-react";

export default function AdminOrdersPage() {
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let url = "/api/orders";
      if (filterStatus) url += `?status=${encodeURIComponent(filterStatus)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setOrdersList(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newStatus === "تم التسليم" ? "مدفوع" : "في الانتظار",
        }),
      });
      const data = await res.json();
      if (data.success) loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-500" />
            إدارة طلبات شحن قطع الغيار
          </h1>
          <p className="text-xs text-slate-400 mt-1">متابعة شحنات العملاء، تغيير الحالة، وطباعة الفواتير</p>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none"
          >
            <option value="">جميع الطلبات</option>
            <option value="جديد">جديد</option>
            <option value="قيد المعالجة">قيد المعالجة (الفحص والمطابقة)</option>
            <option value="تم الشحن">تم الشحن</option>
            <option value="تم التسليم">تم التسليم</option>
            <option value="ملغي">ملغي</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-slate-300">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                <th className="p-4">رقم الطلب</th>
                <th className="p-4">العميل والجوال</th>
                <th className="p-4">السيارة المرتبطة</th>
                <th className="p-4">إجمالي الطلب</th>
                <th className="p-4">طريقة الدفع</th>
                <th className="p-4">حالة الطلب</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">جاري التحميل...</td></tr>
              ) : ordersList.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-950/40">
                  <td className="p-4 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{ord.customerName}</p>
                    <p className="text-[10px] text-slate-400 dir-ltr text-right">{ord.customerPhone} ({ord.city})</p>
                  </td>
                  <td className="p-4 text-emerald-400 font-bold">{ord.vehicleInfo || "عام"}</td>
                  <td className="p-4 font-black text-white">{ord.totalAmount} ر.س</td>
                  <td className="p-4">{ord.paymentMethod}</td>
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-bold"
                    >
                      <option value="جديد">جديد</option>
                      <option value="قيد المعالجة">قيد المعالجة</option>
                      <option value="تم الشحن">تم الشحن</option>
                      <option value="تم التسليم">تم التسليم</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:text-white"
                      title="معاينة الفاتورة"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-3xl p-6 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">تفاصيل فاتورة الطلب: {selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">إغلاق</button>
            </div>

            <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p><span className="text-slate-500">اسم العميل:</span> {selectedOrder.customerName}</p>
              <p><span className="text-slate-500">الهاتف:</span> {selectedOrder.customerPhone}</p>
              <p><span className="text-slate-500">العنوان:</span> {selectedOrder.city} - {selectedOrder.shippingAddress}</p>
              <p><span className="text-slate-500">طريقة الدفع:</span> {selectedOrder.paymentMethod}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white">القطع المطلوبة بالفاتورة:</h4>
              {selectedOrder.items && selectedOrder.items.map((it: any) => (
                <div key={it.id} className="bg-slate-950 p-3 rounded-xl text-xs flex justify-between">
                  <span>{it.productTitle} (OEM: {it.oemNumber})</span>
                  <span className="font-bold text-amber-400">{it.quantity} × {it.price} ر.س</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm font-black border-t border-slate-800 pt-3">
              <span>الإجمالي الكلي:</span>
              <span className="text-red-500">{selectedOrder.totalAmount} ر.س</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
