'use client';

import { Priority, Status } from '@/lib/types';

/*
 * Status and priority are never shown by colour alone. Each one has a text
 * label plus a distinct shape: status uses a glyph, priority uses signal bars.
 */

const statusLabels: Record<Status, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  closed: 'Closed',
  resolved: 'Resolved',
};

const statusStyles: Record<Status, string> = {
  open: 'bg-blue-50 text-blue-800 ring-blue-200',
  'in-progress': 'bg-amber-50 text-amber-800 ring-amber-200',
  resolved: 'bg-violet-50 text-violet-800 ring-violet-200',
  closed: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
};

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const priorityStyles: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-700 ring-slate-200',
  medium: 'bg-yellow-50 text-yellow-800 ring-yellow-200',
  high: 'bg-orange-50 text-orange-800 ring-orange-200',
  urgent: 'bg-red-50 text-red-700 ring-red-200',
};

/** How many of the four signal bars are filled for each priority. */
const priorityLevel: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

const badgeBase =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset';

/**
 * Small glyph that differs for each status:
 * open = empty ring, in progress = half-filled, resolved = ring with tick,
 * closed = filled disc with tick.
 */
export function StatusGlyph({ status, className = 'size-3' }: { status: Status; className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      {status === 'open' && <circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />}
      {status === 'in-progress' && (
        <>
          <circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 1.75a4.25 4.25 0 0 1 0 8.5z" fill="currentColor" />
        </>
      )}
      {status === 'resolved' && (
        <>
          <circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m3.9 6.1 1.4 1.4 2.8-2.9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {status === 'closed' && (
        <>
          <circle cx="6" cy="6" r="6" fill="currentColor" />
          <path d="m3.6 6.1 1.6 1.6 3.2-3.3" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`${badgeBase} ${statusStyles[status]}`}>
      <StatusGlyph status={status} />
      {statusLabels[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const level = priorityLevel[priority];
  const barHeights = ['h-1.5', 'h-2', 'h-2.5', 'h-3'];

  return (
    <span className={`${badgeBase} ${priorityStyles[priority]}`}>
      <span className="flex items-end gap-px" aria-hidden="true">
        {barHeights.map((height, index) => (
          <span
            key={height}
            className={`w-0.5 rounded-sm ${height} ${index < level ? 'bg-current' : 'bg-current opacity-25'}`}
          />
        ))}
      </span>
      {priorityLabels[priority]}
    </span>
  );
}
