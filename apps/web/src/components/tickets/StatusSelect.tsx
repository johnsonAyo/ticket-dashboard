import { TICKET_STATUSES, type TicketStatus } from '@ticket/shared';
import { STATUS_LABELS } from '../../lib/labels';

type StatusSelectProps = {
  value: TicketStatus;
  onChange: (status: TicketStatus) => void;
  label: string;
  disabled?: boolean;
  id?: string;
};

export function StatusSelect({ value, onChange, label, disabled, id }: StatusSelectProps) {
  return (
    <select
      id={id}
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as TicketStatus)}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {TICKET_STATUSES.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
