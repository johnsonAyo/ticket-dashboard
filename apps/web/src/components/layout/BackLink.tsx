import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type BackLinkProps = {
  to: string;
  children: string;
};

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Link>
  );
}
