# Frolic 2026: Institutional Event Management Platform

![Frolic Banner](https://img.shields.io/badge/Status-Active%20Development-success?style=for-the-badge) ![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

**Frolic 2026** is a full-stack, comprehensive event management system designed for large-scale institutional festivals. The platform handles everything from complex multi-tier organizational structures (Institutes → Departments → Events) to role-based access control, participant registrations, group formations, and media uploads. 

---

## 🚀 Features (Currently Implemented)

- **Role-Based Access Control (RBAC):** Distinct dashboards and access levels for system Admins, Coordinators (Institute/Department/Event/Student), and standard Users.
- **Hierarchical Organization:** Dynamic management of `Institutes` > `Departments` > `Events`.
- **Advanced Registration System:** Supports both individual and group event registrations, including dynamic team sizes (`groupMinParticipants` to `groupMaxParticipants`).
- **Cloud Media Pipeline:** Direct integration with Cloudinary via Multer for uploading user avatars and event banners.
- **Dual-Token Authentication:** Secure JWT-based system utilizing short-lived access tokens and long-lived refresh tokens, managed via `httpOnly` secure cookies.
- **Admin Control Panel:** Fully functional data tables with CRUD capabilities to monitor Users, Events, Institutes, Departments, Participants, and Winners.
- **Winner Declaration Engine:** Dedicated system to declare, store, and display event winners.
- **Client-Side State & Caching:** Utilizes `Zustand` for global state (auth, themes) and `@tanstack/react-query` for asynchronous API state and caching.
- **Persistent Dark Mode:** Built-in theming system with local storage persistence.

---

## 🏗️ Architecture Overview

The project is built on a decoupled client-server architecture:

- **Frontend (`/frolic/my-app`):** A modern React 19 Single Page Application built with Vite. It uses `shadcn/ui` and `Tailwind CSS v4` for a premium, accessible design system. Data fetching is abstracted via `axios` instances integrated with React Query.
- **Backend (`/backend`):** A RESTful API built on Express 5. It uses a robust middleware chain for authentication (`VerifyJWT`, `refreshIfExpired`) and file processing (`upload`).
- **Database:** MongoDB acts as the primary data store, using Mongoose 9 for strict schema validation and complex document relations.

---

## 📁 Real Project Structure Tree

```text
c:\Wt2project\
├── backend/                      # Node.js Express API
│   ├── public/                   # Static backend assets
│   └── src/
│       ├── configs/              # Environment configurations
│       ├── controllers/          # Business logic handlers (admin, event, user, participant)
│       ├── db/                   # MongoDB connection logic
│       ├── middlewares/          # Guards (Auth, Multer, blockIfAuthenticated, etc.)
│       ├── model/                # Mongoose schemas
│       ├── routers/              # API route definitions
│       ├── utills/               # Helper utilities
│       ├── app.js                # Express app setup & CORS config
│       └── server.js             # Application entry point
│
└── frolic/my-app/                # React 19 + Vite Client
    ├── public/                   # Public static assets
    └── src/
        ├── api/                  # Axios interceptors & network logic
        ├── assets/               # Local images & svgs
        ├── components/           # Reusable UI components
        │   ├── pages/            # View-level components (Dashboards, Tables, etc.)
        │   └── ui/               # shadcn/ui primitives
        ├── constants/            # Application constants (URL, Enums)
        ├── data/                 # Mock data & statics
        ├── helpers/              # Frontend utilities
        ├── hooks/                # Custom React Hooks
        ├── lib/                  # Library configs (Tailwind `cn` utility)
        ├── services/             # API wrapper functions
        ├── store/                # Zustand global stores (`useAuthStore`)
        ├── types/                # TypeScript type definitions
        ├── App.tsx               # Root Component
        ├── index.css             # Tailwind v4 directives & Global CSS
        └── main.tsx              # React DOM mounting & Router configuration
```

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19, React Router DOM v7
- **Build Tool:** Vite (Rolldown)
- **Styling:** Tailwind CSS v4, shadcn/ui, Framer Motion
- **State Management:** Zustand (Global), TanStack React Query v5 (Server State)
- **Forms & Validation:** React Hook Form, Zod
- **Icons & Visuals:** Lucide React, Recharts

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB via Mongoose v9
- **Security:** bcrypt, jsonwebtoken (JWT), cookie-parser, CORS
- **File Uploads:** Multer, Cloudinary

---

## 🗄️ Database Overview

The MongoDB database maintains relationships through the following Mongoose schemas:

1. **`Users`**: Stores credentials, roles (`isAdmin`, `isCordinator`), coordinator scopes, and refresh tokens.
2. **`Institutes`**: Defines parent organizations.
3. **`Department`**: Links to an Institute and managed by a specific Coordinator.
4. **`Events`**: Links to a Department. Stores event metadata, rules, dates, media URLs, and group size constraints.
5. **`Participant`**: Represents an individual user's registration for an event.
6. **`Groups`**: Handles team registrations, linking a leader and multiple participants to a specific event.
7. **`EventWinners`**: Records event outcomes and ranking positions.

---

## 🔒 Authentication / Authorization

The system relies on a highly secure, stateless JWT architecture:

1. **Access Token:** Short-lived token used for verifying API requests.
2. **Refresh Token:** Long-lived token stored securely in an `httpOnly` cookie.
3. **Smart Middleware (`refreshIfExpired`):** Intercepts requests with expired access tokens, seamlessly exchanging the valid refresh token cookie for a new access token without logging the user out.
4. **Role Guards (`requireAuth`):** Validates the `isAdmin` or `isCordinator` flags on the `User` document before granting access to protected routes.

---

## 🔌 API Overview

### `User Routes` (`/user`)
- `POST /register`: Account creation
- `POST /login`: Authenticate and issue cookies
- `GET /me`: Fetch current authenticated user
- `POST /refresh`: Manual token refresh
- `PATCH /updateUser`: Modify profile
- `POST /avatar`: Upload to Cloudinary

### `Admin Routes` (`/admin`)
- Handles extensive CRUD operations for `Users`, `Events`, `Institutes`, and `Departments`.
- `GET /dashboard-stats`: Aggregates system metrics.
- `POST /winners/:eventId`: Declare event victors.
- `PATCH /updateUserRole/:userid`: Escalate/de-escalate privileges.

### `Event Routes` (`/api/events`)
- `GET /all`: Publicly viewable event lists.
- `POST /` / `PUT /:eventId` / `DELETE /:eventId`: Protected event management with image upload support.

### `Participant Routes` (`/api/participants`)
- `POST /register`: Registers an individual or group for a specific event.

---

## ⚙️ Environment Variables

### Backend (`c:\Wt2project\backend\.env`)
```env
PORT=5000
CORS_ORIGIN=https://frolic-2026-hksi.vercel.app
MONGO_URI=mongodb+srv://<user>:<password>@cluster...
ACCESS_TOKEN_SECRET=...
ACCESS_TOKEN_EXPIRY=...
REFRESH_TOKEN_SECRET=...
REFRESH_TOKEN_EXPIRY=...
ADMIN_PASS=...
ADMIN_EMAIL=...
CLOUD_NAME=...
CLOUD_API_KEY=...
CLOUD_API_SECRET=...
CLOUDINARY_URL=...
NODE_ENV=production
```

### Frontend (`c:\Wt2project\frolic\my-app\.env`)
```env
VITE_API_URL=https://frolic-backend-8qmc.onrender.com
```

---

## 🛠️ Development & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Cluster
- Cloudinary Account

### 1. Backend Setup
```bash
cd backend
npm install
# Configure your .env file
npm run dev # Starts the nodemon development server
```

### 2. Frontend Setup
```bash
cd frolic/my-app
npm install
# Configure your .env file
npm run dev # Starts the Vite development server
```

### Deployment Notes
- **Frontend** is configured for deployment on Vercel (includes `vercel.json`).
- **Backend** is configured for deployment on platforms like Render or Railway. Ensure CORS origins are strictly matching your frontend deployment URLs.
