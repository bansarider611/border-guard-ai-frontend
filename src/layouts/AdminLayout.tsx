import { Outlet, useLocation } from 'react-router-dom';
import { BarChart3, LayoutGrid, AlertTriangle, History } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

const NAV_ITEMS = [
  { label: 'DASHBOARD', path: '/admin/dashboard', icon: BarChart3 },
  { label: 'SYSTEMS', path: '/admin/systems', icon: LayoutGrid },
  { label: 'FRAUDS', path: '/admin/frauds', icon: AlertTriangle },
  { label: 'HISTORY', path: '/admin/history', icon: History },
];

export function AdminLayout() {
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
        <Sidebar items={NAV_ITEMS} accent="gold" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
