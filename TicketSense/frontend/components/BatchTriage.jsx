'use client';

import { useState } from 'react';
import { 
  Upload, 
  Play, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  Download, 
  Layers,
  AlertCircle,
  Building2,
  Tag
} from 'lucide-react';
import { batchClassifyTickets } from '../lib/api-client';
import { CATEGORY_METADATA } from '../lib/intents-data';

const DEFAULT_BATCH_SAMPLES = [
  "I need help to cancel my order {{Order Number}} before it ships out",
  "Where do I check the cancellation penalty for early termination?",
  "How long does it take for my package to arrive at my residential address?",
  "Can you give me information about opening {{Account Type}} accounts?",
  "I returned the item and want my money refunded immediately",
  "My credit card was charged two times for the single order #88129",
  "I want to change purchase {{Order Number}} to a different model",
  "Please transfer me to talk to a real human person immediately",
  "Could you email me the official VAT tax invoice receipt?",
  "I cannot notify of problems with registration on mobile"
];

export default function BatchTriage() {
  const [inputText, setInputText] = useState(DEFAULT_BATCH_SAMPLES.join('\n'));
  const [loading, setLoading] = useState(false);
  const [batchResult, setBatchResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const handleRunBatch = async () => {
    const lines = inputText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) return;

    setLoading(true);
    try {
      const res = await batchClassifyTickets(lines);
      setBatchResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const rows = content.split('\n').filter(r => r.trim().length > 0);
        setInputText(rows.slice(0, 100).join('\n'));
      }
    };
    reader.readAsText(file);
  };

  const filteredPredictions = batchResult?.predictions?.filter(p => {
    const matchSearch = p.original_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.intent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchSearch && matchCat;
  }) || [];

  const exportCsv = () => {
    if (!filteredPredictions.length) return;
    const header = 'Text,Category,Intent,Confidence,Department,Priority,SLA\n';
    const rows = filteredPredictions.map(p => 
      `"${p.original_text.replace(/"/g, '""')}","${p.category}","${p.intent}","${p.confidence}","${p.routing.department}","${p.routing.priority}","${p.routing.sla_hours}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticketsense-triage-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Batch Support Ticket Triage
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Process multiple tickets simultaneously or upload an inquiry log to automatically categorize intents, assign departmental queues, and prioritize high-risk cancellations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Textarea & File Upload */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Raw Ticket Inquiries (One per line)
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload CSV</span>
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <textarea
              rows={10}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste customer support queries, one per line..."
              className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setInputText(DEFAULT_BATCH_SAMPLES.join('\n'))}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Reset to Sample Batch
              </button>
              <button
                type="button"
                onClick={handleRunBatch}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Batch...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Batch Triage</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Aggregated Metrics & Visuals */}
        <div className="lg:col-span-7 space-y-4">
          {batchResult ? (
            <div className="space-y-4">
              {/* Aggregation Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase">Total Inquiries</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1 block">
                    {batchResult.count}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase">Avg Latency</span>
                  <span className="text-2xl font-bold font-mono text-blue-400 mt-1 block">
                    {batchResult.avg_latency_ms} <span className="text-xs font-normal text-slate-500">ms</span>
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase">Categories</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                    {Object.keys(batchResult.category_distribution || {}).length}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block uppercase">Intents Mapped</span>
                  <span className="text-2xl font-bold font-mono text-[#287b61] mt-1 block">
                    {Object.keys(batchResult.intent_distribution || {}).length}
                  </span>
                </div>
              </div>

              {/* Category Breakdown Chips */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Category Volume Breakdown:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(batchResult.category_distribution || {}).map(([cat, count]) => (
                    <div
                      key={cat}
                      className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 ${
                        CATEGORY_METADATA[cat]?.badgeClass || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <span className="font-semibold">{cat}</span>
                      <span className="px-1.5 py-0.2 rounded bg-black/30 font-mono text-[11px]">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-center space-y-2">
              <Layers className="w-8 h-8 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-300">No Batch Active</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Click "Run Batch Triage" on the left to process all 10 pre-loaded support inquiries simultaneously.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Table Section */}
      {batchResult && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-white">Triaged Inquiries ({filteredPredictions.length})</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Categories</option>
                {Object.keys(batchResult.category_distribution || {}).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800/80">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Ticket Inquiry</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Predicted Intent</th>
                  <th className="py-3 px-3">Assigned Team</th>
                  <th className="py-3 px-3">SLA</th>
                  <th className="py-3 px-3 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredPredictions.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3 text-slate-200 font-medium max-w-xs sm:max-w-md truncate">
                      {row.original_text}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        CATEGORY_METADATA[row.category]?.badgeClass || 'bg-slate-800 text-slate-300'
                      }`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {row.intent}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {row.routing?.department}
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-mono">
                      {row.routing?.sla_hours ? `${row.routing.sla_hours}h` : '2h'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-200">
                      {row.confidence_percentage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
