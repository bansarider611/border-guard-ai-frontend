import { Outlet, useLocation } from 'react-router-dom';
import { Scan, History } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

const NAV_ITEMS = [
  { label: 'SCAN', path: '/officer/scan', icon: Scan },
  { label: 'HISTORY', path: '/officer/history', icon: History },
];

export function OfficerLayout() {
  const { pathname } = useLocation();
  const isFaceScan = pathname.endsWith('/face-auth') || pathname.endsWith('/face-scan');

  if (isFaceScan) {
    return (
      <main className="min-h-screen bg-ivory dark:bg-graphite">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ivory dark:bg-graphite">
      <Header navItems={NAV_ITEMS} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar items={NAV_ITEMS} accent="sage" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
