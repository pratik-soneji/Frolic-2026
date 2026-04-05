import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import RegisterPage from "./components/pages/SignUp";
import Login from "./components/pages/Login";
import Navbar from "./components/Navbar";
import FindItLanding from "./components/pages/tasks";
import AdminDashboard from "./components/pages/AdminDashboard";
import UsersTable from "./components/UserTable";
import EventsTable from "./components/EventTable";
import InstituteTable from "./components/InstituteTable";
import DepartmentTable from "./components/DepartmentTable";
import EventPreviewPage from "./components/pages/admin/EventPreviewPage";
import ParticipantsTable from "./components/ParticipantsTable";

import EventDetailsUser from "./components/pages/EventDetailsUser";
import AdminDashboardOverview from "./components/pages/AdminDashboardOverview";
import WinnersTable from "./components/WinnersTable";

const queryClient = new QueryClient();

// Apply saved theme before first render to avoid flash
;(() => {
  const stored = localStorage.getItem("frolic-theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const isDark = stored === "dark" || (!stored && prefersDark) || (!stored && true)
  if (isDark) document.documentElement.classList.add("dark")
  else document.documentElement.classList.remove("dark")
})()

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />}>
            <Route path="" element={<Navbar />} />
          </Route>
          <Route path="/events/:eventId" element={<div className="min-h-screen bg-background"><Navbar /><EventDetailsUser /></div>} />
          
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="" element={<AdminDashboardOverview />} />
            <Route path="users" element={<UsersTable />} />
            <Route path="events" element={<EventsTable />} />
            <Route path="events/:eventId" element={<EventPreviewPage />} />
            <Route path="institutes" element={<InstituteTable />} />
            <Route path="departments" element={<DepartmentTable />} />
            <Route path="participants" element={<ParticipantsTable />} />
            <Route path="winners" element={<WinnersTable />} />
          </Route>
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/task" element={<FindItLanding />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
