"use client";
import { useState } from "react";

const statementsData = [
  { id: 1, month: "October 2023", date: "Nov 1, 2023", type: "Monthly", status: "Ready", size: "2.4 MB" },
  { id: 2, month: "September 2023", date: "Oct 1, 2023", type: "Monthly", status: "Ready", size: "1.8 MB" },
  { id: 3, month: "August 2023", date: "Sep 1, 2023", type: "Monthly", status: "Ready", size: "2.1 MB" },
  { id: 4, month: "Q3 2023", date: "Oct 1, 2023", type: "Quarterly", status: "Ready", size: "5.6 MB" },
  { id: 5, month: "July 2023", date: "Aug 1, 2023", type: "Monthly", status: "Ready", size: "1.5 MB" },
  { id: 6, month: "June 2023", date: "Jul 1, 2023", type: "Monthly", status: "Ready", size: "2.0 MB" },
  { id: 7, month: "Q2 2023", date: "Jul 1, 2023", type: "Quarterly", status: "Ready", size: "4.9 MB" },
];

export default function StatementsPage() {
  const [filter, setFilter] = useState<"All" | "Monthly" | "Quarterly">("All");
  const [downloaded, setDownloaded] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ start: "", end: "", format: "PDF" });

  const filtered = filter === "All" ? statementsData : statementsData.filter(s => s.type === filter);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleDownload(s: typeof statementsData[0]) {
    setDownloaded(prev => new Set(prev).add(s.id));
    showToastMsg(`Downloading ${s.month} statement (${s.size})...`);
  }

  function handleRequestStatement() {
    if (!requestForm.start || !requestForm.end) {
      showToastMsg("Please select both start and end dates");
      return;
    }
    showToastMsg(`Custom statement request for ${requestForm.start} to ${requestForm.end} submitted! You'll be notified when it's ready.`);
    setShowRequestModal(false);
  }

  return (
    <>
      <div className="p-10 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display text-3xl text-on-surface mb-2">Financial Statements</h2>
            <p className="text-body-lg text-outline">Download and review your transaction history and tax documents</p>
          </div>
          <div className="flex gap-4">
            <div className="flex bg-surface-container rounded-lg p-1 gap-1 shadow-sm border border-outline-variant/30">
              {(["All", "Monthly", "Quarterly"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 text-sm font-semibold rounded-md transition-all ${filter === f ? "bg-white shadow-sm text-primary" : "text-outline hover:text-primary"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-[14px] rounded-lg hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
              Request Custom
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-10 py-6 bg-surface-container-low border-b border-outline-variant/30 font-semibold text-outline uppercase text-[12px] tracking-wider">
            <span>Statement Period</span>
            <span>Date Issued</span>
            <span>Type</span>
            <span>File Size</span>
            <span className="text-right">Action</span>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {filtered.map(s => (
              <div key={s.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-10 py-6 hover:bg-surface-container-low transition-all items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary">description</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[16px] text-on-surface block">{s.month}</span>
                    <span className="text-[12px] text-outline font-semibold uppercase tracking-wider">Ready to download</span>
                  </div>
                </div>
                <span className="text-[14px] font-semibold text-on-surface">{s.date}</span>
                <div>
                  <span className={`text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${s.type === "Quarterly" ? "bg-surface-container-low text-on-surface" : "bg-primary/10 text-primary"}`}>
                    {s.type}
                  </span>
                </div>
                <span className="text-[14px] font-semibold text-outline">{s.size}</span>
                <div className="text-right">
                  <button
                    onClick={() => handleDownload(s)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[14px] transition-all active:scale-95 shadow-sm ${
                      downloaded.has(s.id) 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "bg-white border border-outline-variant/30 text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{downloaded.has(s.id) ? "check_circle" : "file_download"}</span>
                    {downloaded.has(s.id) ? "Downloaded" : "Download PDF"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="p-20 text-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">folder_off</span>
              <p className="font-headline-md text-xl text-outline">No statements found for this filter.</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-primary rounded-[16px] p-8 text-white flex items-center justify-between shadow-[0_4px_20px_rgba(84,66,219,0.2)] relative overflow-hidden group">
          <div className="relative z-10 flex-1">
            <h3 className="font-display text-2xl mb-2 text-white">Need a tax report?</h3>
            <p className="text-white/80 text-body-md max-w-xl">You can generate consolidated tax reports for the 2023 fiscal year. These reports are compliant with local regulation and ready for your accountant.</p>
          </div>
          <button 
            onClick={() => showToastMsg("Generating tax report... you'll receive it via email shortly.")}
            className="relative z-10 px-8 py-4 bg-white text-primary font-bold rounded-lg hover:scale-105 transition-transform active:scale-95 shadow-sm text-[16px]"
          >
            Generate Tax Report
          </button>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowRequestModal(false)}>
          <div className="bg-white rounded-[16px] p-10 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-display text-2xl text-on-surface">Custom Statement</h3>
                <p className="text-[14px] font-semibold text-outline">Select a custom date range</p>
              </div>
              <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[14px] text-outline mb-2">Start Date</label>
                  <input
                    type="date"
                    value={requestForm.start}
                    onChange={e => setRequestForm(p => ({ ...p, start: e.target.value }))}
                    className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[14px] text-outline mb-2">End Date</label>
                  <input
                    type="date"
                    value={requestForm.end}
                    onChange={e => setRequestForm(p => ({ ...p, end: e.target.value }))}
                    className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none text-on-surface"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">File Format</label>
                <div className="flex gap-2">
                  {["PDF", "CSV", "Excel"].map(f => (
                    <button
                      key={f}
                      onClick={() => setRequestForm(p => ({ ...p, format: f }))}
                      className={`flex-1 py-3 rounded-lg font-semibold text-[14px] border transition-all ${
                        requestForm.format === f 
                          ? "bg-primary text-white border-primary" 
                          : "bg-white text-outline border-outline-variant/30 hover:bg-surface-container"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleRequestStatement}
                className="w-full py-4 bg-primary text-white rounded-lg font-bold hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all mt-4 text-[16px]"
              >
                Generate Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-[16px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-3 animate-slide-up z-50 border border-outline-variant/20">
          <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </>
  );
}
