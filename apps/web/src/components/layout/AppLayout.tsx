import { NavLink, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ROUTES } from '../../lib/constants';

const NAV_LINK_BASE = 'rounded-md px-3 py-2 text-sm font-medium transition-colors';

function navLinkClasses({ isActive }: { isActive: boolean }): string {
  const state = isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100';
  return `${NAV_LINK_BASE} ${state}`;
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <NavLink to={ROUTES.tickets} className="text-base font-semibold text-slate-900">
            Support Tickets
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink to={ROUTES.tickets} end className={navLinkClasses}>
              List
            </NavLink>
            <NavLink to={ROUTES.board} className={navLinkClasses}>
              Board
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
