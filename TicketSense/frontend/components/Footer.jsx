'use client';

import { Ticket, ExternalLink, ShieldCheck, CheckCircle2, Layers, Server } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Grid: Vercel Deployment Instructions */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              <span className="font-heading font-bold text-white text-sm">Vercel Production Deployment Architecture</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Ready for Vercel
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
            TicketSense is designed as two decoupled services deployable to Vercel under a unified monorepo or independent projects:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-[11px]">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-white font-bold block">1. Backend Service (FastAPI)</span>
              <p className="text-slate-400 text-[11px]">
                • Vercel Root Directory: <code className="text-blue-400">backend</code><br />
                • Entrypoint: <code className="text-blue-400">api/index.py</code><br />
                • Config: <code className="text-blue-400">backend/vercel.json</code> with <code>@vercel/python</code> runtime
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-white font-bold block">2. Frontend Service (Next.js)</span>
              <p className="text-slate-400 text-[11px]">
                • Vercel Root Directory: <code className="text-blue-400">frontend</code><br />
                • Framework: <code className="text-blue-400">Next.js (App Router)</code><br />
                • Environment Variable: <code className="text-blue-400">NEXT_PUBLIC_BACKEND_URL</code>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Ticket className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading font-bold text-white text-sm">TicketSense</span>
            <span className="text-slate-500 text-xs">© 2026 Enterprise Support Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>FastAPI 0.142</span>
            <span>•</span>
            <span>Next.js 14</span>
            <span>•</span>
            <span>LinearSVC (C=10.0)</span>
            <span>•</span>
            <span>Word2Vec 128-d</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
