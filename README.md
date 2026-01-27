# ApplyFollow

ApplyFollow is a high-performance Job Application CRM tailored for modern developers. It provides a centralized hub to manage the entire job search lifecycle, from the first "Sent" event to the final "Offer Accepted."

[![Build Status](https://github.com/Devoguzkaya/applyfollow/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Devoguzkaya/applyfollow/actions)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-green?logo=springboot)](https://spring.io/projects/spring-boot)

---

## 🌟 Latest Updates (January 27, 2026)

- **Performance & Scalability Engine**:
  - Implemented **Pagination** for all major entities (Users, Companies).
  - Fixed **N+1 Query issues** in scheduler using specialized `JOIN FETCH` queries.
  - Implemented **Batch Writes** (`saveAll`) and **Bulk Deletes** (`@Modifying`) for maximum DB efficiency.
- **Modern Logging**: Full migration to **SLF4J** with clean error handling.
- **Rock-solid OAuth2**: Custom in-memory state repository solves all redirect & cookie issues.
- **Optimized DevOps**: Docker builds are now significantly faster thanks to dependency caching.

---

## Core Features

- **Intelligent Analytics**: Monitor your success rate with real-time status tracking and visual KPIs.
- **Interview Scheduler**: Integrated calendar to keep track of interviews and technical tests.
- **Pro CV Builder**: Generate PDF resumes automatically based on your application history and profile.
- **Secure & Stateless**: Robust security architecture leveraging OAuth2 and JWT.

## The Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15+, React 19, Tailwind CSS v4, TanStack Query v5, Redux Toolkit |
| **Backend** | Spring Boot 3.2, Spring Security, Spring Data JPA, Hibernate |
| **Database** | PostgreSQL, HikariCP Connection Pooling |
| **Scalability** | Spring Data Pagination, Batch Processing |
| **Logging** | SLF4J with Lombok `@Slf4j` |

---

## Getting Started

### 1. Prerequisites

- **JDK 17+**, **Node.js 20+**, **PostgreSQL**

### 2. Quick Run

```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm run dev
```

Visit `http://localhost:3000` to start tracking!

---

## Detailed Documentation

For deep technical insights, refer to the [TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md) file.

---
© 2026 ApplyFollow. Optimized for scale.
