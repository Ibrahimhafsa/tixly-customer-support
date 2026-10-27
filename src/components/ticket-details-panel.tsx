'use client';

import { KeyboardEvent, useEffect, useRef } from 'react';
import { Status, Ticket } from '@/lib/types';
import { CloseIcon } from './icons';
import { PriorityBadge, StatusBadge } from './status-badge';

interface TicketDetailsPanelProps {
  ticket: Ticket | null;
  onClose: () => void;
  onStatusChange: (ticketId: string, newStatus: Status) => void;
}

const statuses: Status[] = ['open', 'in-progress', 'closed', 'resolved'];
const statusLabels: Record<Status, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  closed: 'Closed',
  resolved: 'Resolved',
};

const sectionLabel = 'mb-2 block text-xs font-semibold uppercase tracking-wide text-muted';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function TicketDetailsPanel({ ticket, onClose, onStatusChange }: TicketDetailsPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Hooks stay above the early return. On open, focus moves to the close button.
  // On unmount, focus goes back to whatever was focused before the panel opened.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => trigger?.focus();
  }, []);

  // Keeps Tab and Shift+Tab inside the dialog while it is open.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab' || !panelRef.current) return;

    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!ticket) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-details-title"
      onKeyDown={handleKeyDown}
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-line bg-surface shadow-xl"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-4">
        <div>
          <p className="text-xs font-medium text-muted">Ticket</p>
          <h2 id="ticket-details-title" className="text-base font-semibold tabular-nums text-primary-strong">
            {ticket.id}
          </h2>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close ticket details"
          className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-ink"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-6">
        <div>
          <h3 className="text-lg font-semibold leading-snug text-ink">{ticket.subject}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ticket-status" className={sectionLabel}>
              Status
            </label>
            <select
              id="ticket-status"
              value={ticket.status}
              onChange={(e) => onStatusChange(ticket.id, e.target.value as Status)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition-colors hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
            <div className="mt-2">
              <StatusBadge status={ticket.status} />
            </div>
          </div>
          <div>
            <p className={sectionLabel}>Priority</p>
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        <div>
          <p className={sectionLabel}>Customer</p>
          <div className="rounded-lg border border-line bg-page p-3">
            <p className="break-words font-medium text-ink">{ticket.customerName}</p>
            <p className="break-all text-sm text-muted">{ticket.customerEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={sectionLabel}>Category</p>
            <p className="text-sm capitalize text-ink">{ticket.category}</p>
          </div>
          <div>
            <p className={sectionLabel}>Assigned To</p>
            <p className="text-sm text-ink">{ticket.assignedTo || 'Unassigned'}</p>
          </div>
        </div>

        <div>
          <p className={sectionLabel}>Message</p>
          <div className="whitespace-pre-line break-words rounded-lg border border-line bg-page p-4 text-sm leading-relaxed text-ink">
            {ticket.message}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-line pt-5">
          <div>
            <p className={sectionLabel}>Created</p>
            <p className="text-sm tabular-nums text-ink">{formatDate(ticket.createdAt)}</p>
          </div>
          <div>
            <p className={sectionLabel}>Updated</p>
            <p className="text-sm tabular-nums text-ink">{formatDate(ticket.updatedAt)}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
