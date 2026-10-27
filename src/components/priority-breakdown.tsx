'use client';

import { countByPriority, PRIORITY_ORDER } from '@/lib/analytics';
import { Priority, Ticket } from '@/lib/types';
import { PriorityBadge } from './status-badge';

interface PriorityBreakdownProps {
  tickets: Ticket[];
  className?: string;
}

// Bar colours follow the priority badges. The count and percentage are printed too.
const barClasses: Record<Priority, string> = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-slate-400',
};

export function PriorityBreakdown({ tickets, className = '' }: PriorityBreakdownProps) {
  const counts = countByPriority(tickets);
  const total = tickets.length;

  return (
    <section
      aria-labelledby="priority-heading"
      className={`rounded-xl border border-line bg-surface p-5 ${className}`}
    >
      <h2 id="priority-heading" className="text-base font-semibold text-ink">
        Priority breakdown
      </h2>
      <p className="mt-1 text-sm text-muted">Share of all tickets by priority</p>

      <ul className="mt-5 space-y-4">
        {PRIORITY_ORDER.map((priority) => {
          const count = counts[priority];
          const percent = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <li key={priority}>
              <div className="flex items-center justify-between gap-3">
                <PriorityBadge priority={priority} />
                <span className="text-sm tabular-nums text-ink">
                  <span className="font-semibold">{count}</span>
                  <span className="text-muted"> ({percent}%)</span>
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-page" aria-hidden="true">
                <div className={`h-full rounded-full ${barClasses[priority]}`} style={{ width: `${percent}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
