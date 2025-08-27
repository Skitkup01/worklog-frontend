import React, { useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import { FileText, FileSpreadsheet, Power } from "lucide-react"; // ✅ ใช้ icon
import totoroWalk from "./assets/Totoro.json";
import "./NavBarAdmin.css";

export default function NavBarAdmin({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const fullname = localStorage.getItem("fullname") || "Admin";

  return (
    <nav className="nav">
      <div className="container">
        {/* ซ้ายสุด: Totoro + ข้อความ */}
        <div className="left">
          <div className="totoro-walk">
            <Lottie animationData={totoroWalk} loop={true} />
          </div>
          <div className="brand">
            <h1>ระบบจัดการบันทึกงาน</h1>
            <p className="welcome">สวัสดี, {fullname}</p>
          </div>
        </div>

        {/* ปุ่ม hamburger (มือถือ) */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* เมนู */}
        <div className={`links ${menuOpen ? "open" : ""}`}>
          <Link
            className="navBtn primary"
            to="/admin-daily-logs"
            onClick={() => setMenuOpen(false)}
          >
            <FileText size={18} className="icon" /> จัดการบันทึกงาน
          </Link>

          <Link
            className="navBtn primary"
            to="/admin-student-report"
            onClick={() => setMenuOpen(false)}
          >
            <FileSpreadsheet size={18} className="icon" /> รายงานนักศึกษา
          </Link>

          <button className="navBtn danger" onClick={onLogout}>
            <Power size={18} className="icon" /> ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>
  );
}
