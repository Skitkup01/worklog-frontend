import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, FileText, Bell, BarChart3, User,
  Settings, Power, CheckCircle2, Clock, XCircle, PieChart,
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

  const formatDateThai = (date, withTime = true) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d)) return "-";
    return d.toLocaleString("th-TH", {
      year: "numeric", month: "long", day: "numeric",
      ...(withTime && { hour: "2-digit", minute: "2-digit" }),
    });
  };

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
          padding: 20px;
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
          text-align: center;
        }
        .user-card h2 { margin-bottom: 8px; font-size: 1.3rem; }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }
        .stat-card {
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: 0.2s;
        }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-card h4 {
          margin-bottom: 6px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .stat-card p { font-size: 1.3rem; margin: 0; }

        .approved { background: #eafaf1; color: #27ae60; }
        .pending { background: #fff6e5; color: #e67e22; }
        .rejected { background: #fdecea; color: #c0392b; }
        .total { background: #e8f0fe; color: #1a73e8; }

        .card {
          background: white;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          overflow-x: auto; /* ✅ ตารางเลื่อนได้บนมือถือ */
        }
        .card h3 {
          margin-bottom: 12px;
          color: #4e4cb8;
          border-left: 5px solid #6c63ff;
          padding-left: 8px;
          font-size: 1.1rem;
        }

        .log-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .log-table th,
        .log-table td {
          padding: 10px;
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
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.8em;
          font-weight: 600;
          display: inline-block;
          min-width: 70px;
        }
        .status-badge.approved { background: #27ae60; color: #fff; }
        .status-badge.pending { background: #f39c12; color: #fff; }
        .status-badge.rejected { background: #c0392b; color: #fff; }

        .no-data {
          text-align: center;
          color: #777;
          padding: 12px;
        }

        /* ✅ Responsive */
        @media (max-width: 768px) {
          .dashboard { padding: 15px; }
          .user-card h2 { font-size: 1.1rem; }
          .stat-card h4 { font-size: 0.85rem; }
          .stat-card p { font-size: 1.1rem; }
          .card h3 { font-size: 1rem; }
        }

        @media (max-width: 480px) {
          .user-card { padding: 15px; }
          .stat-grid { grid-template-columns: 1fr 1fr; }
          .log-table th, .log-table td { padding: 6px; font-size: 0.75rem; }
          .status-badge { font-size: 0.7em; min-width: 60px; }
        }
      `}</style>

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
