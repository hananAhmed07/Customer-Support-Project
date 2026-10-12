'use client';

import { useState } from 'react';
import { 
  Tag, 
  Search, 
  Building2, 
  Clock, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';
import { INTENTS_CATALOG, CATEGORY_METADATA } from '../lib/intents-data';

export default function IntentCatalog({ onSelectIntent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = Object.keys(CATEGORY_METADATA);

  const filteredIntents = INTENTS_CATALOG.filter((item) => {
    const matchSearch = item.intent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.samples.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          27 Intents & Category Directory
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Browse all 27 customer support intents trained on the Bitext corpus. Inspect definitions, departmental SLA thresholds, and test real training phrases with 1 click.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search intents, categories, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition ${
              selectedCategory === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            All ({INTENTS_CATALOG.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Intents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntents.map((item) => {
          const catMeta = CATEGORY_METADATA[item.category] || CATEGORY_METADATA.ORDER;
          return (
            <div
              key={item.intent}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${catMeta.badgeClass}`}>
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {catMeta.sla}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.label}
                  </h3>
                  <code className="text-[11px] text-blue-400 font-mono">
                    {item.intent}
                  </code>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-1.5">
                    Real Dataset Inquiries:
                  </span>
                  <div className="space-y-1">
                    {item.samples.map((sample, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-slate-300 font-mono bg-slate-950/60 p-1.5 rounded border border-slate-900 truncate"
                        title={sample}
                      >
                        "{sample}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 truncate max-w-[160px]">
                  {catMeta.department}
                </span>
                <button
                  onClick={() => onSelectIntent(item.samples[0] || item.intent)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition"
                >
                  <span>Test Query</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
