import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DailyLogStatus.css"; 
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

export default function DailyLogStatus() {
  const [logs, setLogs] = useState([]);
  const [err, setErr] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editActivity, setEditActivity] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // โหลดข้อมูล
  const fetchLogs = () => {
    fetch("http://localhost:5001/api/daily-logs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setLogs(data.logs))
      .catch(() => setErr("โหลดข้อมูลไม่สำเร็จ"));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // จัดการสถานะสี
  const getStatusClass = (status) => {
    switch (status?.toLowerCase().trim()) {
      case "approved":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  // แปลงเวลาไทย
  const formatDateTimeThai = (dateString) => {
    return new Date(dateString).toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // แก้ไข
  const startEdit = (log) => {
    setEditingId(log.log_id);
    setEditActivity(log.activity);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditActivity("");
  };

  const saveEdit = (id) => {
    fetch(`http://localhost:5001/api/daily-logs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activity: editActivity }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(() => {
        cancelEdit();
        fetchLogs();
      })
      .catch(() => alert("❌ แก้ไขไม่สำเร็จ"));
  };

  return (
    <div className="dailylogstatus-container fade-in">
      <h2 className="page-title">📋 สถานะการบันทึกงาน</h2>
      {err && <p className="error-text">{err}</p>}

      {logs.length === 0 ? (
        <p className="no-data">ยังไม่มีบันทึกงาน</p>
      ) : (
        <>
          {/* ✅ Table สำหรับ Desktop */}
          <div className="table-wrapper">
            <table className="log-table">
              <thead>
                <tr>
                  <th>วันที่บันทึก</th>
                  <th>รายละเอียด</th>
                  <th>สถานะ</th>
                  <th>ผู้ตรวจ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.log_id}>
                    <td>{formatDateTimeThai(log.created_at)}</td>
                    <td>
                      {editingId === log.log_id ? (
                        <input
                          type="text"
                          value={editActivity}
                          onChange={(e) => setEditActivity(e.target.value)}
                        />
                      ) : (
                        log.activity
                      )}
                    </td>
                    <td>
                      <span className={getStatusClass(log.status)}>
                        {log.status?.toLowerCase().trim() === "approved" && (
                          <>
                            <FaCheckCircle /> อนุมัติแล้ว
                          </>
                        )}
                        {log.status?.toLowerCase().trim() === "pending" && (
                          <>
                            <FaHourglassHalf /> รออนุมัติ
                          </>
                        )}
                        {log.status?.toLowerCase().trim() === "rejected" && (
                          <>
                            <FaTimesCircle /> ถูกปฏิเสธ
                          </>
                        )}
                      </span>
                    </td>
                    <td>{log.approved_by || "-"}</td>
                    <td>
                      {editingId === log.log_id ? (
                        <>
                          <button
                            className="btn-save"
                            onClick={() => saveEdit(log.log_id)}
                          >
                            บันทึก
                          </button>
                          <button className="btn-cancel" onClick={cancelEdit}>
                            ยกเลิก
                          </button>
                        </>
                      ) : (
                        log.status?.toLowerCase().trim() === "pending" && (
                          <button
                            className="btn-edit"
                            onClick={() => startEdit(log)}
                          >
                            แก้ไข
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Card สำหรับ Mobile */}
          <div className="log-cards">
            {logs.map((log) => (
              <div key={log.log_id} className="log-card">
                <p><strong>📅 วันที่:</strong> {formatDateTimeThai(log.created_at)}</p>
                <p><strong>📝 รายละเอียด:</strong>{" "}
                  {editingId === log.log_id ? (
                    <input
                      type="text"
                      value={editActivity}
                      onChange={(e) => setEditActivity(e.target.value)}
                    />
                  ) : (
                    log.activity
                  )}
                </p>
                <p>
                  <strong>📌 สถานะ:</strong>{" "}
                  <span className={getStatusClass(log.status)}>
                    {log.status}
                  </span>
                </p>
                <p><strong>👤 ผู้ตรวจ:</strong> {log.approved_by || "-"}</p>
                <div className="card-buttons">
                  {editingId === log.log_id ? (
                    <>
                      <button className="btn-save" onClick={() => saveEdit(log.log_id)}>บันทึก</button>
                      <button className="btn-cancel" onClick={cancelEdit}>ยกเลิก</button>
                    </>
                  ) : (
                    log.status?.toLowerCase().trim() === "pending" && (
                      <button className="btn-edit" onClick={() => startEdit(log)}>แก้ไข</button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
