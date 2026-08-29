import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { login } from '@/services/api';

export function OfficerLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ username, password, role: 'officer' });
      navigate('/officer/face-auth');
    } catch {
      setError('Invalid credentials. Please verify your ID and password.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login({ username: 'officer', password: 'demo', role: 'officer' });
      navigate('/officer/face-auth');
    } catch {
      setError('Demo login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-ivory dark:bg-graphite">
      {/* Left: Atmospheric visual */}
      <div className="hidden lg:flex flex-1 relative bg-graphite dark:bg-charcoal overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* Concentric scan rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-80 h-80">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`absolute inset-0 rounded-full border border-sage/40 opacity-30`}
                style={{ transform: `scale(${1 + i * 0.3})`, borderWidth: '1px' }}
              />
            ))}
            <div className={`absolute inset-0 rounded-full border-2 border-sage/40 animate-pulse-slow`} />
            {/* Crosshair */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className={`w-16 h-16 text-sage opacity-60`} strokeWidth={1} />
            </div>
          </div>
        </div>
        {/* Technical labels */}
        <div className="absolute top-6 left-6 flex flex-col gap-1">
          <span className="micro-label text-ivory/40">LAT 28.5562° N</span>
          <span className="micro-label text-ivory/40">LON 77.1000° E</span>
        </div>
        <div className="absolute top-6 right-6 flex flex-col items-end gap-1">
          <span className="micro-label text-ivory/40">SYS-ID / BGA-001</span>
          <span className="micro-label text-ivory/40">ZONE / TERMINAL-3</span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          <span className="micro-label text-ivory/30">BORDER GUARD AI · SCREENING SYSTEM</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse-slow" />
            <span className="micro-label text-ivory/40">SECURE</span>
          </div>
        </div>
      </div>

      {/* Right: Auth panel */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className={`w-9 h-9 rounded-sm bg-forest flex items-center justify-center`}>
                <ShieldCheck className="w-5 h-5 text-ivory" strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide text-graphite dark:text-ivory">
                  BORDER GUARD <span className={`text-sage`}>AI</span>
                </div>
                <div className="micro-label text-graphite/60 dark:text-lilac/40 mt-0.5">
                  OFFICER ACCESS
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-graphite dark:text-ivory">
              Secure Access
            </h1>
            <p className="text-sm text-graphite/65 dark:text-lilac/50 mt-1">
              Authorized border security personnel only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="micro-label text-graphite/65 dark:text-lilac/50">ID / Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite/40 dark:text-lilac/40" strokeWidth={1.5} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory placeholder:text-stone-warm/30 dark:placeholder:text-lilac/30 focus:outline-none focus:border-sage dark:focus:border-sage-light transition-colors"
                  placeholder="Enter your ID"
                  autoComplete="off"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="micro-label text-graphite/65 dark:text-lilac/50">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite/40 dark:text-lilac/40" strokeWidth={1.5} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border border-black/10 dark:border-white/10 rounded-sm text-graphite dark:text-ivory placeholder:text-stone-warm/30 dark:placeholder:text-lilac/30 focus:outline-none focus:border-sage dark:focus:border-sage-light transition-colors"
                  placeholder="Enter password"
                  autoComplete="off"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-sm border border-vermilion/20 bg-vermilion/5">
                <AlertCircle className="w-4 h-4 text-vermilion shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-xs text-vermilion">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-ivory bg-sage hover:bg-sage-dark rounded-sm transition-colors disabled:opacity-50`}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
              ) : (
                <>
                  AUTHENTICATE
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Button */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2 rounded-sm border border-sage/40 hover:bg-sage/5 text-sage font-medium text-xs tracking-wide transition-colors disabled:opacity-50 mb-6"
          >
            DEMO LOGIN (officer / demo)
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse-slow" />
              <span className="micro-label text-stone-warm/50 dark:text-lilac/40">ENCRYPTED SESSION</span>
            </div>
            <button
              onClick={() => navigate('/admin/login')}
              className="text-xs text-stone-warm/50 dark:text-lilac/40 hover:text-graphite dark:hover:text-ivory transition-colors"
            >
              Admin login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
