import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import {
  Home,
  FileText,
  Bell,
  BarChart3,
  User,
  Settings,
  Power,
  Menu,
  X,
} from "lucide-react";
import totoroWalk from "./assets/Totoro.json";
import "./NavBar.css";

export default function NavBar({ user, onLogout }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav">
      <div className="container">
        {/* โลโก้ */}
        <span className="logo">
          <span className="logoIcon">
            <FileText size={20} />
          </span>
          WorkLog
        </span>

        {/* 🐱 Totoro เดินไปมา */}
        <div className="totoro-walk">
          <Lottie animationData={totoroWalk} loop={true} />
        </div>

        {/* ปุ่ม Hamburger (มือถือ) */}
        <div className="hamburger" onClick={() => setOpen(!open)}>
          {open ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
        </div>

        {/* เมนูหลัก */}
        <div className={`menu ${open ? "show" : ""}`}>
          <Link
            className={`navLink ${isActive("/dashboard") ? "active" : ""}`}
            to="/dashboard"
            onClick={() => setOpen(false)}
          >
            <Home size={18} className="icon home" /> หน้าหลัก
          </Link>

          <Link
            className={`navLink ${isActive("/daily-logs") ? "active" : ""}`}
            to="/daily-logs"
            onClick={() => setOpen(false)}
          >
            <FileText size={18} className="icon logs" /> บันทึกงาน
          </Link>

          <Link
            className={`navLink ${isActive("/daily-log-status") ? "active" : ""}`}
            to="/daily-log-status"
            onClick={() => setOpen(false)}
          >
            <Bell size={18} className="icon status" /> สถานะ
          </Link>

          <Link
            className={`navLink ${isActive("/student-report") ? "active" : ""}`}
            to="/student-report"
            onClick={() => setOpen(false)}
          >
            <BarChart3 size={18} className="icon report" /> รายงาน
          </Link>

          <Link
            className={`navLink ${isActive("/profile") ? "active" : ""}`}
            to="/profile"
            onClick={() => setOpen(false)}
          >
            <User size={18} className="icon profile" /> โปรไฟล์
          </Link>

          {user?.role === "admin" && (
            <Link
              className={`navLink ${isActive("/admin-daily-logs") ? "active" : ""}`}
              to="/admin-daily-logs"
              onClick={() => setOpen(false)}
            >
              <Settings size={18} className="icon admin" /> จัดการ
            </Link>
          )}

          <button className="logoutBtn" onClick={onLogout}>
            <Power size={18} className="icon logout" /> ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>
  );
}
