"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PaymentRecord = {
  id: string;
  userId: string;
  userEmail: string;
  fullName?: string;
  whatsapp?: string;
  courseId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success && data.data?.payments) {
        setPayments(data.data.payments);
      }
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(payment: PaymentRecord, action: "approve" | "reject") {
    try {
      setProcessingId(payment.id);
      const res = await fetch(`/api/admin/payments/${payment.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          userEmail: payment.userEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === payment.id
              ? { ...p, status: action === "approve" ? "approved" : "rejected" }
              : p
          )
        );
      } else {
        alert(data.message || "Failed to update payment status.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Error updating payment verification.");
    } finally {
      setProcessingId(null);
    }
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredPayments = payments.filter((p) => {
    const matchesFilter = filterStatus === "all" || p.status === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      p.userEmail.toLowerCase().includes(term) ||
      (p.fullName && p.fullName.toLowerCase().includes(term)) ||
      (p.whatsapp && p.whatsapp.includes(term)) ||
      p.transactionId.toLowerCase().includes(term) ||
      p.courseId.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  const totalCount = payments.length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const approvedCount = payments.filter((p) => p.status === "approved").length;
  const totalRevenue = approvedCount * 1500;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Fee Verifications &amp; Student Approvals
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          Verify manual Easypaisa / JazzCash / Bank transfer receipts and approve immediate portal access.
        </p>
      </div>

        {/* KPI Metrics Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Key metrics">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Registrations
            </span>
            <p className="mt-2 text-3xl font-black text-slate-900">{totalCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Pending Verification
            </span>
            <p className="mt-2 text-3xl font-black text-amber-500">{pendingCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Approved Students
            </span>
            <p className="mt-2 text-3xl font-black text-emerald-600">{approvedCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Total Revenue
            </span>
            <p className="mt-2 text-3xl font-black text-blue-600">
              Rs. {totalRevenue.toLocaleString()}
            </p>
          </div>
        </section>

        {/* Filters and Search Bar */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((status) => {
              const active = filterStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                    active
                      ? "bg-[#2563EB] text-white shadow-sm shadow-blue-200"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {status}
                  {status === "pending" && pendingCount > 0 && (
                    <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] text-slate-950 font-black">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by Name, TxID, WhatsApp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Payments Table / List */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm font-semibold text-slate-500">
              Loading payment records...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center text-sm font-semibold text-slate-500">
              No transactions found matching this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Student / Contact</th>
                    <th className="px-5 py-3.5">Course</th>
                    <th className="px-5 py-3.5">JazzCash TxID</th>
                    <th className="px-5 py-3.5">Fee</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((p) => {
                    const isProcessing = processingId === p.id;
                    const cleanPhone = p.whatsapp ? p.whatsapp.replace(/\D/g, "") : "";

                    return (
                      <tr key={p.id} className="transition hover:bg-slate-50/80">
                        {/* Student Name & Email */}
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">
                            {p.fullName || p.userEmail.split("@")[0]}
                          </p>
                          <p className="text-[11px] text-slate-500">{p.userEmail}</p>
                          {p.whatsapp && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                            >
                              <span>💬</span>
                              {p.whatsapp}
                            </a>
                          )}
                        </td>

                        {/* Course */}
                        <td className="px-5 py-4 font-bold uppercase tracking-wide text-slate-800">
                          {p.courseId}
                        </td>

                        {/* Transaction ID */}
                        <td className="px-5 py-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{p.transactionId}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(p.transactionId, p.id)}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              title="Copy Transaction ID"
                            >
                              {copiedId === p.id ? "✓" : "📋"}
                            </button>
                          </div>
                        </td>

                        {/* Fee */}
                        <td className="px-5 py-4 font-bold text-slate-800">
                          Rs. {p.amount.toLocaleString()}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${
                              p.status === "approved"
                                ? "bg-emerald-600 text-white"
                                : p.status === "rejected"
                                ? "bg-red-600 text-white"
                                : "bg-amber-400 text-slate-950"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {p.status !== "approved" && (
                              <button
                                type="button"
                                onClick={() => handleVerify(p, "approve")}
                                disabled={isProcessing}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                              >
                                {isProcessing ? "..." : "✓ Approve"}
                              </button>
                            )}

                            {p.status !== "rejected" && (
                              <button
                                type="button"
                                onClick={() => handleVerify(p, "reject")}
                                disabled={isProcessing}
                                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                {isProcessing ? "..." : "✗ Reject"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
    </div>
  );
}
