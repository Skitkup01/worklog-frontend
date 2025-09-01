import React, { useState, useEffect } from "react";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setForm(data.user))
      .catch(() => setMessage("โหลดข้อมูลไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setMessage(data.message))
      .catch(() => setMessage("บันทึกไม่สำเร็จ"));
  };

  if (loading) return <p style={{ textAlign: "center" }}>⏳ กำลังโหลด...</p>;
  if (!form) return <p style={{ textAlign: "center", color: "red" }}>❌ ไม่พบข้อมูลผู้ใช้</p>;

  return (
    <>
      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn-animate:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(37,99,235,0.4);
        }
        input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 6px rgba(37,99,235,0.3);
          outline: none;
        }
        /* 📱 Responsive */
        @media (max-width: 600px) {
          .profile-container { padding: 15px; margin: 10px; }
          .profile-title { font-size: 1.2rem; }
          .profile-input { font-size: 0.9rem; padding: 8px; }
          .profile-button { font-size: 0.9rem; padding: 9px; }
        }
      `}</style>

      <div className="profile-container fade-in" style={styles.container}>
        <h2 className="profile-title" style={styles.title}>👤 แก้ไขโปรไฟล์</h2>
        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>รหัสนักศึกษา</label>
          <input value={form.student_code || ""} disabled style={styles.input} className="profile-input" />

          <label>ชื่อ-นามสกุล</label>
          <input
            name="fullname"
            value={form.fullname || ""}
            onChange={handleChange}
            style={styles.input}
            className="profile-input"
          />

          <label>อีเมล</label>
          <input
            name="email"
            value={form.email || ""}
            disabled
            style={styles.input}
            className="profile-input"
          />

          <label>มหาวิทยาลัย</label>
          <input
            name="university"
            value={form.university || ""}
            onChange={handleChange}
            style={styles.input}
            className="profile-input"
          />

          <label>เบอร์โทร</label>
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            style={styles.input}
            className="profile-input"
          />

          <label>ห้องพัก</label>
          <input
            name="room"
            value={form.room || ""}
            onChange={handleChange}
            style={styles.input}
            className="profile-input"
          />

          <button type="submit" style={styles.button} className="btn-animate profile-button">
            💾 บันทึก
          </button>
        </form>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
  title: { 
    fontSize: "1.4rem", 
    marginBottom: "15px", 
    textAlign: "center", 
    color: "#1e3a8a",
    fontWeight: "600"
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.95rem",
    background: "#f9fafb",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "12px",
    background: "linear-gradient(90deg,#2563eb,#1e40af)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  message: { textAlign: "center", marginBottom: "10px", color: "green", fontWeight: "500" }
};
