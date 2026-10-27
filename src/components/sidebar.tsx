'use client';

import { ReactNode } from 'react';
import { Ticket, View } from '@/lib/types';
import {
  CheckCircleIcon,
  DashboardIcon,
  ListIcon,
  SlidersIcon,
  TicketIcon,
  UsersIcon,
} from './icons';
import { StatusGlyph } from './status-badge';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  tickets: Ticket[];
  /** Controls the off-canvas drawer on small screens. Always visible from `lg` up. */
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: View;
  label: string;
  icon: ReactNode;
  count?: number;
}

export function Sidebar({ currentView, onViewChange, tickets, isOpen, onClose }: SidebarProps) {
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in-progress').length;
  const closedCount = tickets.filter((t) => t.status === 'closed' || t.status === 'resolved').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="size-4" /> },
    { id: 'all', label: 'All Tickets', icon: <ListIcon className="size-4" />, count: tickets.length },
    { id: 'open', label: 'Open Tickets', icon: <StatusGlyph status="open" className="size-4" />, count: openCount },
    {
      id: 'in-progress',
      label: 'In Progress',
      icon: <StatusGlyph status="in-progress" className="size-4" />,
      count: inProgressCount,
    },
    {
      id: 'closed',
      label: 'Closed Tickets',
      icon: <CheckCircleIcon className="size-4" />,
      count: closedCount,
    },
  ];

  // These screens are not built yet, so they are shown disabled rather than as dead links.
  const comingSoon = [
    { label: 'Customers', icon: <UsersIcon className="size-4" /> },
    { label: 'Settings', icon: <SlidersIcon className="size-4" /> },
  ];

  const handleNavigate = (view: View) => {
    onViewChange(view);
    onClose();
  };

  return (
    <aside
      id="app-sidebar"
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-line px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary-strong text-white">
          <TicketIcon className="size-4" />
        </div>
        <div className="leading-tight">
          <p className="text-base font-semibold text-ink">Tixly</p>
          <p className="text-[11px] text-muted">Smart Customer Support Platform</p>
        </div>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Workspace</p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-soft text-primary-strong'
                      : 'text-muted hover:bg-page hover:text-ink'
                  }`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`min-w-6 rounded-md px-1.5 text-center text-xs font-semibold tabular-nums ${
                        isActive ? 'bg-surface text-primary-strong' : 'bg-page text-muted'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Manage</p>
        <ul className="space-y-0.5">
          {comingSoon.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted/70"
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                <span className="text-[11px] font-normal">Soon</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-strong">
            SA
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-ink">Support Agent</p>
            <p className="truncate text-xs text-muted">Demo workspace</p>
          </div>
        </div>
        <p className="mt-2 px-2 text-[11px] text-muted">Mock data. Changes reset on page reload.</p>
      </div>
    </aside>
  );
}
