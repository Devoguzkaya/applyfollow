<div align="center">
  <h1>🚀 ApplyFollow</h1>
  <p><strong>A High-Performance Job Application CRM & Career Portfolio Engine</strong></p>
  
  [![Build Status](https://github.com/Devoguzkaya/applyfollow/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Devoguzkaya/applyfollow/actions)
  ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.1-6DB33F?style=flat&logo=spring)
  ![Next.js](https://img.shields.io/badge/Next.js-16.1.1-000000?style=flat&logo=next.js)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql)
  ![Docker](https://img.shields.io/badge/Docker-Powered-2496ED?style=flat&logo=docker)
</div>

<br />

ApplyFollow is a complete, production-ready Full-Stack application engineered for developers to seamlessly track job applications, schedule interviews, and dynamically generate professional CVs. It serves as both a practical utility CRM and a **comprehensive technical showcase** of modern software architecture, security, and DevOps practices.

---

## 🛠️ Tech Stack & Architecture

This project was built from the ground up to demonstrate proficiency in connecting robust backend microservices with sleek, highly responsive frontend interfaces.

### 💼 Backend (Java / Spring Boot)

- **Framework:** Spring Boot 3.2.1 with Java 17
- **Database:** PostgreSQL (Spring Data JPA / Hibernate)
- **Security:** Spring Security, stateless JWT Authentication, OAuth2 (Google & GitHub SSO)
- **API Design:** RESTful Architecture, API Versioning, Swagger/OpenAPI Documentation
- **Core Features:**
  - Dynamic PDF/Word CV Generation using **Apache POI**
  - Advanced Querying with **JOIN FETCH** to eliminate N+1 query problems
  - Background Job Scheduling utilizing `AtomicBoolean` smart polling
  - In-memory Caching for `UserDetails` to minimize redundant database hits

### 🎨 Frontend (React / Next.js)

- **Framework:** Next.js 16.1.1 (App Router) & React 19
- **Styling:** Tailwind CSS v4 for utility-first, highly responsive design
- **State Management:** Redux Toolkit & React Query (TanStack) for resilient client-side caching and global state
- **UI & UX:**
  - Kanban-style Drag & Drop Boards (`@dnd-kit/core`)
  - Real-time Toast Notifications (`react-hot-toast`)
  - Optimized LCP (Largest Contentful Paint) using Next.js advanced `Image` features

### 🚀 DevOps & Infrastructure (CI/CD)

- **Containerization:** Fully Dockerized (Frontend, Backend, Database) orchestrated via `docker-compose`
- **Reverse Proxy & Routing:** Dynamic Nginx Reverse Proxy (`nginxproxy/nginx-proxy`) resolving container networks avoiding standard port conflicts
- **SSL / Security:** Automated Let's Encrypt certificates via `acme-companion`
- **CI/CD Pipeline:** Fully automated deployments to a Contabo VPS via **GitHub Actions**. Pushes to `master` trigger automatic image builds (GHCR), VPS SSH pull, and zero-downtime rolling updates.

---

## 🔒 Security Posture & Hardening (OWASP 2025)

Security is treated as a first-class citizen in ApplyFollow, defending against modern threat landscapes:

- **Stateless JWT + OAuth2:** Secure Google & GitHub SSO integration with hardened state validation callbacks.
- **HTTP Security Headers:** Frontend configuration hardened with `X-Frame-Options: DENY` (Anti-Clickjacking), `Strict-Transport-Security` (HSTS Downgrade Prevention), `X-Content-Type-Options: nosniff`, and customized CSPs.
- **Protected Database Tier:** Internal Docker Networks (`app_network`) restrict database access only to validated backend containers, not exposing port 5432 to the public internet.

---

## ⚡ Performance Optimizations

ApplyFollow implements enterprise-grade performance strategies:

1. **N+1 Query Elimination:** Complex data fetching logic uses `JOIN FETCH` to retrieve deeply nested JPA entities in a single SQL query, cutting response times drastically.
2. **Caching Layers:** Heavy authentication scopes (UserDetails) are cached in-memory, relieving the Postgres database of hundreds of queries during high-traffic authentication moments.
3. **Smart Task Schedulers:** The background notification scheduler executes dynamically, preventing idle hardware polling when no reminder triggers exist.

---

## 📚 Detailed Documentation

Dive deeper into internal workflows, API specifications, and the project roadmap:

- 📖 [TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md): Deep dive into the optimized caching, architectural decisions, and scheduling logic.
- 🗺️ [ROADMAP.md](./ROADMAP.md): Track the journey and plan for upcoming release phases.

---
> **About the Developer:** Developed by [Oğuzhan Kaya](https://github.com/Devoguzkaya) | Focused on crafting resilient backend systems and dynamic frontend architectures. Open to Full-Stack and Backend developer roles.
