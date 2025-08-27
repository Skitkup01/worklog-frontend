import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import DailyLogs from "./DailyLogs";
import DailyLogStatus from "./DailyLogStatus";
import StudentReport from "./pages/StudentReport";
import AdminDailyLogs from "./AdminDailyLogs";
import AdminStudentReport from "./pages/AdminStudentReport"; 
import Profile from "./Profile";

import NavBar from "./NavBar";
import NavBarAdmin from "./NavBarAdmin";
import LoadingScreenNew from "./LoadingScreenNew"; // ✅ loader ใหม่ (รีเฟรช)

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5001/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(() => localStorage.removeItem("token"))
        .finally(() => {
          setTimeout(() => setLoading(false), 2000); // ดีเลย์แมว 2 วิ
        });
    } else {
      setTimeout(() => setLoading(false), 2000);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === "admin") {
      navigate("/admin-daily-logs");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ รีเฟรชใช้แมวใหม่
  if (loading) return <LoadingScreenNew />;

  return (
    <div>
      {user && user.role === "admin" ? (
        <div className="no-print">
          <NavBarAdmin onLogout={handleLogout} />
        </div>
      ) : (
        <div className="no-print">
          <NavBar user={user} onLogout={handleLogout} />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/daily-logs" element={user ? <DailyLogs /> : <Navigate to="/login" />} />
        <Route path="/daily-log-status" element={user ? <DailyLogStatus /> : <Navigate to="/login" />} />
        <Route path="/admin-daily-logs" element={user && user.role === "admin" ? <AdminDailyLogs /> : <Navigate to="/login" />} />
        <Route path="/student-report" element={<StudentReport />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/admin-student-report" element={user && user.role === "admin" ? <AdminStudentReport /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
);
