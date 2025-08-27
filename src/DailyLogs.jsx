import React, { useState, useEffect } from "react";
import { API_URL } from "./config";
import "./DailyLogs.css";

export default function DailyLogs() {
  const [logDate, setLogDate] = useState("");
  const [activity, setActivity] = useState("");
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // คำนวณวันที่วันนี้ในรูปแบบ YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/daily-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs);
      } else {
        setError(data.error);
      }
    } catch {
      setError("เชื่อมต่อ server ไม่ได้");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/daily-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ log_date: logDate, activity })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setLogDate("");
        setActivity("");
        fetchLogs();
      } else {
        setError(data.error);
      }
    } catch {
      setError("เชื่อมต่อ server ไม่ได้");
    }
  };

  return (
    <div className="dailylogs-container fade-in">
      <h2 className="page-title">📅 บันทึกงานประจำวัน</h2>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <form onSubmit={handleSubmit} className="form-card pop-up">
        <label>วันที่</label>
        <input
          type="date"
          value={logDate}
          onChange={(e) => setLogDate(e.target.value)}
          max={today} // จำกัดให้เลือกได้ไม่เกินวันนี้
          required
        />
        <label>กิจกรรม</label>
        <textarea
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          required
        />
        <button className="btn-submit">บันทึก</button>
      </form>
    </div>
  );
}
