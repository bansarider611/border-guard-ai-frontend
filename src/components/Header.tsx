import { ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLocation } from 'react-router-dom';
import { getSession } from '@/services/api';
import { useEffect, useState } from 'react';

interface HeaderProps {
  navItems: { label: string; path: string; icon: React.ComponentType<{ className?: string }> }[];
}

export function Header({ navItems }: HeaderProps) {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    setSession(getSession());
  }, [location.pathname]);

  const currentLabel = navItems.find((n) => location.pathname.startsWith(n.path))?.label || '';

  return (
    <header className="h-14 border-b border-black/8 dark:border-white/8 flex items-center justify-between px-6 bg-ivory/80 dark:bg-graphite/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-forest dark:bg-forest-light flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-ivory" strokeWidth={2} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-semibold tracking-wide text-graphite dark:text-ivory">
              BORDER GUARD <span className="text-gold">AI</span>
            </span>
            <span className="micro-label text-graphite/70 dark:text-lilac/60 mt-0.5">
              {currentLabel || 'CONSOLE'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-2 text-xs mono text-graphite/65 dark:text-lilac/50">
          <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse-slow" />
          SECURE SESSION
        </div>
        {session && (
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="mono text-graphite/65 dark:text-lilac/50">{session.user.officerId}</span>
            <span className="text-graphite/70 dark:text-ivory/70">·</span>
            <span className="text-graphite/80 dark:text-ivory/80">{session.user.name}</span>
          </div>
        )}
        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-sm border border-black/8 dark:border-white/10 text-stone-warm dark:text-lilac hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
