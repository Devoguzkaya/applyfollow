# PROJECT_MEMORY.md
>
> **Project Name:** ApplyTrack (Job Application CRM)
> **Last Updated:** 2026-01-15
> **Current Phase:** MVP Refactoring & Security Hardening
> **Active Context:** Backend security audit completed. Calendar module refactored for multi-tenancy. Transaction management improved.
>

---

## [1. PROJECT VISION & GOALS]

* **Core Concept:** İş arayanlar için başvurularını tek bir yerden yönetebilecekleri, "ghostlanmayı" önleyen ve süreci takip eden akıllı bir Job Application CRM.
* **Target Audience:** İş arayan yazılımcılar ve beyaz yakalı çalışanlar.
* **Success Criteria:** Kullanıcının 5 başvuru girip bunları takip edebilmesi (MVP Goal). Uzun vadede AI destekli CV analizi ve mail asistanı.

## [2. TECH STACK & CONSTRAINTS]

* **Language/Framework:**
  * Backend: Java 17, Spring Boot 3.x
  * Frontend: Next.js (App Router), TailwindCSS (v4)
* **Backend/DB:** PostgreSQL, Spring Data JPA (ddl-auto: update)
* **State Management:** React Context API (NotificationContext), Local State
* **Key Packages:**
  * Backend: Lombok, Spring Validation, Postgres Driver
  * Frontend: `date-fns` (utils), `react-hot-toast` (notifications), `clsx` (styling)
* **Constraints:**
  * Clean Architecture (Controller -> Service -> DTO -> Repository)
  * Strict Typing (Enums for Status)
  * Multi-tenancy support (User based)
  * **Design:** Dark Mode, Glassmorphism, Neon Accents (#00D632, #182023)

## [3. ARCHITECTURE & PATTERNS]

* **Design Pattern:** Layered Architecture (Controller-Service-Repository)
* **Folder Structure (Backend):**
  * `/controller`: API endpoints (REST) - **NO ENTITIES ALLOWED**
  * `/service`: Business Logic & DTO Mapping - **TRANSACTIONAL**
  * `/repository`: Data Access Layer
  * `/model`: JPA Entities (BaseEntity extended)
  * `/dto`: Data Transfer Objects (Records)
  * `/exception`: Custom Exceptions & Global Handler
* **Folder Structure (Frontend):**
  * `app/(authenticated)/`: Authenticated routes (Dashboard, Calendar, Applications)
  * `components/`: Reusable UI components (Sidebar, Header, AlarmSystem)
  * `context/`: React Context Providers
  * `services/`: API clients (applicationService.ts, calendarService.ts)

## [4. ACTIVE RULES (The "Laws")]

1. **Asla Entity'leri Controller'dan dışarı açma.** Her zaman DTO kullan (`Record` yapısı).
2. **Service Katmanı Şart.** Controller repository'ye dokunamaz.
3. **Exception Handling.** Hata fırlatırken özel exceptionlar (`ResourceNotFoundException`, `BadRequestException`) kullan.
4. **Auto Audit.** Tüm entityler `BaseEntity`'den türemeli (`createdAt` takibi için).
5. **Multi-repo yasak.** Tek repo, `backend` ve `frontend` klasörleri ayrı.
6. **TOOL RESTRICTION:** `replace_file_content` kullanımı yasaktır. Dosya güncellemeleri için **her zaman** `write_to_file` kullanılarak dosyanın tamamı yeniden yazılmalıdır.
7. **Optimization Standards:**
   * Interactive elements must use semantically correct tags (`button` over `div`).
   * All complex handlers must be wrapped in `useCallback`.
   * Images must use `loading="lazy"` or `next/image`.
   * ARIA labels required for non-text interactive elements.

## [5. PROGRESS & ROADMAP]

* [x] Phase 1: Backend Setup
  * [x] Spring Boot Init & Config
  * [x] PostgreSQL Connection
  * [x] Entities (User, Company, Application, CalendarEvent, **Contact**)
  * [x] Repositories & Services
  * [x] DTOs & Custom Exceptions
  * [x] Controllers (API Endpoints + Calendar Controller)
  * [x] **Refactor:** Calendar Module (Multi-tenancy + DTOs)
  * [x] **Refactor:** Transaction Management & Exception Handling in Services

* [x] Phase 2: Frontend Setup (Next.js)
  * [x] Init Project & Tailwind v4 Config
  * [x] Dashboard UI Implementation (Sidebar, Layout, Home)
  * [x] Calendar Page (Interactive, Mock -> Real Backend)
  * [x] Alarm System (Windows Notification + In-App Bell + Toast)
  * [x] Custom Toast Implementation (`react-hot-toast`)
  * [x] Detail Page (`applications/[id]`) - Dynamic & Optimized
  * [ ] Profile Page

* [x] Phase 3: Core Features (MVP)
  * [x] Dashboard (List applications from API - Real Data)
  * [x] Add Application Modal
  * [x] Contact Management (Add/View Contacts)
  * [x] Pipeline Visualization

## [6. DECISION LOG & ANTI-PATTERNS]

* **[Karar - 2026-01-14]:** Frontend optimization standartları belirlendi.
* **[Karar - 2026-01-15]:** Calendar modülü güvenlik açığı kapatıldı (User relation eklendi, auth check zorunlu).
* **[Karar - 2026-01-15]:** Tüm yazma işlemleri (Create/Update/Delete) Service katmanında `@Transactional` ile korunacak.
* **[Karar - 2026-01-15]:** Backend Controller'larında Entity sızdırmazlık kuralı (Rule #1) Calendar modülü için de sıkı şekilde uygulandı.
* **[Yasak]:** `replace_file_content` aracı kod bütünlüğünü bozduğu için yasaklanmaya devam ediliyor.

---
**OPERATIONAL DIRECTIVE:**

1. **Read First:** Before answering any prompt, check this file for context.
2. **Update Often:** If a task is completed, check the box [x]. If a tech decision changes, update Section 2.
3. **Strictly Follow Rule #6:** Never use partial replace.
