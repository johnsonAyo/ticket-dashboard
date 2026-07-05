import type { TicketPriority } from '@ticket/shared';
import { PRIORITY_BADGE_CLASSES, PRIORITY_LABELS } from '../../lib/labels';

type PriorityBadgeProps = {
  priority: TicketPriority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${PRIORITY_BADGE_CLASSES[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
