# Tixly - AI Customer Support & Ticket Management System

A professional, modern customer support ticket management system built with Next.js, React, TypeScript, and Tailwind CSS.

## Business Problem

Small e-commerce businesses receive customer complaints through emails and website forms but struggle to:
- Organize complaints in a centralized location
- Track ticket statuses (open, in progress, closed)
- Identify urgent issues quickly
- See which issues remain unresolved

**Tixly** provides an organized, trackable support workflow with a polished, professional interface.

## Features

### Current Implementation (Frontend MVP)

✅ **Dashboard Overview**
- Summary cards showing total, open, in-progress, and closed tickets
- Recent tickets display
- Real-time stats that update as tickets change

✅ **Ticket Management**
- View all tickets, open tickets, in-progress, or closed tickets
- Click any ticket to open a detailed side panel
- Change ticket status with dropdown selector
- View ticket creation and update dates

✅ **Search & Filtering**
- Search tickets by ID, customer name, email, or subject
- Filter by view in the sidebar (open, in progress, closed)
- Dynamic ticket count display
- Empty states when no matches found

✅ **Create New Tickets**
- Modal form with validation
- Required fields: customer name, email, subject, message
- Category and priority selection
- Email format validation
- Success confirmation with visual feedback

✅ **Responsive Design**
- Works on desktop, tablet, and mobile
- Sidebar navigation collapses appropriately
- Touch-friendly interface
- Light theme only (white surfaces with a teal accent)

✅ **Professional UI/UX**
- Clean, sophisticated design inspired by modern SaaS applications
- Consistent spacing, typography, and color scheme
- Status and priority badges with semantic colors
- Subtle borders and hover states
- Professional badge styling (open, in-progress, closed, resolved)
- Accessible contrast ratios and keyboard navigation

### Mock Data

The application uses **in-memory mock data** that includes 10 sample tickets with realistic customer information. Data persists during the session but resets on page reload.

**Important:** A data reset note is displayed in the sidebar footer reminding users that changes do not persist.

## Tech Stack

- **Framework:** Next.js 16.4.2 with App Router
- **Language:** TypeScript 5
- **UI Library:** React 19.3.0
- **Styling:** Tailwind CSS 4 with Turbopack
- **Build Tool:** Next.js with Turbopack (fast builds)
- **Linting:** ESLint 9
- **Node Version:** Compatible with Node 20+

## Architecture Overview

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application logic and state management
│   ├── globals.css         # Global styles and Tailwind setup
│   └── favicon.ico
├── components/
│   ├── sidebar.tsx         # Navigation sidebar
│   ├── header.tsx          # Top header with search and actions
│   ├── ticket-table.tsx    # Ticket listing table
│   ├── ticket-details-panel.tsx  # Side panel for ticket details
│   ├── new-ticket-modal.tsx      # Create ticket form modal
│   ├── summary-cards.tsx   # Dashboard stat cards
│   ├── ticket-trend-chart.tsx    # Dashboard tickets-per-day chart (SVG)
│   ├── priority-breakdown.tsx    # Dashboard priority distribution
│   ├── status-badge.tsx    # Reusable badge components
│   ├── empty-state.tsx     # Empty state UI
│   └── icons.tsx           # Inline SVG icons
└── lib/
    ├── types.ts            # TypeScript type definitions
    ├── analytics.ts        # Daily-count and priority-count helpers for the dashboard
    └── mock-data.ts        # Sample ticket data
```

### Key Components

#### `page.tsx` (Main Application Logic)
- Central state management with React hooks
- Handles ticket filtering and search
- Manages modal visibility and selections
- Implements status updates and ticket creation
- Updates summary cards in real-time

#### `components/sidebar.tsx`
- Navigation between views (Dashboard, All, Open, In Progress, Closed)
- Live badge counts for ticket statuses
- Data reset notice for users

#### `components/header.tsx`
- Dynamic page title and subtitle
- Search input (appears on ticket views)
- "New Ticket" button
- Breadcrumb, page title, and ticket count subtitle
- Search input and "New Ticket" button

#### `components/ticket-table.tsx`
- Responsive table that scrolls horizontally on narrow screens (columns are not sortable)
- Customer name and email display
- Category, priority, and status badges
- Clickable rows to open ticket details

#### `components/ticket-details-panel.tsx`
- Slide-in panel showing full ticket information
- Status dropdown selector for status changes
- All customer details and ticket message
- Created/updated timestamps

#### `components/new-ticket-modal.tsx`
- Modal form with validation
- Required field checking
- Email format validation
- Success confirmation message

### Type Definitions (`lib/types.ts`)

```typescript
type Status = 'open' | 'in-progress' | 'closed' | 'resolved'
type Priority = 'low' | 'medium' | 'high' | 'urgent'
type Category = 'billing' | 'technical' | 'shipping' | 'returns' | 'general'

