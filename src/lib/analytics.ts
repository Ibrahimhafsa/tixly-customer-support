import { Priority, Ticket } from './types';

/** Highest priority first, the order the breakdown is shown in. */
export const PRIORITY_ORDER: Priority[] = ['urgent', 'high', 'medium', 'low'];

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

/**
 * Counts tickets created on each of the last `days` calendar days, oldest first.
 * The final bucket is today.
 *
 * Day boundaries use setDate rather than adding 24 hours, so daylight saving
 * changes cannot shift a ticket into the wrong bucket.
 */
export function countCreatedPerDay(tickets: Ticket[], days: number, now: Date) {
  const today = startOfDay(now);
  const first = new Date(today);
  first.setDate(today.getDate() - (days - 1));

  const buckets = Array.from({ length: days }, (_, index) => {
    const date = new Date(first);
    date.setDate(first.getDate() + index);
    return { date, count: 0 };
  });

  for (const ticket of tickets) {
    const offset = Math.round((startOfDay(ticket.createdAt).getTime() - first.getTime()) / DAY_MS);
    if (offset >= 0 && offset < days) {
      buckets[offset].count += 1;
    }
  }

  return buckets;
}

/** Number of tickets at each priority level. */
export function countByPriority(tickets: Ticket[]): Record<Priority, number> {
  const counts: Record<Priority, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
  for (const ticket of tickets) {
    counts[ticket.priority] += 1;
  }
  return counts;
}
