import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
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
const queryClient = new QueryClient();
ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="" element={<Navbar />} />
          </Route>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="" element={<UsersTable />} />
            <Route path="events" element={<EventsTable />} />
            <Route path="institutes" element={<InstituteTable />} />
            <Route path="departments" element={<DepartmentTable />} />

          </Route>
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/task" element={<FindItLanding />} />
        </Routes>

      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
