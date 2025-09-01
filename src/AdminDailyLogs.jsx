import React, { useState, useEffect } from "react";
import "./AdminDailyLogs.css";

export default function AdminDailyLogs() {
  const [logs, setLogs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchUniversity, setSearchUniversity] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [approverName, setApproverName] = useState("");
  const token = localStorage.getItem("token");

  const fetchLogs = () => {
    let url = "http://localhost:5001/api/daily-logs-all";
    const params = [];
    if (searchDate) params.push(`date=${searchDate}`);
    if (searchName) params.push(`name=${encodeURIComponent(searchName)}`);
    if (searchUniversity) params.push(`university=${encodeURIComponent(searchUniversity)}`);
    if (searchStatus) params.push(`status=${searchStatus}`);
    if (params.length) url += `?${params.join("&")}`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        const sortedLogs = (data.logs || []).sort(
          (a, b) => new Date(b.log_date) - new Date(a.log_date)
        );
        setLogs(sortedLogs);
        setUniversities(data.universities || []);
      })
      .catch(() => setError("⚠️ โหลดข้อมูลไม่สำเร็จ"));
  };

  useEffect(() => {
    fetchLogs();
  }, [searchDate, searchName, searchUniversity, searchStatus]);

  const updateStatus = (id, status) => {
    if (!approverName.trim()) {
      alert("⚠️ กรุณากรอกชื่อผู้อนุมัติก่อน");
      return;
    }

    fetch(`http://localhost:5001/api/daily-logs/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, approved_by: approverName })
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(() => {
        setLogs(prevLogs =>
          prevLogs.map(log =>
            log.log_id === id
              ? { ...log, status, approved_by: approverName, updated_at: new Date().toISOString() }
              : log
          )
        );
      })
      .catch(() => alert("❌ อัปเดตสถานะไม่สำเร็จ"));
  };

  const statusLabel = (status) => {
    switch (status) {
      case "approved": return <span className="status approved">✅ อนุมัติแล้ว</span>;
      case "pending": return <span className="status pending">⏳ รออนุมัติ</span>;
      case "rejected": return <span className="status rejected">❌ ปฏิเสธ</span>;
      default: return status;
    }
  };

  const formatDateThai = (date) =>
    date ? new Date(date).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }) : "-";

  const formatTimeThai = (date) =>
    date ? new Date(date).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="admin-page">
      <h2 className="title">จัดการบันทึกงานนักศึกษา</h2>

      <div className="filter-row">
        <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="input" />
        <input type="text" placeholder="ค้นหาชื่อผู้บันทึก" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="input" />
        <select value={searchUniversity} onChange={(e) => setSearchUniversity(e.target.value)} className="input">
          <option value="">-- เลือกมหาวิทยาลัยทั้งหมด --</option>
          {universities.length > 0 ? (
            universities.map((u, idx) => <option key={idx} value={u}>{u}</option>)
          ) : (
            <option disabled>ไม่มีข้อมูลมหาวิทยาลัย</option>
          )}
        </select>
        <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)} className="input">
          <option value="">-- เลือกสถานะทั้งหมด --</option>
          <option value="pending">⏳ รออนุมัติ</option>
          <option value="approved">✅ อนุมัติแล้ว</option>
          <option value="rejected">❌ ปฏิเสธ</option>
        </select>

        <div className="approver-box">
          <label className="approver-label">👤 ผู้อนุมัติ</label>
          <input
            type="text"
            placeholder="กรอกชื่อผู้อนุมัติ"
            value={approverName}
            onChange={(e) => setApproverName(e.target.value)}
            className="input approver-input"
          />
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Table สำหรับ Desktop */}
      <div className="table-wrapper">
        <table className="table desktop-only">
          <thead>
            <tr>
              <th>วันที่ทำกิจกรรม</th>
              <th>อัปเดตล่าสุด</th>
              <th>กิจกรรม</th>
              <th>ผู้บันทึก</th>
              <th>มหาวิทยาลัย</th>
              <th>สถานะ</th>
              <th>ผู้อนุมัติ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map(log => (
                <tr key={log.log_id} className={log.status}>
                  <td>{formatDateThai(log.log_date)}</td>
                  <td>{formatDateThai(log.updated_at)} {formatTimeThai(log.updated_at)}</td>
                  <td>{log.activity}</td>
                  <td>{log.fullname}</td>
                  <td>{log.university || "-"}</td>
                  <td>{statusLabel(log.status)}</td>
                  <td>{log.approved_by || "-"}</td>
                  <td>
                    <button onClick={() => updateStatus(log.log_id, "approved")} className={`btn approve ${log.status === "approved" ? "active" : ""}`} disabled={log.status === "approved"}>อนุมัติ</button>
                    <button onClick={() => updateStatus(log.log_id, "rejected")} className={`btn reject ${log.status === "rejected" ? "active" : ""}`} disabled={log.status === "rejected"}>ปฏิเสธ</button>
                    <button onClick={() => updateStatus(log.log_id, "pending")} className={`btn pending ${log.status === "pending" ? "active" : ""}`} disabled={log.status === "pending"}>รออนุมัติ</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" style={{ textAlign: "center", padding: "15px" }}>ไม่มีข้อมูล</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card View สำหรับ Mobile */}
      <div className="log-cards mobile-only">
        {logs.length > 0 ? logs.map(log => (
          <div key={log.log_id} className="log-card">
            <p><strong>📅 วันที่:</strong> {formatDateThai(log.log_date)}</p>
            <p><strong>📝 กิจกรรม:</strong> {log.activity}</p>
            <p><strong>👤 ผู้บันทึก:</strong> {log.fullname}</p>
            <p><strong>🏫 มหาวิทยาลัย:</strong> {log.university || "-"}</p>
            <p><strong>📌 สถานะ:</strong> {statusLabel(log.status)}</p>
            <p><strong>✔ ผู้อนุมัติ:</strong> {log.approved_by || "-"}</p>
            <div className="card-buttons">
              <button onClick={() => updateStatus(log.log_id, "approved")} className="btn approve" disabled={log.status === "approved"}>อนุมัติ</button>
              <button onClick={() => updateStatus(log.log_id, "rejected")} className="btn reject" disabled={log.status === "rejected"}>ปฏิเสธ</button>
              <button onClick={() => updateStatus(log.log_id, "pending")} className="btn pending" disabled={log.status === "pending"}>รออนุมัติ</button>
            </div>
          </div>
        )) : <p style={{ textAlign: "center" }}>ไม่มีข้อมูล</p>}
      </div>
    </div>
  );
}
