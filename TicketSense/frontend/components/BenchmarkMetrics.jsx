'use client';

import { 
  BarChart3, 
  Database, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { SYSTEM_BENCHMARK } from '../lib/intents-data';

export default function BenchmarkMetrics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Empirical Validation • Bitext 27K Customer Support Dataset</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Model Evaluation & Benchmark Performance
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Complete empirical audit from stratified 5-fold cross validation and held-out test splits. LinearSVC achieves 99.84% accuracy with only 4 errors across 2,428 real customer test inquiries.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Test Accuracy</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Held-Out</span>
          </div>
          <span className="text-3xl font-extrabold font-mono text-emerald-400">99.84%</span>
          <span className="text-[11px] text-slate-500 block mt-1">2,424 correct of 2,428</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Macro-F1 Score</span>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">All 27 Intents</span>
          </div>
          <span className="text-3xl font-extrabold font-mono text-blue-400">0.9980</span>
          <span className="text-[11px] text-slate-500 block mt-1">Val Macro-F1: 0.9996</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Feature Space</span>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">Union</span>
          </div>
          <span className="text-3xl font-extrabold font-mono text-purple-400">10,234</span>
          <span className="text-[11px] text-slate-500 block mt-1">Char n-grams + Word2Vec</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Inference Speed</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">CPU</span>
          </div>
          <span className="text-3xl font-extrabold font-mono text-cyan-400">1.2 <span className="text-sm font-normal text-slate-500">ms</span></span>
          <span className="text-[11px] text-slate-500 block mt-1">Sub-millisecond core vectorization</span>
        </div>
      </div>

      {/* Dataset Stratification & Feature Engineering */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dataset Splits */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Dataset Partitioning & Stratification
            </h2>
            <span className="text-xs font-mono text-slate-400">24,274 Total Clean Rows</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Starting from 26,872 raw records in the Bitext dataset, cleaning and exact deduplication eliminated 2,598 duplicates with zero label conflict. The corpus was split into 80/10/10 stratified subsets maintaining class proportions.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-300">Training Set (80%)</span>
                <span className="text-blue-400 font-bold">19,419 inquiries</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-300">Validation Set (10%)</span>
                <span className="text-indigo-400 font-bold">2,427 inquiries</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-300">Held-Out Test Set (10%)</span>
                <span className="text-emerald-400 font-bold">2,428 inquiries</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Engineering Architecture */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Feature Representation Rationale
            </h2>
            <span className="text-xs font-mono text-purple-400">FeatureUnion</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Customer inquiries contain heavy typos, misspellings, and placeholder tokens. Character-level n-grams combined with dense embeddings gave the benchmark-leading score.
          </p>

          <div className="space-y-2.5 pt-1">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-200">char_wb (2,5) TF-IDF Vectorizer</span>
                <span className="font-mono text-blue-400">10,106 features</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Word-boundary character n-grams from length 2 to 5. Tolerates severe customer typos (e.g. "oorder", "invoces", "hw soon").
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-200">Word2Vec 128-d (Mean-Pooled Transformer)</span>
                <span className="font-mono text-emerald-400">128 features</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Unsupervised domain embeddings trained with window=5, min_count=2, epochs=20. Captures semantic synonyms like "reimbursement" ↔ "refund".
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Empirical Model & Feature Benchmark
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison across candidate architectures evaluated during model selection.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Candidate Model</th>
                <th className="py-3 px-3">Feature Pipeline</th>
                <th className="py-3 px-3 text-center">Validation Macro-F1</th>
                <th className="py-3 px-3 text-center">Validation Accuracy</th>
                <th className="py-3 px-3 text-center">Training Time</th>
                <th className="py-3 px-3 text-right">Production Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {SYSTEM_BENCHMARK.models_comparison.map((m, idx) => (
                <tr key={idx} className={`hover:bg-slate-800/30 transition ${idx === 0 ? 'bg-blue-950/20' : ''}`}>
                  <td className="py-3.5 px-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px]">
                    {m.features}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-blue-400">
                    {m.macro_f1.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-200">
                    {m.accuracy.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                    {m.latency}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      idx === 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {m.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
