'use client';

import { useState, useMemo, useEffect } from 'react';
import { Ticket, Status, View } from '@/lib/types';
import { mockTickets } from '@/lib/mock-data';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { SummaryCards } from '@/components/summary-cards';
import { TicketTrendChart } from '@/components/ticket-trend-chart';
import { PriorityBreakdown } from '@/components/priority-breakdown';
import { TicketTable } from '@/components/ticket-table';
import { TicketDetailsPanel } from '@/components/ticket-details-panel';
import { NewTicketModal, NewTicketData } from '@/components/new-ticket-modal';
import { CheckCircleIcon } from '@/components/icons';

const pageTitles: Record<View, string> = {
  dashboard: 'Dashboard',
  all: 'All Tickets',
  open: 'Open Tickets',
  'in-progress': 'In Progress',
  closed: 'Closed Tickets',
};

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // Bumped on every open so the modal starts with a blank form and no leftover timers.
  const [newTicketSession, setNewTicketSession] = useState(0);

  const filteredTickets = useMemo(() => {
    let result = tickets;

    // Filter by view
    if (currentView === 'open') {
      result = result.filter((t) => t.status === 'open');
    } else if (currentView === 'in-progress') {
      result = result.filter((t) => t.status === 'in-progress');
    } else if (currentView === 'closed') {
      result = result.filter((t) => t.status === 'closed' || t.status === 'resolved');
    }
    // 'all' and 'dashboard' show all tickets

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(query) ||
          t.customerName.toLowerCase().includes(query) ||
          t.customerEmail.toLowerCase().includes(query) ||
          t.subject.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tickets, currentView, searchQuery]);

  // Escape closes the topmost layer: the modal first, then the side panel or mobile navigation.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isNewTicketOpen) {
        setIsNewTicketOpen(false);
        return;
      }
      setSelectedTicket(null);
      setIsNavOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewTicketOpen]);

  const handleNewTicket = (data: NewTicketData) => {
    const newTicket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      customerId: `cust-${tickets.length + 1}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      subject: data.subject,
      message: data.message,
      category: data.category,
      priority: data.priority,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTickets([newTicket, ...tickets]);
    setSuccessMessage('Ticket created successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStatusChange = (ticketId: string, newStatus: Status) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date() } : t
      )
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus, updatedAt: new Date() });
    }
  };

  // Typing in search from the dashboard jumps to the full list, where results are shown.
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && currentView === 'dashboard') {
      setCurrentView('all');
    }
  };

  const isDashboard = currentView === 'dashboard';
  // While a dialog or panel is open, the page behind it is inert: no focus, no clicks, hidden from screen readers.
  const overlayOpen = selectedTicket !== null || isNewTicketOpen;
  const count = filteredTickets.length;
  const recentTickets = [...tickets]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-page text-ink">
      <div inert={overlayOpen} className="flex min-h-screen">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          tickets={tickets}
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
        />

        {/* Dims the page behind the mobile navigation drawer */}
        {isNavOpen && (
          <div
            aria-hidden="true"
            onClick={() => setIsNavOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            breadcrumb={isDashboard ? ['Overview'] : ['Tickets', pageTitles[currentView]]}
            title={pageTitles[currentView]}
            subtitle={isDashboard ? undefined : `${count} ${count === 1 ? 'ticket' : 'tickets'}`}
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            onNewTicket={() => {
              setNewTicketSession((n) => n + 1);
              setIsNewTicketOpen(true);
            }}
            onMenuClick={() => setIsNavOpen(true)}
          />

          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
            {/* Live region so screen readers hear the confirmation after a ticket is created */}
            <div role="status" aria-live="polite">
              {successMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex max-w-xs items-center gap-2.5 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink shadow-lg">
                  <CheckCircleIcon className="size-5 shrink-0 text-emerald-600" />
                  {successMessage}
                </div>
              )}
            </div>

            {isDashboard ? (
              <div className="space-y-6">
                <SummaryCards tickets={tickets} onSelectView={setCurrentView} />

                {/* minmax(0,1fr) lets the single column shrink below the chart's fixed SVG width on phones */}
                <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-3">
                  <TicketTrendChart tickets={tickets} className="xl:col-span-2" />
                  <PriorityBreakdown tickets={tickets} />
                </div>

                <section aria-labelledby="recent-heading">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 id="recent-heading" className="text-base font-semibold text-ink">
                      Recent tickets
                    </h2>
                    <button
                      type="button"
                      onClick={() => setCurrentView('all')}
                      className="rounded-md text-sm font-medium text-primary-strong hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <TicketTable tickets={recentTickets} onSelectTicket={setSelectedTicket} />
                </section>
              </div>
            ) : (
              <TicketTable
                tickets={filteredTickets}
                onSelectTicket={setSelectedTicket}
                isSearching={searchQuery.trim() !== ''}
                onClearSearch={() => setSearchQuery('')}
              />
            )}
          </main>
        </div>
      </div>

      {/* Details Panel */}
      {selectedTicket && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setSelectedTicket(null)}
            className="fixed inset-0 z-30 bg-slate-900/20"
          />
          <TicketDetailsPanel
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onStatusChange={handleStatusChange}
          />
        </>
      )}

      {/* New Ticket Modal */}
      <NewTicketModal
        key={newTicketSession}
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSubmit={handleNewTicket}
      />
    </div>
  );
}
