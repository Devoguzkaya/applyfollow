# ApplyFollow

ApplyFollow is a high-performance Job Application CRM tailored for modern developers.

[![Build Status](https://github.com/Devoguzkaya/applyfollow/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Devoguzkaya/applyfollow/actions)

---

## 🌟 Latest Updates (Jan 27, 2026 - Phase 2)

- **Performance & Security Hardening (Jules Recommendations)**:
  - **Auth Caching**: Implemented in-memory `UserDetails` cache to eliminate redundant database queries on every API call.
  - **N+1 Fixed Globally**: Optimized job application fetching using `JOIN FETCH`.
  - **Smart Polling**: Notification scheduler now uses an `AtomicBoolean` flag to bypass DB checks when no alarms are pending.
  - **OAuth2 Cleanup**: Automated background task to clear stale authentication states, preventing memory leaks.
  - **Dynamic Redirects**: Users are now redirected back to their specific page after OAuth2 login.

- **Frontend Polish**:
  - Optimized LCP with Next.js Image `sizes` prop.
  - Efficient sidebar badges using a dedicated count-only endpoint.
  - Notification storage capped at 50 items for browser stability.

---

## Core Features

- **Intelligent Analytics**: Real-time status tracking and visual KPIs.
- **Interview Scheduler**: Smart notification system that stays silent when idle.
- **Pro CV Builder**: Automated PDF generation.
- **Enterprise Grade Security**: OAuth2 + JWT with secure state management and caching.

---

## Detailed Documentation

- [TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md): Deep dive into the optimized caching and scheduling logic.
- [ROADMAP.md](./ROADMAP.md): Track our journey to the next release.

---
© 2026 ApplyFollow. Engineered for speed.


