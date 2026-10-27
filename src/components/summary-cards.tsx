'use client';

import { ReactNode } from 'react';
import { Ticket, View } from '@/lib/types';
import { CheckCircleIcon, ListIcon } from './icons';
import { StatusGlyph } from './status-badge';

interface SummaryCardsProps {
  tickets: Ticket[];
  onSelectView: (view: View) => void;
}

interface Card {
  view: View;
  label: string;
  count: number;
  icon: ReactNode;
  iconClass: string;
  barClass: string;
}

export function SummaryCards({ tickets, onSelectView }: SummaryCardsProps) {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === 'open').length;
  const inProgress = tickets.filter((t) => t.status === 'in-progress').length;
  const closed = tickets.filter((t) => t.status === 'closed' || t.status === 'resolved').length;

  // Icon colours match the status badges so each card reads the same as its tickets.
  const cards: Card[] = [
    {
      view: 'all',
      label: 'Total Tickets',
      count: total,
      icon: <ListIcon className="size-4" />,
      iconClass: 'bg-primary-soft text-primary-strong',
      barClass: 'bg-primary',
    },
    {
      view: 'open',
      label: 'Open Tickets',
      count: open,
      icon: <StatusGlyph status="open" className="size-4" />,
      iconClass: 'bg-blue-50 text-blue-700',
      barClass: 'bg-blue-500',
    },
    {
      view: 'in-progress',
      label: 'In Progress',
      count: inProgress,
      icon: <StatusGlyph status="in-progress" className="size-4" />,
      iconClass: 'bg-amber-50 text-amber-700',
      barClass: 'bg-amber-500',
    },
    {
      view: 'closed',
      label: 'Closed Tickets',
      count: closed,
      icon: <CheckCircleIcon className="size-4" />,
      iconClass: 'bg-emerald-50 text-emerald-700',
      barClass: 'bg-success',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const share = total === 0 ? 0 : Math.round((card.count / total) * 100);
        return (
          <button
            key={card.view}
            type="button"
            onClick={() => onSelectView(card.view)}
            className="group rounded-xl border border-line bg-surface p-5 text-left transition-colors hover:border-primary/40 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">{card.label}</p>
              <span className={`flex size-8 items-center justify-center rounded-lg ${card.iconClass}`}>
                {card.icon}
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-ink">{card.count}</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{share}% of total</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  View
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-page" aria-hidden="true">
                <div className={`h-full rounded-full ${card.barClass}`} style={{ width: `${share}%` }} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
