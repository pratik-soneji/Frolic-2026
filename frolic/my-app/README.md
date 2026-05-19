# Frolic 2026: Event Management Platform

A robust, full-stack event management system designed to handle large-scale institutional fests. It facilitates multi-tier organizational structures (Institutes → Departments → Events) while providing comprehensive dashboards for administrators, coordinators, and student participants.

## 🚀 Project Overview

**Frolic 2026** is built to streamline the registration, coordination, and execution of campus events. It offers a secure, role-based ecosystem where administrators can oversee the entire platform, coordinators can manage specific events or departments, and students can register individually or as groups.

The system replaces manual fest management with an automated pipeline, supporting real-time data fetching, media uploads via Cloudinary, and secure JWT-based authentication.

## ✨ Core Features

*   **Role-Based Access Control (RBAC):** Distinct access levels and dashboards for Admin, Coordinators (Institute, Department, Event), and standard Users.
*   **Multi-Tier Architecture:** Hierarchical management supporting `Institutes` > `Departments` > `Events`.
*   **Group & Participant Management:** Robust registration system handling both individual and group enrollments, including dynamic team sizes (`groupMinParticipants` to `groupMaxParticipants`), payment tracking, and attendance.
*   **Cloud Media Management:** Integrated Multer and Cloudinary pipeline for seamless uploading of event banners and user avatars.
*   **Secure Authentication:** Dual-token JWT system (Access + Refresh tokens) secured via `httpOnly` cookies with robust middleware guards.
*   **Interactive Admin Dashboards:** Dedicated data tables to monitor Users, Events, Institutes, Departments, Participants, and Winners.
*   **Client-Side Validation & State:** Zod schema validation combined with React Hook Form, managed by Zustand for global state and React Query for asynchronous data fetching.
*   **Dark Mode Support:** Built-in theming system persisting user preferences.

## 🏗️ Architecture Overview

The project follows a decoupled client-server architecture:

*   **Frontend (Frolic App):** A React 19 application built with Vite and TypeScript. It leverages `shadcn/ui` for accessible, premium components, `Zustand` for client state (like Auth), and `@tanstack/react-query` for API synchronization.
*   **Backend (API Server):** An Express.js REST API powered by Node.js. It utilizes Mongoose to interface with a MongoDB database.
*   **Database:** MongoDB instance (MongoDB Atlas) structured to maintain complex relationships between Users, Events, and organizational bodies.

## 📁 Project Structure

```text
c:\Wt2project\
├── backend/                  # Express.js REST API
│   ├── public/               # Static assets
│   └── src/
│       ├── configs/          # Configuration files
│       ├── controllers/      # Route logic and handlers
│       ├── db/               # MongoDB connection setup
│       ├── middlewares/      # Express middlewares (Auth, Multer, etc.)
│       ├── model/            # Mongoose schemas (Events, Users, etc.)
│       ├── routers/          # API route definitions
│       ├── utills/           # Helper functions and utilities
│       ├── app.js            # Express app configuration
│       └── server.js         # Entry point
│
└── frolic/my-app/            # Vite React Frontend
    ├── public/               # Static web assets
    └── src/
        ├── api/              # Axios instances and API services
        ├── assets/           # Images and static files
        ├── components/       # Reusable UI elements & shadcn/ui components
        │   ├── pages/        # Route-level page components (Dashboards, etc.)
        │   └── ui/           # Primitive UI components
        ├── constants/        # Global constants (e.g., API URLs)
        ├── data/             # Static or mock data
        ├── helpers/          # Frontend utility functions
        ├── hooks/            # Custom React hooks
        ├── lib/              # Library configurations (Tailwind utils)
        ├── services/         # Business logic services
        ├── store/            # Zustand state stores (e.g., useAuthStore)
        ├── types/            # TypeScript interfaces and types
        ├── App.tsx           # Root component
        ├── index.css         # Global styles and Tailwind directives
        └── main.tsx          # React DOM mounting and Router setup
