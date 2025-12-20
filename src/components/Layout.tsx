import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isExam = location.pathname.includes('/exam');

  if (isExam) {
    return <main className="min-h-screen bg-ios-bg">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-ios-bg pb-24 md:pb-0 md:pl-64 transition-all">
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 p-6 z-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">
          KPSS <span className="text-ios-blue">Koç</span>
        </h1>
        <nav className="space-y-2">
          <NavItem to="/" icon={<Home size={20} />} label="Ana Sayfa" active={location.pathname === '/'} />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Ayarlar" active={location.pathname === '/settings'} />
        </nav>
      </aside>

      <main className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around p-3">
          <MobileNavItem to="/" icon={<Home size={24} />} label="Ana Sayfa" active={location.pathname === '/'} />
          <MobileNavItem to="/settings" icon={<Settings size={24} />} label="Ayarlar" active={location.pathname === '/settings'} />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, active }: { to: string; icon: ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
        active ? 'bg-ios-blue/10 text-ios-blue font-semibold' : 'text-slate-500 hover:bg-gray-100'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavItem({ to, icon, label, active }: { to: string; icon: ReactNode; label: string; active: boolean }) {
  return (
    <Link to={to} className={cn('flex flex-col items-center gap-1', active ? 'text-ios-blue' : 'text-gray-400')}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
