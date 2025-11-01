# ThaFamilyBeats Studio - Replit Documentation

## Overview

ThaFamilyBeats is a professional recording studio booking and services platform. The application provides a comprehensive solution for artists to book studio sessions, purchase mixing/mastering services, and license beats. It features a premium, chrome-inspired dark mode aesthetic with seamless payment processing and admin transaction management.

**Core Functionality:**
- Studio session booking with flexible hourly packages
- Professional mixing and mastering service packages
- Beat licensing marketplace with search capabilities
- Payment processing via multiple methods (Card, PayPal, CashApp, Zelle, Crypto)
- Admin dashboard for transaction monitoring
- Mobile-responsive design with premium UI components

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- React Query (TanStack Query) for server state management

**UI Component System:**
- Shadcn UI library (New York variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design system
- Custom CSS variables for theme consistency
- Component composition pattern with variants using class-variance-authority

**Design System:**
- Dark-first design approach with high-contrast chrome aesthetic
- Transparent TFB logo used as favicon and main branding (TransparentTFB_1761962201894.png)
- Future enhancement: Studio background banner behind logo on home page
- Custom color palette defined via HSL CSS variables (background: 0 0% 8%, foreground: 0 0% 98%)
- Typography: Display font (Rajdhani), body font (Inter), monospace (JetBrains Mono)
- Hover states using elevation overlays (--elevate-1, --elevate-2)
- Consistent border radius (lg: 9px, md: 6px, sm: 3px)

**Branding:**
- Lead Engineer: 8:11 (30+ years experience)
- Producer/Engineer/Artist: Angelo Knight
- CashApp: $811onthebeat
- Contact: tfb@thafamilybeats.com, +1 (213) 418-4295

**State Management:**
- React Query for async data fetching and caching
- Local component state with React hooks
- Session-based authentication state
- Form state management with React Hook Form and Zod validation

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ES modules (type: "module")
- Session-based authentication using express-session
- RESTful API design pattern

**Authentication & Security:**
- Admin authentication via password-protected endpoints
- Rate limiting on login attempts (5 attempts, 15-minute lockout)
- Session management with secure cookies in production
- IP-based tracking for failed login attempts

**API Structure:**
- `/api/admin/login` - Admin authentication
- `/api/admin/check` - Session verification
- `/api/admin/logout` - Session termination
- `/api/transactions` - Transaction CRUD operations
- Middleware for request logging and response tracking

**Development Features:**
- Vite middleware integration for HMR in development
- Custom logging with timestamps
- Error handling with process exit on critical errors
- Replit-specific plugins (cartographer, dev-banner, runtime-error-modal)

### Data Storage

**Database:**
- PostgreSQL via Neon serverless
- Drizzle ORM for type-safe database queries
- Schema-first approach with migrations

**Schema Design:**
- `users` table: id (UUID), username (unique), password
- `transactions` table: id (UUID), customer details (name, email), service, amount, payment method, status, timestamps
- Enum constraints for status (pending, completed, failed) and payment methods

**Data Access Layer:**
- Repository pattern via DbStorage class
- Interface-based design (IStorage) for potential adapter swapping
- Prepared statements via Drizzle for SQL injection prevention

### External Dependencies

**Payment Processing:**
- Stripe integration (@stripe/stripe-js, @stripe/react-stripe-js)
- Multiple payment method support (card, PayPal, CashApp, Zelle, cryptocurrency)
- Frontend checkout modal with payment method selection

**Database Services:**
- Neon PostgreSQL serverless (@neondatabase/serverless)
- Connection pooling for efficient database access
- Environment-based connection string configuration

**Session Management:**
- connect-pg-simple for PostgreSQL-backed session storage
- Configurable session expiration (24-hour default)
- HTTP-only cookies with secure flag in production

**UI Libraries:**
- 25+ Radix UI components for accessible primitives
- react-day-picker for calendar/date selection
- cmdk for command palette functionality
- date-fns for date manipulation
- lucide-react and react-icons for iconography

**Development Tools:**
- tsx for TypeScript execution in development
- esbuild for production server bundling
- drizzle-kit for schema migrations
- Replit-specific development enhancements

**Environment Requirements:**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `ADMIN_PASSWORD` - Admin authentication password (required)
- `SESSION_SECRET` - Session encryption key (optional, defaults provided)
- `NODE_ENV` - Environment flag (development/production)