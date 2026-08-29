import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { login } from '@/services/api';

export function AdminLogin() {
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
      await login({ username, password, role: 'admin' });
      navigate('/admin/face-auth');
    } catch {
      setError('Invalid credentials. Please verify your credentials.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login({ username: 'admin', password: 'demo', role: 'admin' });
      navigate('/admin/face-auth');
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
                className={`absolute inset-0 rounded-full border border-gold/40 opacity-30`}
                style={{ transform: `scale(${1 + i * 0.3})`, borderWidth: '1px' }}
              />
            ))}
          </div>
          <div className="absolute w-2 h-2 rounded-full bg-gold animate-pulse" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full border border-gold/20 opacity-20" />
      </div>

      {/* Right: Form */}
      <div className="flex-1 lg:flex-none lg:w-96 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Branding */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-sm bg-gold flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-charcoal" strokeWidth={2} />
              </div>
              <div>
                <div className="text-xl font-semibold tracking-wide text-graphite dark:text-ivory">
                  BORDER GUARD <span className="text-gold">AI</span>
                </div>
                <div className="micro-label text-graphite/60 dark:text-lilac/40 mt-0.5">
                  ADMINISTRATIVE CONSOLE
                </div>
              </div>
            </div>
            <p className="text-sm text-graphite/65 dark:text-lilac/50">
              System administration and intelligence oversight
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {error && (
              <div className="flex gap-3 p-3 rounded-sm bg-vermilion/10 border border-vermilion/30">
                <AlertCircle className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                <p className="text-xs text-vermilion">{error}</p>
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="micro-label text-graphite/80 dark:text-ivory/80">
                ADMIN ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., admin"
                  disabled={loading}
                  className="w-full pl-9 pr-3 py-2 rounded-sm border border-black/8 dark:border-white/10 bg-ivory dark:bg-charcoal text-graphite dark:text-ivory placeholder:text-stone-warm/30 dark:placeholder:text-lilac/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="micro-label text-graphite/80 dark:text-ivory/80">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-9 pr-3 py-2 rounded-sm border border-black/8 dark:border-white/10 bg-ivory dark:bg-charcoal text-graphite dark:text-ivory placeholder:text-stone-warm/30 dark:placeholder:text-lilac/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-2.5 rounded-sm bg-gold hover:bg-gold-dark disabled:bg-gold/50 text-charcoal font-medium text-sm tracking-wide transition-colors flex items-center justify-center gap-2 group"
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </button>
          </form>

          {/* Demo Button */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2 rounded-sm border border-gold/40 hover:bg-gold/5 text-gold font-medium text-xs tracking-wide transition-colors disabled:opacity-50"
          >
            DEMO LOGIN (admin / demo)
          </button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-black/8 dark:border-white/8 text-center">
            <p className="text-xs text-stone-warm/50 dark:text-lilac/40">
              Not an admin? <button onClick={() => window.location.href = '/officer/login'} className="text-sage hover:text-sage-light">Officer Login</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
