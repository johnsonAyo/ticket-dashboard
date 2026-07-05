import type { TicketPriority, TicketStatus } from '@ticket/shared';

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUS_BADGE_CLASSES: Record<TicketStatus, string> = {
  open: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  in_progress: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

export const PRIORITY_BADGE_CLASSES: Record<TicketPriority, string> = {
  low: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  medium: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  high: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

export const ALL_FILTER_LABEL = 'All';
