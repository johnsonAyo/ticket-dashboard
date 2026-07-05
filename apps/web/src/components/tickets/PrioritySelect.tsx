import { TICKET_PRIORITIES, type TicketPriority } from '@ticket/shared';
import { PRIORITY_LABELS } from '../../lib/labels';

type PrioritySelectProps = {
  value: TicketPriority;
  onChange: (priority: TicketPriority) => void;
  label: string;
  disabled?: boolean;
  id?: string;
};

/** Accessible, keyboard-operable priority control shared across list and detail. */
export function PrioritySelect({ value, onChange, label, disabled, id }: PrioritySelectProps) {
  return (
    <select
      id={id}
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as TicketPriority)}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {TICKET_PRIORITIES.map((priority) => (
        <option key={priority} value={priority}>
          {PRIORITY_LABELS[priority]}
        </option>
      ))}
    </select>
  );
}
