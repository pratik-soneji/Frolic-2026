# 🎉 Frolic 2026 — Institutional Event Management Platform

<div align="center">

### A modern full-stack event management ecosystem built for large-scale institutional festivals

*From registrations and team formations to coordinator workflows, media handling, and winner declarations.*

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb)
![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-black?style=flat-square)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=react-query)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary)

</div>

---

# ✨ Overview

**Frolic 2026** is a comprehensive full-stack institutional event management platform engineered to simplify large-scale festival operations.

Managing college or institutional events manually usually becomes a chaotic mess of spreadsheets, WhatsApp groups, duplicate registrations, confused coordinators, and lost participant data. Frolic solves that.

The platform centralizes the complete event lifecycle into a structured, scalable ecosystem.

It supports:

- 🏛️ Multi-level organizational management
- 👥 Individual & team-based registrations
- 🔐 Secure authentication & authorization
- 🧑‍💼 Role-based administrative dashboards
- ☁️ Cloud media uploads
- 🏆 Winner declaration workflows
- 🌙 Modern responsive user experience

---

# 🚀 Core Features

## 🔐 Authentication & Security

Production-style authentication architecture built with security-first principles.

### Includes:
- JWT-based Access + Refresh Token authentication
- Secure `httpOnly` cookie session handling
- Automatic silent token refresh
- Password hashing using `bcrypt`
- Protected route authorization middleware
- Role-aware access control enforcement

---

## 🏛️ Hierarchical Organizational Management

Frolic models real institutional structures with scoped access.

```text
Institute
   └── Department
          └── Event
```

### Capabilities:
- Institute creation & management
- Department allocation under institutes
- Event lifecycle management
- Scoped coordinator ownership
- Controlled access delegation

---

## 👥 Advanced Registration System

Flexible participant management built for multiple event formats.

### Individual Registrations
- Direct participant enrollment
- Duplicate registration prevention
- Eligibility validation

### Group Registrations
- Team creation workflows
- Configurable participant limits
- Team leader assignment
- Member relationship tracking
- Group participation management

---

## 🧑‍💼 Role-Based Dashboard System

Different users, different powers. Civilization depends on permission boundaries.

### Supported Roles:
- System Administrator
- Institute Coordinator
- Department Coordinator
- Event Coordinator
- Student Coordinator
- Standard Participant/User

Each role receives scoped access to only the resources they control.

---

## 📊 Administrative Control Panel

Centralized management dashboard with complete CRUD workflows.

Manage:

- Users
- Institutes
- Departments
- Events
- Participants
- Group Registrations
- Winners
- Media Assets

---

## 🏆 Winner Declaration Engine

Built-in result management workflow for competitive events.

### Features:
- Declare winners by event
- Rank participants
- Store historical results
- Display final outcomes
- Maintain structured winner records

---

## 🎨 Modern Frontend Experience

Designed for usability, speed, and clean interaction.

### UI Features:
- Fully responsive layouts
- Persistent dark mode
- Smooth transitions & animations
- Optimistic UI interactions
- Form validation with instant feedback

---

# 🏗️ Architecture Overview

Frolic follows a decoupled full-stack architecture.

## Frontend

**Location:** `/frolic/my-app`

Modern SPA architecture built with:

- React 19
- Vite
- React Router DOM v7
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Zustand
- TanStack React Query
- React Hook Form
- Zod

### Responsibilities
- Authentication flows
- Dashboard rendering
- Event browsing
- Registration workflows
- Form handling
- Client-side state management
- API communication

---

## Backend

**Location:** `/backend`

RESTful API architecture powered by Express.

### Built With:
- Node.js
- Express 5
- JWT Authentication
- Cookie-based session management
- Multer
- Cloudinary
- Custom middleware pipelines

### Responsibilities
- Authentication & authorization
- Business logic execution
- Registration validation
- File upload handling
- Database operations
- Access control enforcement

---

# 💻 Tech Stack

## Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Zustand
- TanStack React Query
- React Hook Form
- Zod
- Lucide React
- Recharts

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- cookie-parser
- CORS
- Multer
- Cloudinary

---
