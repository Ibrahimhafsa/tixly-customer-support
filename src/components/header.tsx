'use client';

import { MenuIcon, PlusIcon, SearchIcon } from './icons';

interface HeaderProps {
  breadcrumb: string[];
  title: string;
  subtitle?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onNewTicket: () => void;
  onMenuClick: () => void;
}

export function Header({
  breadcrumb,
  title,
  subtitle,
  searchValue,
  onSearchChange,
  onNewTicket,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 sm:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-controls="app-sidebar"
          className="flex size-10 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:bg-page hover:text-ink lg:hidden"
        >
          <MenuIcon className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-muted">
              {breadcrumb.map((crumb, index) => (
                <li key={`${crumb}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  <span>{crumb}</span>
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="truncate text-xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>

        <div className="order-last flex w-full items-center gap-3 sm:order-none sm:w-auto">
          <label className="relative block w-full sm:w-72 lg:w-80">
            <span className="sr-only">Search tickets</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by ID, customer, or subject"
              className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-muted/80 transition-colors hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={onNewTicket}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary-strong px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-strong/90"
        >
          <PlusIcon className="size-4" />
          New Ticket
        </button>
      </div>
    </header>
  );
}
