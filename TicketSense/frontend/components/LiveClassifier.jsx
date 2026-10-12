'use client';

import { useEffect, useState } from 'react';
import { 
  Send, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Tag, 
  Sliders, 
  Copy, 
  Check, 
  FileText, 
  AlertCircle,
  Building2,
  Info
} from 'lucide-react';
import { classifyTicket } from '../lib/api-client';
import { CATEGORY_METADATA } from '../lib/intents-data';

const SAMPLE_QUERIES = [
  { label: 'Cancel Order', query: 'I do not want my last item, please cancel order {{Order Number}}' },
  { label: 'Payment Doubled', query: 'My credit card was charged twice for transaction {{Order Number}}' },
  { label: 'Track Shipment', query: 'Help me check where my package is and how soon it will arrive' },
  { label: 'Refund Claim', query: 'I returned the damaged items and need to request my full refund now' },
  { label: 'Human Agent', query: 'I need to speak with a real customer support representative immediately' },
  { label: 'Update Address', query: 'Can I change my delivery street address before order is dispatched?' },
  { label: 'PDF Invoice', query: 'Could you please email me the official VAT receipt and commercial invoice?' },
  { label: 'Reset Password', query: 'I am locked out of my account and cannot recover my security passcode' },
];

export default function LiveClassifier({ prefilledQuery }) {
  const [inputText, setInputText] = useState('I do not want my last item, please cancel order {{Order Number}}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prefilledQuery) {
      setInputText(prefilledQuery);
    }
  }, [prefilledQuery]);

  const handleClassify = async (textToRun = inputText) => {
    if (!textToRun.trim()) {
      setError('Please provide ticket inquiry text.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await classifyTicket(textToRun);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Classification request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="flex flex-col gap-2 border-b border-slate-300 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Classify a ticket
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Add the customer&apos;s message to see its intent, destination team, priority, and response target.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Sample Chips */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="ticket-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Customer Inquiry Text
              </label>
              <span className="text-xs text-slate-500 font-mono">
                {inputText.length} / 2000 chars
              </span>
            </div>

            <div className="relative">
              <textarea
                id="ticket-input"
                rows={4}
                maxLength={2000}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    handleClassify();
                  }
                }}
                placeholder="Type or paste a customer support message here..."
                className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm leading-relaxed transition resize-none font-sans"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Sample Queries */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Test Samples from Bitext Dataset:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_QUERIES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(sample.query);
                      handleClassify(sample.query);
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">Ctrl + Enter</kbd> to classify
              </span>
              <button
                type="button"
                onClick={() => handleClassify()}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 shadow-md shadow-blue-600/30 transition ml-auto"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Classify & Route</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Prediction Results & SLA Dispatch */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-2xl space-y-5">
              {/* Header Status */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Predicted Intent
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {result.intent_label}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {result.intent}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Confidence</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {result.confidence_percentage}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyJson}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                    title="Copy full JSON output"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Department Routing Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    Automated SLA Dispatch
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    CATEGORY_METADATA[result.category]?.badgeClass || 'bg-slate-800 text-slate-300'
                  }`}>
                    {result.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">Assigned Unit</span>
                    <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate">
                      {result.routing?.department || 'General Support'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">Priority Tier</span>
                    <span className={`text-xs font-bold mt-0.5 block ${
                      result.routing?.priority === 'Critical' ? 'text-orange-400' :
                      result.routing?.priority === 'High' ? 'text-red-400' :
                      'text-blue-400'
                    }`}>
                      {result.routing?.priority || 'Normal'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">Target SLA</span>
                    <span className="text-xs font-bold font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {result.routing?.sla_hours ? `${result.routing.sla_hours} hours` : '< 2 hours'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_24px_1fr_24px_1fr] items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 px-3 py-3">
                  <div className="min-w-0 text-center">
                    <span className="mx-auto mb-1 block h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span className="block truncate text-[10px] font-semibold text-slate-800 sm:text-xs">Intent</span>
                  </div>
                  <span className="route-line" aria-hidden="true" />
                  <div className="min-w-0 text-center">
                    <span className="mx-auto mb-1 block h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="block truncate text-[10px] font-semibold text-slate-800 sm:text-xs">Assigned team</span>
                  </div>
                  <span className="route-line" aria-hidden="true" />
                  <div className="min-w-0 text-center">
                    <span className="mx-auto mb-1 block h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="block truncate text-[10px] font-semibold text-slate-800 sm:text-xs">Response target</span>
                  </div>
                </div>
              </div>

              {/* Top-5 Alternative Intents Distribution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="uppercase tracking-wider">Top-5 Intent Probability Distribution</span>
                  <span className="font-mono text-slate-500">Latency: {result.latency_ms} ms</span>
                </div>
                <div className="space-y-2">
                  {result.top_k?.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-300 flex items-center gap-2">
                          <span className="w-4 text-slate-500 font-sans">{idx + 1}.</span>
                          <span>{item.intent}</span>
                          <span className="text-[10px] text-slate-500 uppercase">({item.category})</span>
                        </span>
                        <span className="font-mono font-semibold text-slate-200">{item.percentage}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx === 0 ? 'bg-blue-500' : 'bg-slate-700'
                          }`}
                          style={{ width: `${Math.max(4, item.probability * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NLP Preprocessing & Placeholders Details */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 font-semibold">
                  <span className="uppercase tracking-wider text-[11px]">NLP Normalization Inspection</span>
                  {result.detected_placeholders?.length > 0 && (
                    <span className="text-[11px] text-amber-400 font-medium">
                      {result.detected_placeholders.length} Placeholder(s) Detected
                    </span>
                  )}
                </div>
                <div className="font-mono text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800 break-all">
                  <span className="text-slate-500 select-none">cleaned: </span>
                  {result.clean_text}
                </div>
                {result.detected_placeholders?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.detected_placeholders.map((ph, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-mono">
                        {`{{${ph}}}`} → {`ph_${ph.toLowerCase().replace(/\s+/g, '_')}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-700">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-300">Ready to Classify</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Enter any customer support ticket or click one of the quick test samples to see real-time intent analysis and SLA routing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
