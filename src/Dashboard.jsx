import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Bell,
  BarChart3,
  User,
  Settings,
  Power,
  CheckCircle2,
  Clock,
  XCircle,
  PieChart,
} from "lucide-react";

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5001/api/student-report", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setSummary(data.summary);
        setRecentLogs(data.logs.slice(0, 5));
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const lastSeen = localStorage.getItem("dashboardGuideLastSeen");
    const oneHour = 60 * 60 * 1000;
    if (!lastSeen || Date.now() - parseInt(lastSeen, 10) > oneHour) {
      setShowGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    localStorage.setItem("dashboardGuideLastSeen", Date.now().toString());
    setShowGuide(false);
  };

  // ✅ ฟังก์ชันแสดงวันที่
  const formatDateThai = (date, withTime = true) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d.toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(withTime && { hour: "2-digit", minute: "2-digit" }),
    });
  };

  // ✅ ฟังก์ชันแปลงสถานะเป็นภาษาไทย
  const translateStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "approved": return "อนุมัติ";
      case "pending": return "รออนุมัติ";
      case "rejected": return "ปฏิเสธ";
      default: return status;
    }
  };

  return (
    <div className="dashboard fade-in">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.6s ease-in-out; }

        .dashboard {
          max-width: 1100px;
          margin: auto;
          padding: 25px;
          font-family: "Segoe UI", Tahoma, sans-serif;
          color: #333;
        }

        .user-card {
          background: #6c63ff;
          padding: 20px;
          border-radius: 12px;
          color: white;
          margin-bottom: 25px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        }
        .user-card h2 { margin-bottom: 8px; }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: 0.2s;
        }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-card h4 {
          margin-bottom: 6px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .stat-card p { font-size: 1.5rem; margin: 0; }

        .approved { background: #eafaf1; color: #27ae60; }
        .pending { background: #fff6e5; color: #e67e22; }
        .rejected { background: #fdecea; color: #c0392b; }
        .total { background: #e8f0fe; color: #1a73e8; }

        .card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .card h3 {
          margin-bottom: 15px;
          color: #4e4cb8;
          border-left: 5px solid #6c63ff;
          padding-left: 10px;
          font-size: 1.3rem;
        }

        .log-table {
          width: 100%;
          border-collapse: collapse;
        }
        .log-table th,
        .log-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
          text-align: center;
          color: #333;
        }
        .log-table th {
          background: #6c63ff;
          color: white;
          font-weight: bold;
        }
        .log-table tr:hover td {
          background: #f8faff;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 6px;
          color: #fff !important;
          font-size: 0.9em;
          font-weight: 600;
          display: inline-block;
          min-width: 80px;
        }
        .status-badge.approved { background: #27ae60; }
        .status-badge.pending { background: #f39c12; }
        .status-badge.rejected { background: #c0392b; }

        .no-data {
          text-align: center;
          color: #777;
          padding: 15px;
        }

        .overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 200;
        }
        .modal {
          background: #fff;
          padding: 25px 30px;
          border-radius: 15px;
          max-width: 420px;
          width: 90%;
          text-align: left;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: popIn 0.35s ease;
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .closeBtn {
          margin-top: 15px;
          padding: 10px 15px;
          background: linear-gradient(90deg, #6c63ff, #4e4cb8);
          border: none;
          color: #fff;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
        }
      `}</style>

      {/* Popup Guide */}
      {showGuide && (
        <div className="overlay">
          <div className="modal">
            <h2>📖 วิธีใช้เมนูหลัก</h2>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
              <li><Home size={16} style={{ marginRight: 6, color: "#3b82f6" }} /> หน้าหลัก: สรุปข้อมูลและบันทึกล่าสุด</li>
              <li><FileText size={16} style={{ marginRight: 6, color: "#10b981" }} /> บันทึกงาน: เพิ่ม/แก้ไขบันทึกประจำวัน</li>
              <li><Bell size={16} style={{ marginRight: 6, color: "#f59e0b" }} /> สถานะ: ติดตามสถานะการอนุมัติ</li>
              <li><BarChart3 size={16} style={{ marginRight: 6, color: "#8b5cf6" }} /> รายงาน: ดูสถิติรวมของงาน</li>
              <li><User size={16} style={{ marginRight: 6, color: "#fb923c" }} /> โปรไฟล์: จัดการข้อมูลส่วนตัว</li>
              {user.role === "admin" && (
                <li><Settings size={16} style={{ marginRight: 6, color: "#ec4899" }} /> จัดการ: สำหรับผู้ดูแล ตรวจสอบ/อนุมัติบันทึก</li>
              )}
              <li><Power size={16} style={{ marginRight: 6, color: "#ef4444" }} /> ออกจากระบบ</li>
            </ul>
            <button className="closeBtn" onClick={handleCloseGuide}>
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="user-card">
        <h2>👋 สวัสดี {user.fullname}</h2>
        <p>รหัสนักศึกษา: <strong>{user.student_code || "-"}</strong></p>
        <p>บทบาท: <strong>{user.role}</strong></p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="stat-grid">
          <StatCard title="อนุมัติ" value={summary.approved} color="approved" icon={<CheckCircle2 />} />
          <StatCard title="รออนุมัติ" value={summary.pending} color="pending" icon={<Clock />} />
          <StatCard title="ปฏิเสธ" value={summary.rejected} color="rejected" icon={<XCircle />} />
          <StatCard title="ทั้งหมด" value={summary.total} color="total" icon={<PieChart />} />
        </div>
      )}

      {/* Recent Logs */}
      <div className="card">
        <h3>🕒 บันทึกล่าสุด</h3>
        <table className="log-table">
          <thead>
            <tr>
              <th>วันที่ทำกิจกรรม</th>
              <th>บันทึกเมื่อ</th>
              <th>กิจกรรม</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.length > 0 ? (
              recentLogs.map((log, idx) => (
                <tr key={idx}>
                  <td>{formatDateThai(log.log_date, false)}</td>
                  <td>{formatDateThai(log.created_at, true)}</td>
                  <td>{log.activity}</td>
                  <td>
                    <span className={`status-badge ${log.status?.toLowerCase()}`}>
                      {translateStatus(log.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">ไม่มีข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div className={`stat-card ${color}`}>
      <h4>
        {icon} {title}
      </h4>
      <p>{value}</p>
    </div>
  );
}
