'use client';

import { useSyncExternalStore } from 'react';
import { countCreatedPerDay } from '@/lib/analytics';
import { Ticket } from '@/lib/types';

interface TicketTrendChartProps {
  tickets: Ticket[];
  days?: number;
  className?: string;
}

// The SVG uses a fixed coordinate system, so the chart scales as a whole.
const WIDTH = 640;
const HEIGHT = 240;
// The right padding leaves room for the last date label, which is centred on the final point.
const PADDING = { top: 16, right: 28, bottom: 32, left: 40 };

// The day never changes while the page is open, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

/**
 * Line chart of tickets created per day, drawn as plain SVG so the
 * dashboard needs no charting dependency.
 */
export function TicketTrendChart({ tickets, days = 15, className = '' }: TicketTrendChartProps) {
  // The "last N days" window depends on the current time, which the server cannot know.
  // The server snapshot is null, so the static prerender renders a placeholder and the
  // client fills the chart in after hydration. The snapshot is the start of today, a
  // stable number, so the value does not change on every render.
  const todayStart = useSyncExternalStore(
    subscribeToNothing,
    () => new Date().setHours(0, 0, 0, 0),
    () => null
  );

  if (todayStart === null) {
    return (
      <section aria-labelledby="trend-heading" className={`rounded-xl border border-line bg-surface p-5 ${className}`}>
        <h2 id="trend-heading" className="text-base font-semibold text-ink">
          Ticket trend
        </h2>
        <div className="mt-4 h-60 animate-pulse rounded-lg bg-page" aria-hidden="true" />
      </section>
    );
  }

  const buckets = countCreatedPerDay(tickets, days, new Date(todayStart));
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;

  // Round the y-axis up to a multiple of 4 so the four gridlines land on whole numbers.
  const highest = Math.max(...buckets.map((bucket) => bucket.count));
  const yMax = Math.max(4, Math.ceil(highest / 4) * 4);
  const yTicks = [0, 1, 2, 3, 4].map((step) => (yMax / 4) * step);

  const points = buckets.map((bucket, index) => ({
    x: PADDING.left + (index / (days - 1)) * plotWidth,
    y: PADDING.top + plotHeight * (1 - bucket.count / yMax),
    bucket,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const baseline = PADDING.top + plotHeight;
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${baseline} L${points[0].x.toFixed(1)},${baseline} Z`;

  const formatDay = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <section
      aria-labelledby="trend-heading"
      className={`rounded-xl border border-line bg-surface p-5 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="trend-heading" className="text-base font-semibold text-ink">
            Ticket trend
          </h2>
          <p className="mt-1 text-sm text-muted">Tickets created per day, last {days} days</p>
        </div>
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink tabular-nums">{total}</span> created
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`Line chart of tickets created per day over the last ${days} days. ${total} tickets in total.`}
          className="h-auto min-w-[520px] w-full"
        >
          {yTicks.map((tick) => {
            const y = PADDING.top + plotHeight * (1 - tick / yMax);
            return (
              <g key={tick}>
                <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                <text x={PADDING.left - 8} y={y + 4} textAnchor="end" fontSize="12" fill="#64748b">
                  {tick}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="#10b981" fillOpacity="0.08" />
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {points.map((p, index) => (
            <g key={index}>
              <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2">
                <title>{`${formatDay(p.bucket.date)}: ${p.bucket.count} ticket${p.bucket.count === 1 ? '' : 's'}`}</title>
              </circle>
              {/* Label every third day, always including today. */}
              {index % 3 === (days - 1) % 3 && (
                <text x={p.x} y={HEIGHT - 8} textAnchor="middle" fontSize="12" fill="#64748b">
                  {formatDay(p.bucket.date)}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
