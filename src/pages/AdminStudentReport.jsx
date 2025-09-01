import React, { useState, useEffect } from "react";
import "./AdminStudentReport.css";

export default function AdminStudentReport() {
  const [reports, setReports] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchStudentCode, setSearchStudentCode] = useState("");
  const [searchUniversity, setSearchUniversity] = useState("");
  const token = localStorage.getItem("token");

  // โหลดข้อมูลรายงาน + มหาวิทยาลัย
  const fetchReports = () => {
    let url = "http://localhost:5001/api/admin/student-report";
    const params = [];
    if (searchDate) params.push(`date=${searchDate}`);
    if (searchName) params.push(`name=${encodeURIComponent(searchName)}`);
    if (searchStudentCode) params.push(`student_code=${encodeURIComponent(searchStudentCode)}`);
    if (searchUniversity) params.push(`university=${encodeURIComponent(searchUniversity)}`);
    if (params.length) url += `?${params.join("&")}`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setReports(data.reports || []);
        setUniversities(data.universities || []);
      })
      .catch(() => setError("โหลดข้อมูลไม่สำเร็จ"));
  };

  useEffect(() => { fetchReports(); }, []);
  useEffect(() => { fetchReports(); }, [searchDate, searchName, searchStudentCode, searchUniversity]);

  // ✅ ปริ้น
  const handlePrint = () => {
    window.print();
  };

  const formatDateThai = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ✅ ฟังก์ชันแปลงสถานะเป็นไทย
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

  return (
    <div className="admin-page">
      <h2 className="title no-print">📊 รายงานบันทึกงานนักศึกษา (Admin)</h2>

      {/* ฟิลเตอร์ */}
      <div className="filter-row no-print">
        <input
          type="date"
          className="input"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <input
          type="text"
          className="input"
          placeholder="ค้นหาชื่อผู้บันทึก"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          className="input"
          placeholder="ค้นหารหัสนักศึกษา"
          value={searchStudentCode}
          onChange={(e) => setSearchStudentCode(e.target.value)}
        />

        <select
          className="input"
          value={searchUniversity}
          onChange={(e) => setSearchUniversity(e.target.value)}
        >
          <option value="">-- เลือกมหาวิทยาลัยทั้งหมด --</option>
          {universities.length > 0 ? (
            universities.map((u, idx) => (
              <option key={idx} value={u}>{u}</option>
            ))
          ) : (
            <option disabled>ไม่มีข้อมูล</option>
          )}
        </select>

        <button className="btn print" onClick={handlePrint}>🖨️ ปริ้นรายงาน</button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* ✅ ตารางสรุป (Desktop) */}
      <div className="table-wrapper no-print">
        <table className="table">
          <thead>
            <tr>
              <th>ชื่อนักศึกษา</th>
              <th>รหัสนักศึกษา</th>
              <th>มหาวิทยาลัย</th>
              <th>อนุมัติ</th>
              <th>ปฏิเสธ</th>
              <th>รออนุมัติ</th>
              <th>รวมทั้งหมด</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((r, index) => (
                <tr key={index}>
                  <td>{r.fullname}</td>
                  <td>{r.student_code}</td>
                  <td>{r.university}</td>
                  <td><span className="status-number green">{r.approved}</span></td>
                  <td><span className="status-number red">{r.rejected}</span></td>
                  <td><span className="status-number yellow">{r.pending}</span></td>
                  <td>{r.total}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7">ไม่มีข้อมูล</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Card View (Mobile) */}
      <div className="card-list no-print">
        {reports.length > 0 ? (
          reports.map((r, index) => (
            <div key={index} className="card-report">
              <p><strong>👤 ชื่อ:</strong> {r.fullname}</p>
              <p><strong>🆔 รหัส:</strong> {r.student_code}</p>
              <p><strong>🏫 มหาวิทยาลัย:</strong> {r.university}</p>
              <p><strong>✅ อนุมัติ:</strong> {r.approved} | <strong>❌ ปฏิเสธ:</strong> {r.rejected}</p>
              <p><strong>⏳ รออนุมัติ:</strong> {r.pending} | <strong>📊 รวม:</strong> {r.total}</p>
            </div>
          ))
        ) : (
          <p className="no-data">ไม่มีข้อมูล</p>
        )}
      </div>

      {/* รายละเอียด */}
      <div>
        <h3 className="subtitle">📝 รายละเอียดบันทึกงาน</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>วันที่งาน</th>
                <th>กิจกรรม</th>
                <th>สถานะ</th>
                <th>ผู้อนุมัติ</th>
                <th>ผู้บันทึก</th>
                <th>มหาวิทยาลัย</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.flatMap(r =>
                  r.logs
                    .sort((a, b) => new Date(b.log_date) - new Date(a.log_date))
                    .map((log, idx) => (
                      <tr key={`${r.student_code}-${idx}`}>
                        <td>{formatDateThai(log.log_date)}</td>
                        <td>{log.activity}</td>
                        <td>
                          <span className={`status-badge status-${log.status}`}>
                            {translateStatus(log.status)}
                          </span>
                        </td>
                        <td>{log.approved_by || "-"}</td>
                        <td>{r.fullname}</td>
                        <td>{r.university}</td>
                      </tr>
                    ))
                )
              ) : (
                <tr><td colSpan="6">ไม่มีข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
