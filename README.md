# PorterGoldberg MVP V1 - Real Estate Platform

**Mission**: Reduce agent prospecting time from 30+ minutes to <10 minutes by unifying HubSpot contacts and PropStream off-market properties with intelligent alerts.

## 🎯 Success Metrics
- **Agent Adoption**: >70% within 8 weeks
- **Data Accuracy**: >95% for imported records  
- **Performance**: <2s page loads, 99% uptime
- **User Experience**: >4.0/5.0 satisfaction score

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- **Hosting**: Vercel (Pro Plan) with automatic CI/CD
- **Caching**: Redis Cloud for external API responses
- **Monitoring**: Vercel Analytics + Sentry

### Core Integrations
1. **HubSpot** (Starter Plan) - Contact management with Private App API
2. **PropStream** (Essentials) - Off-market property data via CSV
3. **Cook County Assessor's API** - Property enrichment and tax data
4. **OpenStreetMap + Leaflet** - Interactive mapping and geocoding
5. **Google CEL Engine** - Dynamic property filtering and alerts

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: #151515 (Matt Black)
--secondary: #EFEEE9 (White Mink)

/* Accent Colors */
--accent-primary: #324038 (Roycroft Bottle Green)
--accent-secondary: #E8B793 (Gentle Doe)
--accent-tertiary: #F0DCCB (Champagne Pink)
--neutral-medium: #795953 (Sequoia Dusk)

/* Functional Colors */
--error: #D32F2F
--warning: #F57C00
--success: #324038 (Roycroft Bottle Green)
```

### Typography
- **Font**: Inter, sans-serif
- **Scale**: h1(32px), h2(24px), h3(20px), body(16px), small(14px)
- **Line Height**: 1.5 for body text

## 📁 Project Structure

```
PG MAIN/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (dashboard)/              # Main application routes
│   ├── components/               # React components
│   ├── layouts/                  # Layout components
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── styles/                   # Global styles & Tailwind config
│   ├── globals.css               # Global CSS
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to dashboard)
├── supabase/                     # Supabase configuration
│   ├── functions/                # Edge Functions (serverless)
│   ├── migrations/               # Database schema migrations
│   └── config.toml              # Supabase project configuration
├── types/                        # TypeScript type definitions
├── docs/                         # Documentation
└── scripts/                      # Development and deployment scripts
```

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts with role-based access
- **contacts** - HubSpot contacts with sync tracking
- **properties_offmarket** - PropStream properties with enrichment
- **properties_offmarket_raw** - Raw CSV data for audit trail
- **contacts_properties** - Many-to-many linking table
- **cel_rules** - User-defined alert rules
- **alerts** - Generated alerts from rule matches
- **audit_logs** - Compliance and debugging logs

### Security
- **Row-Level Security (RLS)** enforces role-based data access
- **Audit logging** tracks all sensitive operations
- **Data encryption** in transit and at rest

## 🚀 Development Phases

### Phase 1: Foundation (Weeks 1-4)
- [ ] Project setup & infrastructure
- [ ] Database schema & RLS policies
- [ ] Authentication & user management
- [ ] Basic UI component library
- [ ] CSV import functionality

### Phase 2: Core Features (Weeks 5-8)
- [ ] HubSpot Private App integration
- [ ] PropStream processing with validation
- [ ] Cook County API integration
- [ ] Interactive mapping with Leaflet
- [ ] CEL rule engine implementation

### Phase 3: Intelligence & Polish (Weeks 9-12)
- [ ] Alert system with notifications
- [ ] Analytics dashboard
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] User testing & feedback

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase CLI
- Vercel CLI (optional)
- Git

### Environment Setup
1. **Clone & Install**:
   ```bash
   cd "/Users/michaelisrael/Downloads/PG MAIN"
   npm install
   ```

2. **Supabase Setup**:
   ```bash
   supabase init
   supabase start
   supabase db reset
   ```

3. **Environment Variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase, HubSpot, and other API keys
   ```

4. **Development Server**:
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

### Key Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
supabase db reset       # Reset database with migrations
supabase gen types      # Generate TypeScript types
supabase functions serve # Serve Edge Functions locally

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## 📊 Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms
- **CLS (Cumulative Layout Shift)**: <0.1

### API Performance
- **Database Queries**: <200ms average
- **External API Calls**: <500ms with caching
- **Edge Function Execution**: <1s

### User Experience
- **Page Load Time**: <2s
- **Search Results**: <1s
- **Map Rendering**: <3s

## 🔐 Security & Compliance

### Data Protection
- All API keys stored in environment variables
- HTTPS enforced for all communications
- Input validation using Zod schemas
- SQL injection prevention via parameterized queries

### Privacy
- Basic GDPR compliance measures
- Data retention policies
- User consent management
- Right to data deletion

### Monitoring
- Real-time error tracking with Sentry
- Performance monitoring with Vercel Analytics
- Security scanning in CI/CD pipeline
- Database query performance tracking

## 📚 Documentation

- **[Architecture Guide](./docs/architecture.md)** - Technical deep dive
- **[Data Dictionary](./docs/data-dictionary.md)** - Database schema reference  
- **[API Reference](./docs/api-reference.md)** - Edge Function documentation
- **[User Workflows](./docs/user-workflows.md)** - Feature usage patterns

## 🤝 Contributing

### Code Standards
- TypeScript strict mode enforced
- ESLint + Prettier for code formatting
- Conventional commits for git messages
- Component documentation with JSDoc

### Testing Requirements
- Unit tests for utilities and Edge Functions
- Integration tests for database operations
- E2E tests for critical user journeys
- >80% code coverage for core modules

### Pull Request Process
1. Feature branch from `main`
2. All tests passing
3. Code review required
4. Deploy preview approval
5. Merge with squash

## 📞 Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js 14 Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Query**: https://tanstack.com/query

---

**Built for Real Estate Professionals** | **Powered by Modern Web Technologies**