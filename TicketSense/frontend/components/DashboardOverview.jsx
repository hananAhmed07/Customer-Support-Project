'use client';

import { ArrowRight, Clock3, Headphones, Layers3, Route, Sparkles } from 'lucide-react';
import { CATEGORY_METADATA, INTENTS_CATALOG } from '../lib/intents-data';

const IMAGE_URL = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85';

export default function DashboardOverview({ setActiveTab }) {
  const categoryCount = Object.keys(CATEGORY_METADATA).length;

  const shortcuts = [
    {
      id: 'classifier',
      icon: Headphones,
      title: 'Classify a ticket',
      detail: 'Identify intent and send it to the right team.',
      action: 'Open classifier',
    },
    {
      id: 'batch',
      icon: Layers3,
      title: 'Triage a batch',
      detail: 'Process a list of inquiries or import a CSV.',
      action: 'Open batch triage',
    },
    {
      id: 'routing',
      icon: Route,
      title: 'Review service targets',
      detail: 'Find the assigned team and response target.',
      action: 'View SLA routes',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="home-feature rounded-xl">
        <div className="home-feature-copy">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#e4d08a]">
            <Sparkles className="h-3.5 w-3.5" />
            Support operations
          </div>
          <h1 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl">Every message has a next step.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#d6e6dc]">
            Classify a customer inquiry, find its destination team, and keep the response target in view.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('classifier')}
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#e6bf5b] px-4 py-2.5 text-sm font-bold text-[#183e37] transition hover:bg-[#f0d47e]"
          >
            Classify a ticket
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="home-feature-image">
          <img
            src={IMAGE_URL}
            alt="Customer support colleagues working together at a desk"
            className="absolute inset-0 h-full w-full object-cover"
            width="1200"
            height="800"
            fetchPriority="high"
          />
        </div>
      </section>

      <section aria-labelledby="workspace-summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <h2 id="workspace-summary" className="sr-only">Workspace summary</h2>
        <div className="flex items-center gap-4 rounded-lg border border-[#ccdcd2] bg-[#f7faf5] p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#dbe9de] text-[#124b45]"><Layers3 className="h-5 w-5" /></span>
          <div><p className="text-2xl font-bold tabular-nums text-[#183e37]">{INTENTS_CATALOG.length}</p><p className="text-xs font-medium text-[#638276]">Supported intents</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-lg border border-[#ccdcd2] bg-[#f7faf5] p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f6edcf] text-[#836619]"><Route className="h-5 w-5" /></span>
          <div><p className="text-2xl font-bold tabular-nums text-[#183e37]">{categoryCount}</p><p className="text-xs font-medium text-[#638276]">Routing categories</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-lg border border-[#ccdcd2] bg-[#f7faf5] p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f8e1da] text-[#a44331]"><Clock3 className="h-5 w-5" /></span>
          <div><p className="text-xl font-bold text-[#183e37] xl:text-2xl">15 min – 24 hr</p><p className="text-xs font-medium text-[#638276]">Configured response targets</p></div>
        </div>
      </section>

      <section aria-labelledby="quick-actions">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="quick-actions" className="text-xl font-bold text-[#183e37]">Your workbench</h2>
            <p className="mt-1 text-sm text-[#638276]">Go straight to the support task you need.</p>
          </div>
          <button type="button" onClick={() => setActiveTab('catalog')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#287b61] hover:text-[#124b45]">
            Browse all intents <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {shortcuts.map(({ id, icon: Icon, title, detail, action }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className="group flex min-h-40 flex-col items-start rounded-lg border border-[#ccdcd2] bg-[#f7faf5] p-5 text-left transition hover:border-[#8cae9c] hover:bg-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dbe9de] text-[#124b45]"><Icon className="h-5 w-5" /></span>
              <span className="mt-4 text-sm font-bold text-[#183e37]">{title}</span>
              <span className="mt-1 text-xs leading-5 text-[#638276]">{detail}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-bold text-[#287b61]">
                {action}<ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}