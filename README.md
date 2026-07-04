# EliteFit Studio - Premium Fitness Studio Web Application

Welcome to **EliteFit Studio**, a premium boutique fitness studio web application designed to deliver an elegant digital experience for members, trainers, and administrators.

---

## 🚀 Project Overview

EliteFit Studio combines a modern design system with a scalable architectural foundation:
*   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, and React Query.
*   **Backend**: Node.js, Express.js, TypeScript, and MongoDB (via Mongoose ODM).
*   **Security**: Cookie-based JWT authentication, rate limiting, and Helmet protection.
*   **Integrations**: Stripe & Razorpay (Payments), Cloudinary (Media storage).

---

## 📂 Repository Directory Structure

```
FitnessStudio/ (Root)
│
├── frontend/                     # Next.js Application Client
│   ├── public/                   # Static page media and configurations
│   └── src/
│       ├── app/                  # Next.js App Router (Layouts & Pages)
│       ├── components/           # Reusable UI elements (Common, Charts, Cards)
│       ├── hooks/                # Custom React Hooks
│       └── services/             # API client calls (Axios/React Query)
│
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── config/               # Database, Cloudinary & Gateway setups
│   │   ├── controllers/          # Request logic orchestrators
│   │   ├── models/               # Mongoose DB schema definitions
│   │   └── server.ts             # Application entry point
│   ├── tsconfig.json
│   └── package.json
│
├── database/                     # DB Setup & Seeding scripts
│   ├── schema/                   # DB blueprints
│   ├── seeders/                  # Mock data populators (seed.ts)
│   └── scripts/                  # DB backup & restore utilities
│
├── docs/                         # Developer manuals and API endpoints documentation
├── assets/                       # Brand icons, logo, original images
└── deployment/                   # Docker, CI/CD configuration files
```

---

## 🛠️ Quick Start Guide

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.x or later)
*   [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas Connection string)

### 1. Setup Backend Server
Navigate to the backend directory, configure environment variables, and start the development server:
```bash
cd backend
# Create environment variables file
cp .env.example .env
# Start hot-reloading development server
npm run dev
```
The API server will launch at `http://localhost:5000`. You can inspect the health check at `http://localhost:5000/health`.

### 2. Setup Next.js Frontend Client
Navigate to the frontend directory and start the client dev server:
```bash
cd ../frontend
# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔒 Coding Standards & Rules

*   **TypeScript Strictness**: Implicit `any` is forbidden. Enable strict checks on all workspace modules.
*   **Design Tokens**: Follow the layout grid and color palette outlined in the design documentation:
    *   *Primary Background*: `#272624` (Deep Charcoal)
    *   *Highlights*: `#DDA964` (Sand Gold) / `#A56A23` (Warm Amber)
*   **No Placeholders**: Ensure all components are functional and production-ready before checking them off the task list.
