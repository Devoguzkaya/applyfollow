# ApplyFollow

ApplyFollow is a high-performance Job Application CRM tailored for modern developers. It provides a centralized hub to manage the entire job search lifecycle, from the first "Sent" event to the final "Offer Accepted."

[![Build Status](https://github.com/Devoguzkaya/applyfollow/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Devoguzkaya/applyfollow/actions)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![Tailwind CSS v4](https://img.shields.io/badge/Design-Tailwind%20CSS%20v4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

---

## Core Features

- **Intelligent Analytics**: Monitor your success rate with real-time status tracking and visual KPIs.
- **Interview Scheduler**: Integrated calendar to keep track of interviews and technical tests.
- **Pro CV Builder**: Generate PDF resumes automatically based on your application history and profile.
- **Secure & Stateless**: Robust security architecture leveraging OAuth2 and JWT.
- **Internationalized**: Seamlessly switch between English and Turkish.

## The Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15+, React 19, Tailwind CSS v4, TanStack Query v5, Redux Toolkit |
| **Backend** | Spring Boot 3.2, Spring Security, Spring Data JPA, Hibernate |
| **Database** | PostgreSQL, HikariCP Connection Pooling |
| **Security** | JWT (JSON Web Token), Google OAuth2 (In-Memory State Management) |
| **DevOps** | GitHub Actions (CI/CD), Docker, Docker Compose |

---

## Getting Started

### 1. Prerequisites

- **JDK 17+**
- **Node.js 20+**
- **PostgreSQL** instance

### 2. Environment Setup

Rename `.env.example` to `.env` in the root and frontend directories, then fill in your credentials.

### 3. Backend Execution

```bash
cd backend
mvn spring-boot:run
```

### 4. Frontend Execution

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to start tracking!

---

## Detailed Documentation

For deep technical insights, architectural decisions, and API methodology, please refer to the [TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md) file.

---
© 2026 ApplyFollow. Crafted with precision for the developer community.
