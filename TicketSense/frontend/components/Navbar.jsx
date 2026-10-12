'use client';

import { useEffect, useState } from 'react';
import {
  BookOpenText,
  LayoutDashboard,
  Layers3,
  RefreshCw,
  Route,
  ScanText,
  Ticket,
} from 'lucide-react';
import { checkBackendHealth } from '../lib/api-client';

const NAV_GROUPS = [
  {
    label: 'WORKSPACE',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'classifier', label: 'Ticket classifier', icon: ScanText },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'batch', label: 'Batch triage', icon: Layers3 },
      { id: 'catalog', label: 'Intent catalog', icon: BookOpenText },
      { id: 'routing', label: 'SLA routing', icon: Route },
    ],
  },
];

const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

export default function Navbar({ activeTab, setActiveTab }) {
  const [health, setHealth] = useState('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealth = async () => {
    setIsRefreshing(true);
    const result = await checkBackendHealth();
    setHealth(result.connected ? 'connected' : 'offline');
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const healthLabel = health === 'connected' ? 'Classifier online' : health === 'checking' ? 'Checking classifier' : 'Classifier offline';

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col bg-[#124b45] text-white lg:flex">
        <div className="flex h-[82px] items-center gap-3 border-b border-white/15 px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e6bf5b] text-[#183e37]">
            <Ticket className="h-5 w-5" />
          </span>
          <div>
            <p className="font-heading text-lg font-bold leading-tight">TicketSense</p>
            <p className="mt-0.5 text-[11px] text-[#c0d9ca]">Support workspace</p>
          </div>
        </div>

        <nav aria-label="Main navigation" className="flex-1 space-y-7 px-3 py-7">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.14em] text-[#a7c8b7]">{group.label}</p>
              <div className="space-y-1">
                {group.items.map(({ id, label, icon: Icon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-[13px] font-semibold transition-colors ${
                        isActive ? 'bg-[#e8f1e9] text-[#124b45]' : 'text-[#d1e3d7] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-[17px] w-[17px] shrink-0" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/15 p-4">
          <div className="flex items-center gap-3 rounded-md bg-white/8 px-3 py-3">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${health === 'connected' ? 'bg-[#e6bf5b]' : health === 'checking' ? 'bg-[#a8c1b1]' : 'bg-[#df715b]'}`} />
            <div className="min-w-0 flex-1" aria-live="polite">
              <p className="truncate text-xs font-semibold text-white">{healthLabel}</p>
              <p className="mt-0.5 text-[10px] text-[#b8d0c3]">Prediction service</p>
            </div>
            <button type="button" onClick={fetchHealth} disabled={isRefreshing} title="Refresh classifier status" aria-label="Refresh classifier status" className="rounded p-1 text-[#b8d0c3] hover:text-white disabled:opacity-60">
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 w-full overflow-hidden bg-[#124b45] text-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e6bf5b] text-[#183e37]"><Ticket className="h-4 w-4" /></span>
            <div><p className="text-sm font-bold">TicketSense</p><p className="text-[10px] text-[#c0d9ca]">Support workspace</p></div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#d1e3d7]" aria-live="polite">
            <span className={`h-2 w-2 rounded-full ${health === 'connected' ? 'bg-[#e6bf5b]' : health === 'checking' ? 'bg-[#a8c1b1]' : 'bg-[#df715b]'}`} />
            {health === 'connected' ? 'Online' : health === 'checking' ? 'Checking' : 'Offline'}
          </div>
        </div>
        <nav aria-label="Main navigation" className="no-scrollbar flex gap-1 overflow-x-auto border-t border-white/15 px-3 py-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => setActiveTab(id)} aria-current={activeTab === id ? 'page' : undefined} className={`flex shrink-0 items-center gap-1.5 rounded px-3 py-2 text-[11px] font-semibold ${activeTab === id ? 'bg-[#e8f1e9] text-[#124b45]' : 'text-[#d1e3d7] hover:bg-white/10'}`}>
              <Icon className="h-3.5 w-3.5" />{label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}