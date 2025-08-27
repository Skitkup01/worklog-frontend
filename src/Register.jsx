import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import puppyAnimation from "./assets/Dog.json";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [university, setUniversity] = useState("");
  const [phone, setPhone] = useState("");
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [closing, setClosing] = useState(false);

  const navigate = useNavigate();

  // ✅ popup โผล่ทุก 1 ชั่วโมง
  useEffect(() => {
    const lastSeen = localStorage.getItem("registerGuideLastSeen");
    const oneHour = 60 * 60 * 1000;
    if (!lastSeen || Date.now() - parseInt(lastSeen, 10) > oneHour) {
      setShowGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem("registerGuideLastSeen", Date.now().toString());
      setShowGuide(false);
      setClosing(false);
    }, 250);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          email,
          student_code: studentCode,
          university,
          phone,
          room,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      navigate("/login");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.8); }
            60% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes popOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.8); }
          }
        `}
      </style>

      {/* ✅ ป็อปอัปสอนวิธีสมัคร */}
      {showGuide && (
        <div style={styles.overlay}>
          <div
            style={{
              ...styles.modal,
              animation: closing ? "popOut 0.25s ease forwards" : "popIn 0.35s ease",
            }}
          >
            <h2 style={{ marginBottom: 10 }}>📝 วิธีสมัครสมาชิก</h2>
            <p>1. กรอกชื่อ-นามสกุล และอีเมลของคุณ</p>
            <p>2. ระบุรหัสนักศึกษา และมหาวิทยาลัย (ถ้ามี)</p>
            <p>3. ใส่เบอร์โทรและห้อง/แผนก</p>
            <p>4. ตั้งรหัสผ่านสำหรับเข้าสู่ระบบ</p>
            <button style={styles.closeBtn} onClick={handleCloseGuide}>
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}

      <div style={styles.wrapper}>
        {/* 🐶 หมาด้านซ้าย */}
        <div style={styles.dogWrapper}>
          <Lottie animationData={puppyAnimation} loop={true} style={{ width: 170, height: 170 }} />
        </div>

        {/* ฟอร์มสมัคร */}
        <form onSubmit={handleSubmit} style={styles.card}>
          <h1 style={styles.title}>✨ สร้างบัญชีใหม่</h1>
          <p style={styles.subtitle}>กรอกข้อมูลให้ครบเพื่อเริ่มใช้งานระบบ</p>
          {err && <p style={styles.error}>{err}</p>}

          <input style={styles.input} placeholder="ชื่อ-นามสกุล"
            value={fullname} onChange={(e) => setFullname(e.target.value)} required />
          <input style={styles.input} type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input style={styles.input} placeholder="รหัสนักศึกษา"
            value={studentCode} onChange={(e) => setStudentCode(e.target.value)} required />
          <input style={styles.input} placeholder="มหาวิทยาลัย"
            value={university} onChange={(e) => setUniversity(e.target.value)} />
          <input style={styles.input} placeholder="เบอร์โทร"
            value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input style={styles.input} placeholder="ห้อง / แผนก"
            value={room} onChange={(e) => setRoom(e.target.value)} />
          <input style={styles.input} type="password" placeholder="รหัสผ่าน"
            value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button style={styles.btn}>🚀 สมัครสมาชิก</button>

          <p style={styles.switchText}>
            มีบัญชีแล้ว?{" "}
            <Link to="/login" style={styles.link}>เข้าสู่ระบบ</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ecfdf5, #f0fdfa)",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
    position: "relative",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    background: "rgba(255,255,255,0.95)",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    maxWidth: "650px",
    width: "100%",
    flexWrap: "wrap",
    zIndex: 1,
  },
  dogWrapper: {
    flex: 0.7,
    display: "flex",
    justifyContent: "center",
  },
  card: {
    flex: 1.3,
    minWidth: "260px",
    padding: "24px",
    borderRadius: 14,
    background: "#ffffff",
    textAlign: "center",
  },
  title: {
    fontSize: "1.7rem",
    fontWeight: 700,
    marginBottom: "6px",
    color: "#064e3b",
  },
  subtitle: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "18px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "11px 13px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    background: "#f9fafb",
  },
  btn: {
    padding: "12px",
    width: "100%",
    background: "linear-gradient(90deg, #10b981, #059669)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(16,185,129,0.35)",
  },
  error: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 10,
    fontSize: "13px",
  },
  switchText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: "13px",
    color: "#374151",
  },
  link: {
    color: "#059669",
    textDecoration: "none",
    fontWeight: 600,
  },

  /* ✅ Popup */
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  modal: {
    background: "#fff",
    padding: "22px 28px",
    borderRadius: "15px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "left",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  closeBtn: {
    marginTop: 15,
    padding: "10px 15px",
    background: "linear-gradient(90deg, #10b981, #059669)",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    width: "100%",
  },
};
