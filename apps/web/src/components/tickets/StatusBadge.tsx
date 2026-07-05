import type { TicketStatus } from '@ticket/shared';
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from '../../lib/labels';

type StatusBadgeProps = {
  status: TicketStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