interface Ticket {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  subject: string
  message: string
  category: Category
  priority: Priority
  status: Status
  createdAt: Date
  updatedAt: Date
  assignedTo?: string
}
```

## Installation & Setup

### Prerequisites
- Node.js 20+ and npm

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The application opens at `http://localhost:3000` (or next available port if 3000 is in use).

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Manual Testing Instructions

### 1. Dashboard View
- Navigate to the Dashboard from the sidebar
- Verify summary cards show:
  - Total: 10 tickets
  - Open: 4 tickets
  - In Progress: 4 tickets
  - Closed: 2 tickets (closed + resolved)
- Confirm recent tickets are displayed (first 5)

### 2. View All Tickets
- Click "All Tickets" in sidebar
- Verify all 10 tickets appear in table
- Verify table shows: ID, Customer, Subject, Category, Priority, Status, Created date

### 3. Ticket Details
- Click any ticket row
- Verify side panel opens on the right
- Check all details are correct:
  - Subject, customer info, message
  - Status dropdown, priority badge
  - Assigned to, created/updated dates
- Verify panel closes when clicking close button or outside

### 4. Status Updates
- Open a ticket detail panel
- Change the status using the dropdown (e.g., open → in-progress)
- Verify:
  - Panel updates immediately
  - Table row updates immediately
  - Summary cards update (counters change)
  - Sidebar badge counts update

### 5. Search Functionality
- Click "All Tickets", "Open Tickets", etc. (any filtered view)
- Use search box to search by:
  - Ticket ID (e.g., "TKT-001")
  - Customer name (e.g., "Sarah")
  - Email (e.g., "@example.com")
  - Subject keywords (e.g., "refund")
- Verify:
  - Results filter in real-time
  - Ticket count updates
  - Empty state appears when no results match

### 6. Status Filters
- Click "Open Tickets" sidebar item
- Verify only open tickets (status = "open") appear
- Click "In Progress"
- Verify only in-progress tickets appear
- Click "Closed Tickets"
- Verify closed and resolved tickets appear

### 7. Create New Ticket
- Click "+ New Ticket" button
- Verify modal opens
- Try submitting without fields:
  - Verify validation errors appear
- Fill in form correctly:
  - Name: "Test Customer"
  - Email: "test@example.com"
  - Subject: "Test ticket"
  - Message: "This is a test"
  - Category: Select one
  - Priority: Select one
- Verify:
  - Success message appears
  - Modal closes
  - New ticket appears at top of "All Tickets" list
  - Summary cards update
  - Dashboard updates

### 8. Empty States
- Use search to filter to no results
- Verify empty state appears with message
- Clear search
- Verify tickets reappear

### 9. Theme
- The app uses a light theme only; dark mode is not implemented
- Verify the details panel and New Ticket modal have solid white backgrounds
- Verify text remains readable and badges maintain contrast

### 10. Responsive Layout
- Resize browser to mobile width (< 640px)
- Verify sidebar remains functional
- Verify table scrolls horizontally on narrow screens
- Verify modals and panels still work

## Current Limitations & Future Work

### Known Limitations
- ✋ **Data is not persistent** – refreshing the page resets to initial mock data
- ✋ **No database backend** – using in-memory state only
- ✋ **No authentication** – anyone can access the application
- ✋ **No assignment/reassignment** – assigned-to field is display-only
- ✋ **Client-side IDs** – new tickets get `TKT-NNN` from the current array length, which is not safe once IDs come from a shared database
- ✋ **Customers and Settings** – shown in the sidebar as "Soon"; no screens yet

### Planned Next Milestones

1. **Database Integration (Supabase PostgreSQL)**
   - Replace mock data with real database
   - Implement data persistence
   - Set up migrations

2. **Authentication & Authorization**
   - User login and registration
   - Role-based access control (admin, support agent, viewer)
   - Secure database queries

3. **AI-Assisted Features**
   - Automatic category/priority suggestion using Claude API
   - FAQ-grounded reply drafts with human review
   - Sentiment analysis for urgent tickets

4. **Testing & Quality**
   - Unit and integration tests with Jest/Vitest
   - E2E tests with Playwright
   - Automated evaluation pipeline

5. **Deployment**
   - Deploy to Vercel or similar platform
   - CI/CD pipeline setup
   - Performance monitoring

