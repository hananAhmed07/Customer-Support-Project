'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardOverview from '../components/DashboardOverview';
import LiveClassifier from '../components/LiveClassifier';
import BatchTriage from '../components/BatchTriage';
import SlaMatrix from '../components/SlaMatrix';
import IntentCatalog from '../components/IntentCatalog';

const PAGE_TITLES = {
  overview: 'Overview',
  classifier: 'Ticket classifier',
  batch: 'Batch triage',
  routing: 'SLA routing',
  catalog: 'Intent catalog',
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [prefilledQuery, setPrefilledQuery] = useState(null);

  const handleSelectSampleFromCatalog = (query) => {
    setPrefilledQuery(query);
    setActiveTab('classifier');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-workspace flex min-h-screen flex-col lg:flex-row">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="app-main flex min-h-screen flex-col">
        <header className="app-topbar flex items-center justify-between px-5 py-4 sm:px-7 lg:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#638276]">Support workspace</p>
            <p className="mt-1 text-sm font-semibold text-[#183e37]">{PAGE_TITLES[activeTab]}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#ccdcd2] bg-white/70 px-3 py-2 text-xs font-semibold text-[#34594d]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dbe9de] text-[10px] font-bold text-[#124b45]">SA</span>
            <span className="hidden sm:inline">Support agent</span>
          </div>
        </header>

        <main className="dashboard-enter mx-auto w-full max-w-[1500px] flex-1 px-4 py-5 sm:px-7 sm:py-7 lg:px-10">
          {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
          {activeTab === 'classifier' && <LiveClassifier prefilledQuery={prefilledQuery} />}
          {activeTab === 'batch' && <BatchTriage />}
          {activeTab === 'routing' && <SlaMatrix />}
          {activeTab === 'catalog' && <IntentCatalog onSelectIntent={handleSelectSampleFromCatalog} />}
        </main>

        <footer className="border-t border-[#ccdcd2] px-5 py-4 text-[11px] text-[#638276] sm:px-7 lg:px-10">
          TicketSense <span className="mx-1.5 text-[#a4b9ac]">/</span> Support operations
        </footer>
      </div>
    </div>
  );
}
