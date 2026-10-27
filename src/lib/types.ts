export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'open' | 'in-progress' | 'closed' | 'resolved';
export type Category = 'billing' | 'technical' | 'shipping' | 'returns' | 'general';

/** The screens the sidebar can navigate to. */
export type View = 'dashboard' | 'all' | 'open' | 'in-progress' | 'closed';

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  category: Category;
  priority: Priority;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
}
