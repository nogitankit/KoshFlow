# KoshFlow

KoshFlow is a full-stack banking dashboard built with Next.js, Supabase, and Plaid.

The goal of this project was to learn how modern financial applications handle authentication, bank account connections, transaction tracking, and secure data access while using a production-style architecture.

Users can create an account, connect bank accounts through Plaid, view balances and transaction history, and transfer funds between linked accounts through a clean dashboard interface.

---

## Features

* Secure authentication using Supabase Auth
* Connect bank accounts using Plaid Link
* View total balance across linked accounts
* Interactive charts for account distribution
* Transaction history with pagination
* Internal money transfer functionality
* Protected routes using server-side authentication
* Row-Level Security (RLS) policies for database protection
* Production-grade error tracking and performance monitoring using **Sentry**

---

## Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Shadcn UI
* Chart.js
* React Hook Form
* Zod

### Backend

* Supabase Auth
* Supabase PostgreSQL
* Server Actions
* Next.js SSR

### APIs & Services

* Plaid API
* Plaid Transfer API (Sandbox)
* Sentry (Error tracking and telemetry)

### Tooling

* Turborepo
* ESLint
* TypeScript

---
## Project Architecture

### Monorepo Structure

```text
KoshFlow/
├── apps/
│   └── web/
├── packages/
│   ├── ui/
│   ├── eslint-config/
│   └── typescript-config/
```

### Application Layers

```text
Frontend (Next.js)
        │
        ▼
Server Actions
        │
        ▼
Supabase Auth + Database
        │
        ▼
Plaid APIs
```
---

## How It Works

### Authentication

Users can sign up and log in using email and password authentication powered by Supabase.

User sessions are managed on the server using Next.js App Router and Supabase SSR clients.

### Bank Connections

Plaid Link is used to securely connect bank accounts.

Once a user completes the Plaid flow:

1. A public token is generated
2. The token is exchanged for an access token
3. Bank account information is stored in the database
4. The account becomes available throughout the dashboard

### Dashboard

The dashboard displays:

* Linked bank accounts
* Total account balances
* Balance distribution charts
* Recent transactions

### Transfers

Users can transfer funds between connected accounts using Plaid's sandbox transfer APIs.

Each transfer is stored in the database and reflected throughout the application.

---

## Authentication Flow

```text
User Sign Up
      │
      ▼
Supabase Auth
      │
      ▼
User Profile Created
      │
      ▼
Plaid Account Linked
      │
      ▼
Dashboard Access
```

---

## Financial Workflow

### Bank Linking

```text
User
  │
  ▼
Plaid Link
  │
  ▼
Public Token
  │
  ▼
Access Token Exchange
  │
  ▼
Bank Record Stored
```

### Transfers

```text
Sender
  │
  ▼
Transfer Form
  │
  ▼
Plaid Transfer API
  │
  ▼
Transaction Logged
  │
  ▼
Balance Recalculated
```

---

## Database Structure

### users

Stores profile information linked to the authenticated user.

### banks

Stores connected Plaid accounts and account metadata.

### transactions

Stores transfer records between users and connected bank accounts.

---

## Security

This project uses Supabase Row-Level Security (RLS) policies to ensure users can only access their own records.

Authentication is handled through Supabase Auth and sensitive operations are performed on the server.

---

## What I Learned

Building KoshFlow helped me get hands-on experience with:

* Server-side rendering in Next.js
* Authentication and session management
* PostgreSQL database design
* Row-Level Security (RLS)
* Financial API integrations
* Monorepo architecture with Turborepo
* Form validation and type-safe development

---

## Future Improvements

* Budget tracking and analytics
* Spending insights and categorization
* Better mobile responsiveness

---

## Running Locally

```bash
git clone https://github.com/nogitankit/KoshFlow

npm install

npm run dev
```

Create a `.env.local` file with the required Supabase and Plaid credentials before starting the application.
Here's the required .env variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions,identity
PLAID_COUNTRY_CODES=US, CA

---

## Thank You
Thank you for taking the time to explore KoshFlow.


