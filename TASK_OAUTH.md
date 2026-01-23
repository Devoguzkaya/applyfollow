# TASK-OAUTH: Google & GitHub Login Implementation

> **Status:** Planning
> **Date:** 2026-01-20
> **Objective:** Enable users to log in/sign up using their Google or GitHub accounts via OAuth2.

## 1. Architecture (Backend-Centric)

We will use the **Backend-Centric** approach for maximum security and simple frontend integration.

1. **Frontend:** Login buttons redirect to Backend (`/oauth2/authorization/google`).
2. **Backend:**
    * Spring Security handles the handshake with Google/GitHub.
    * Fetches user email/name.
    * Creates/Updates user in DB.
    * Generates our App's JWT.
    * Redirects back to Frontend (`/oauth/callback?token=...`).
3. **Frontend:** Reads token from URL and logs user in.

## 2. Prerequisites

You (The User) must obtain the following from Google Cloud Console and GitHub Developer Settings:

* **Google:** `Client ID` and `Client Secret`
* **GitHub:** `Client ID` and `Client Secret`

## 3. Implementation Steps

### 🟢 Backend

1. **Dependencies:** Add `spring-boot-starter-oauth2-client` to `pom.xml`.
2. **Entity Update:** Add `AuthProvider` (GOOGLE, GITHUB, LOCAL) to `User` entity.
3. **Config:** Update `application.yml` with OAuth2 client settings.
4. **Security:** Update `SecurityConfig` to enable `oauth2Login()`.
5. **Service:** Create `CustomOAuth2UserService` to process user data.
6. **Handler:** Create `OAuth2SuccessHandler` to generate JWT & redirect.

### 🔵 Frontend

1. **UI:** Add "Sign in with Google" & "GitHub" buttons to Login Page.
2. **Route:** Create `/app/auth/callback/page.tsx` to handle the redirect.
3. **Logic:** Extract token, save to store, redirect to dashboard.

## 4. Database Changes

* Add `provider` column to `users` table.
* `password_hash` becomes nullable (OAuth users don't have passwords).
