# ApplyFollow 🚀

ApplyFollow is a professional, high-performance **Job Application CRM** designed for modern developers. It helps you track your job search lifecycle from initial application to final offer, ensuring you never lose track of an opportunity or get "ghosted" without notice.

![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=github-actions)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-green?logo=springboot)
![TanStack Query](https://img.shields.io/badge/State-TanStack%20Query%20v5-ff4154?logo=react-query)

## ✨ Core Features

- **📊 Intelligent Dashboard**: Real-time overview of your pipeline with KPIs (Applied, Interview, Offer, Rejected).
- **📝 Application Management**: Detailed tracking of company info, status, notes, and contacts for each role.
- **📅 Smart Calendar**: Never miss an interview. Integrated event management with alarm support.
- **📄 CV Builder & Portfolio**: Build your professional CV and showcase your profile with a unique slug URL.
- **🌐 Multilingual Support**: Fully localized in English and Turkish.
- **🔒 Secure Architecture**: Role-based access control with JWT authentication.

## 🛠️ Technical Excellence

- **Data Fetching & Caching**: Powered by **TanStack Query (React Query)** for lightning-fast UI updates and efficient server state management.
- **Clean Architecture**: Strictly followed Layered Architecture (Controller -> Service -> DTO -> Repository) on the backend.
- **Optimized Database**: Fine-tuned **HikariCP** connection pooling for high concurrency.
- **Modern UI**: Dark-themed, glassmorphic design using **Tailwind CSS v4**.
- **DevOps**: Automated CI/CD pipeline with **GitHub Actions** checking build integrity on every push.

## 🚀 Getting Started

### Prerequisites

- JDK 17+
- Node.js 20+
- PostgreSQL

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Devoguzkaya/applyfollow.git
   cd applyfollow
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   # Configure application.properties with your DB credentials
   mvn spring-boot:run
   ```

3. **Frontend Setup:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the App:**
   Open [http://localhost:3000](http://localhost:3000)

---
© 2026 ApplyFollow. Built with ❤️ by **Oguzhan**.
