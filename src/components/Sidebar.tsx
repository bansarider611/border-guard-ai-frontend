import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { clearSession } from '@/services/api';

interface SidebarProps {
  items: { label: string; path: string; icon: React.ComponentType<{ className?: string }> }[];
  accent?: 'sage' | 'gold';
}

export function Sidebar({ items, accent = 'sage' }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/officer/scan' || path === '/admin') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const accentColor =
    accent === 'gold'
      ? 'border-gold text-gold'
      : 'border-sage text-sage';

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  return (
    <aside className="w-16 lg:w-56 border-r border-black/8 dark:border-white/8 flex flex-col bg-ivory/50 dark:bg-charcoal/50 shrink-0">
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 lg:px-3">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative flex items-center gap-3 px-2.5 py-2.5 rounded-sm text-sm transition-all ${
                active
                  ? `${accentColor} bg-black/3 dark:bg-white/5`
                  : 'text-graphite/65 dark:text-lilac/50 hover:text-graphite dark:hover:text-ivory hover:bg-black/3 dark:hover:bg-white/3'
              }`}
            >
              {active && (
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 ${accent === 'gold' ? 'bg-gold' : 'bg-sage'}`} />
              )}
              <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? accent === 'gold' ? 'text-gold' : 'text-sage' : ''}`} />
              <span className="hidden lg:inline font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-2 lg:p-3 border-t border-black/8 dark:border-white/8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-sm text-sm text-vermilion hover:bg-vermilion/10 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
          <span className="hidden lg:inline font-medium tracking-wide">LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}
