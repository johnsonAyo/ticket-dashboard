import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/constants';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white p-10 text-center">
      <h1 className="text-lg font-semibold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-500">The page you are looking for does not exist.</p>
      <Link
        to={ROUTES.tickets}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Back to tickets
      </Link>
    </div>
  );
}
