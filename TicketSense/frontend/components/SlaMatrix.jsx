'use client';

import { useState } from 'react';
import { 
  Building2, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Tag, 
  Filter, 
  Layers, 
  Search,
  AlertCircle
} from 'lucide-react';
import { CATEGORY_METADATA } from '../lib/intents-data';

export default function SlaMatrix() {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const categoriesList = Object.entries(CATEGORY_METADATA).map(([key, val]) => ({
    key,
    ...val
  }));

  const filteredCategories = categoriesList.filter((cat) => {
    const matchSearch = cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.department.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === 'ALL' || cat.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Departmental SLA & Routing Matrix
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Automated ticket routing rules based on Bitext 11-category classification. Incoming tickets are dynamically dispatched to specialized operational units with guaranteed response targets.
        </p>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-orange-400 mb-1">
            <span>Critical Tier</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20">15m Target</span>
          </div>
          <span className="text-lg font-bold text-white">Live Escalation</span>
          <p className="text-[11px] text-slate-400 mt-1">Direct customer requests for human supervisor.</p>
        </div>

        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-red-400 mb-1">
            <span>High Tier</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-500/20">1-2h Target</span>
          </div>
          <span className="text-lg font-bold text-white">Financial & Account</span>
          <p className="text-[11px] text-slate-400 mt-1">Cancellations, double charges, refunds, identity.</p>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-400 mb-1">
            <span>Medium Tier</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20">2-4h Target</span>
          </div>
          <span className="text-lg font-bold text-white">Logistics & Shipping</span>
          <p className="text-[11px] text-slate-400 mt-1">Address updates, delivery periods, order edits.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
            <span>Standard Tier</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800">12-24h Target</span>
          </div>
          <span className="text-lg font-bold text-white">Invoicing & Marketing</span>
          <p className="text-[11px] text-slate-400 mt-1">Tax receipts, reviews, newsletter subscriptions.</p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Operational Service Level Matrix</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Priority Tiers</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Category Tag</th>
                <th className="py-3 px-3">Assigned Operational Unit</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Guaranteed SLA</th>
                <th className="py-3 px-3">Scope & Workflows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredCategories.map((cat) => (
                <tr key={cat.key} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${cat.badgeClass}`}>
                      {cat.key}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cat.department}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      cat.priority === 'Critical' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      cat.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      cat.priority === 'Medium' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {cat.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cat.sla}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 text-[11px] max-w-sm">
                    {cat.description}
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
