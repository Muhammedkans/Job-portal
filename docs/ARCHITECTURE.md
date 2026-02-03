# Job Portal Platform - Architecture & Roadmap

## 1. High-Level Architecture
We are building a **Monolithic Service-Oriented Architecture** (conceptually) housed in a **Monorepo**.

### Why Monorepo?
- **Senior Insight**: In a real company, if the Frontend (Consumer) and Backend (Provider) are built by the same core team, splitting them guarantees "Contract Drift" (Backend changes API, Frontend breaks).
- **Benefit**: We can manage everything in one place. One git commit can update the API *and* the Frontend consumption of it.

### The Stack
- **Frontend**: Next.js 14+ (App Router) - **TypeScript**.
- **Backend**: Express.js - **TypeScript**.
- **Database**: **MongoDB** (via Mongoose) - Flexible schema is superior for nested resume data and rapidly changing job attributes.

## 2. Directory Structure (The "Senior" Way)
We don't just dump files. We structure by **Module** or **Layer**.

```
/job-portal-platform
├── /client          # Next.js Frontend
│   ├── /src
│   │   ├── /components  # Atomic Design (Atoms, Molecules, Organisms)
│   │   ├── /app         # Pages & Routes
│   │   ├── /services    # API Calls (clean separation from UI)
│   │   └── /hooks       # Reusable logic
├── /server          # Express Backend
│   ├── /src
│   │   ├── /config      # Env vars, DB connection
│   │   ├── /controllers # Request/Response handling (No business logic!)
│   │   ├── /services    # The "Brains" (Business Logic)
│   │   ├── /repositories# Database Access (Mongoose Models/Queries) for Clean Arch
│   │   ├── /models      # Database Schemas
│   │   ├── /routes      # Endpoint definitions
│   │   └── /utils       # Helpers
├── /docs            # Documentation (ADRs, Diagrams)
└── /scripts         # Deployment/Maintenance scripts
```

## 3. Immediate Next Steps
1. Initialize `client` (Next.js).
2. Initialize `server` (Node/Express).
3. Set up Docker/Database local environment (or prepare for Cloud DB).
