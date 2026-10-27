'use client';

import { Ticket } from '@/lib/types';
import { PriorityBadge, StatusBadge } from './status-badge';
import { EmptyState } from './empty-state';
import { InboxIcon } from './icons';

interface TicketTableProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  /** True when a search term is active, so the empty state can offer to clear it. */
  isSearching?: boolean;
  onClearSearch?: () => void;
}

const headings = ['Ticket ID', 'Customer', 'Subject', 'Category', 'Priority', 'Status', 'Created'];

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export function TicketTable({ tickets, onSelectTicket, isSearching = false, onClearSearch }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface">
        {isSearching ? (
          <EmptyState
            title="No matching tickets"
            description="No ticket matches your search or this view's filter. Try a different term."
            icon={<InboxIcon className="size-5" />}
            action={
              onClearSearch && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-page"
                >
                  Clear search
                </button>
              )
            }
          />
        ) : (
          <EmptyState
            title="No tickets in this view"
            description="Tickets you create will appear here as soon as they are added."
            icon={<InboxIcon className="size-5" />}
          />
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-page">
              {headings.map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className="cursor-pointer transition-colors hover:bg-primary-soft/50"
              >
                <td className="whitespace-nowrap px-3 py-3.5 text-sm font-medium tabular-nums text-primary-strong">
                  {ticket.id}
                </td>
                <td className="max-w-[12rem] px-3 py-3.5 text-sm">
                  <p className="truncate font-medium text-ink">{ticket.customerName}</p>
                  <p className="truncate text-xs text-muted">{ticket.customerEmail}</p>
                </td>
                <td className="max-w-[14rem] px-3 py-3.5 text-sm">
                  {/* A real button, so keyboard users can open a ticket without the mouse. */}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectTicket(ticket);
                    }}
                    className="block max-w-full truncate text-left font-medium text-ink hover:text-primary-strong hover:underline"
                  >
                    {ticket.subject}
                  </button>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm capitalize text-muted">{ticket.category}</td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm tabular-nums text-muted">
                  {formatDate(ticket.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