## Important Files & Responsibilities

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Central state management and application logic. Manages ticket CRUD, search, filtering, and all user interactions. |
| `src/lib/types.ts` | Type definitions for Ticket, Status, Priority, Category. Used throughout the app for type safety. |
| `src/lib/mock-data.ts` | Sample ticket data. Easy to replace with database queries later. |
| `src/components/header.tsx` | Page header with search, new ticket button, and profile area. |
| `src/components/sidebar.tsx` | Navigation and view switcher. Displays live ticket counts. |
| `src/components/ticket-table.tsx` | Main ticket list display. Handles row selection for details panel. |
| `src/components/ticket-details-panel.tsx` | Slide-in panel for viewing/editing a ticket. Includes status dropdown. |
| `src/components/new-ticket-modal.tsx` | Form for creating new tickets with validation. |
| `src/components/summary-cards.tsx` | Dashboard stat cards that update in real-time. |
| `src/app/globals.css` | Global styles, Tailwind config, and custom scrollbar styling. |

## Design Principles

- **Clean & Professional:** Inspired by modern SaaS dashboards (e.g., Suppi, Front, Zendesk)
- **Consistent:** Unified color palette, spacing, and component styling
- **Responsive:** Works on desktop, tablet, and mobile
- **Accessible:** Proper contrast, keyboard navigation, semantic HTML
- **User-Focused:** Clear feedback, helpful empty states, intuitive workflows
- **Maintainable:** Small, focused components; well-organized directories; type-safe code

## Development Notes

### Styling Approach
- Uses Tailwind CSS 4 with Turbopack for fast development
- Light theme only; colour tokens (`--color-primary`, `--color-surface`, `--color-ink`, etc.) are defined in `globals.css` under `@theme inline`
- Hand-coded components (no external UI libraries) for full control

### State Management
- React hooks (`useState`, `useMemo`)
- No external state management library needed for MVP
- All state lives in `page.tsx`
- Ready to migrate to context API or Zustand when adding authentication

### Performance
- All UI components are client components (`'use client'`); there is no server data fetching yet
- Memoized filtered tickets to avoid unnecessary re-renders
- Next.js image optimization for any future images
- Turbopack for fast builds

### Type Safety
- Full TypeScript strict mode enabled
- All functions have explicit return types
- No `any` types used
- Type-safe event handlers and callbacks

## Testing

To manually test the application:

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000 in your browser
3. Follow the manual testing instructions above
4. Try creating tickets, changing statuses, searching
5. Open browser DevTools to check for console errors
6. Test on mobile via browser dev tools device emulation

The application uses no external testing framework in the MVP. Future work will add Jest/Vitest for unit tests and Playwright for E2E tests.

## Customization

### Adding Categories/Priorities
Edit `src/lib/types.ts` to update the type definitions:
```typescript
type Priority = 'low' | 'medium' | 'high' | 'urgent' | 'critical'
```

Then update `src/components/new-ticket-modal.tsx` to include new options in the select dropdown.

### Changing Colors
Edit the colour tokens in the `@theme inline` block in `src/app/globals.css` (for example `--color-primary` and `--color-surface`).

Edit component className strings to use different Tailwind colors (e.g., change `bg-blue-500` to `bg-purple-500`).

### Adding New Columns to Table
Edit `src/components/ticket-table.tsx` to add new `<th>` and `<td>` elements in the table rows.

### Styling Guidelines
- Use Tailwind utility classes consistently
- Follow the existing colour scheme (teal for primary, red for urgent, emerald for closed)
- Maintain 8px spacing grid for padding/margin
- Keep components under 300 lines for maintainability

## Support & Questions

For questions about the implementation:
1. Check this README
2. Review the component comments
3. Examine `src/lib/types.ts` for type definitions
4. Read `src/app/page.tsx` for the main application logic

## Portfolio Notes

This project demonstrates:
- ✅ Professional frontend design and UX
- ✅ TypeScript and type safety
- ✅ React component architecture
- ✅ State management with hooks
- ✅ Form validation and error handling
- ✅ Responsive design principles
- ✅ Modern CSS with Tailwind
- ✅ Clean code organization
- ✅ Attention to detail (accessibility, empty states)
- ✅ Portfolio-quality UI that impresses recruiters

This codebase can be extended with:
- Backend API integration
- Database persistence
- Authentication
- AI features
- Automated testing
- Deployment CI/CD

---

**Current Status:** Frontend MVP ✅ Complete

**Next Step:** Add Supabase PostgreSQL backend for data persistence
