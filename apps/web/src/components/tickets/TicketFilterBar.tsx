import { useEffect, useState } from 'react';
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketFilters,
  type TicketPriority,
  type TicketStatus,
} from '@ticket/shared';
import { ALL_FILTER_LABEL, PRIORITY_LABELS, STATUS_LABELS } from '../../lib/labels';

type TicketFilterBarProps = {
  filters: TicketFilters;
  onChange: (filters: TicketFilters) => void;
};

const ALL_VALUE = 'all';
const SELECT_CLASSES =
  'rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500';
const INPUT_CLASSES =
  'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 w-full';

export function TicketFilterBar({ filters, onChange }: TicketFilterBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search ?? '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, search: searchValue || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <div className="grid w-full grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-600">Search</span>
        <input
          type="search"
          placeholder="Title or customer..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={INPUT_CLASSES}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-600">Status</span>
        <select
          aria-label="Filter by status"
          value={filters.status ?? ALL_VALUE}
          onChange={(event) => onChange({ ...filters, status: parseStatus(event.target.value) })}
          className={SELECT_CLASSES}
        >
          <option value={ALL_VALUE}>{ALL_FILTER_LABEL}</option>
          {TICKET_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-600">Priority</span>
        <select
          aria-label="Filter by priority"
          value={filters.priority ?? ALL_VALUE}
          onChange={(event) =>
            onChange({ ...filters, priority: parsePriority(event.target.value) })
          }
          className={SELECT_CLASSES}
        >
          <option value={ALL_VALUE}>{ALL_FILTER_LABEL}</option>
          {TICKET_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function parseStatus(value: string): TicketStatus | undefined {
  return value === ALL_VALUE ? undefined : (value as TicketStatus);
}

function parsePriority(value: string): TicketPriority | undefined {
  return value === ALL_VALUE ? undefined : (value as TicketPriority);
}
