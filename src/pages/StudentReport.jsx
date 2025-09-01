import React, { useState, useEffect } from "react";
import "./StudentReport.css";

export default function StudentReport() {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const token = localStorage.getItem("token");

  const fetchReports = () => {
    if (!token) return;
    setLoading(true);

    let url = "http://localhost:5001/api/student-report";
    const params = [];
    if (searchDate) params.push(`date=${searchDate}`);
    if (searchKeyword) params.push(`keyword=${encodeURIComponent(searchKeyword)}`);
    if (params.length) url += `?${params.join("&")}`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setSummary(data.summary);
        setLogs(
          (data.logs || []).sort(
            (a, b) => new Date(b.log_date) - new Date(a.log_date)
          )
        );
      })
      .catch(() => setError("โหลดข้อมูลไม่สำเร็จ"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, [searchDate, searchKeyword]);

  const handlePrint = () => window.print();

  const formatDateThai = (date) =>
    new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const translateStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "อนุมัติ";
      case "pending":
        return "รออนุมัติ";
      case "rejected":
        return "ปฏิเสธ";
      default:
        return status || "-";
    }
  };

  if (!token) return <p>กรุณาเข้าสู่ระบบก่อน</p>;

  return (
    <div className="report-container fade-in">
      <h2 className="page-title no-print">📊 รายงานบันทึกงานนักศึกษา</h2>

      {/* 🔍 Filter → ซ่อนตอน print */}
      <div className="filter-bar no-print">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="🔍 ค้นหากิจกรรม"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={handlePrint} className="btn-print">
          🖨️ ปริ้นรายงาน
        </button>
      </div>

      {loading && <p>⏳ กำลังโหลด...</p>}
      {error && <p className="error-text">{error}</p>}

      {/* 📊 Summary Cards → ซ่อนตอน print */}
      {summary && (
        <div className="summary-cards no-print">
          <div className="card approved">
            <h4>อนุมัติ</h4>
            <p>{summary.approved}</p>
          </div>
          <div className="card rejected">
            <h4>ปฏิเสธ</h4>
            <p>{summary.rejected}</p>
          </div>
          <div className="card pending">
            <h4>รออนุมัติ</h4>
            <p>{summary.pending}</p>
          </div>
          <div className="card total">
            <h4>รวมทั้งหมด</h4>
            <p>{summary.total}</p>
          </div>
        </div>
      )}

      {/* ✅ Table (ไม่ซ่อนตอน print) */}
      <h3>📜 รายละเอียดบันทึกงาน</h3>
      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>วันที่ทำกิจกรรม</th>
              <th>รหัสนักศึกษา</th>
              <th>ชื่อผู้บันทึก</th>
              <th>กิจกรรม</th>
              <th>สถานะ</th>
              <th>ผู้ตรวจ</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <tr key={idx}>
                  <td>{formatDateThai(log.log_date)}</td>
                  <td>{log.student_code || "-"}</td>
                  <td>{log.fullname || "-"}</td>
                  <td>{log.activity}</td>
                  <td>
                    <span
                      className={`status-badge status-${log.status?.toLowerCase()}`}
                    >
                      {translateStatus(log.status)}
                    </span>
                  </td>
                  <td>{log.approved_by || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
