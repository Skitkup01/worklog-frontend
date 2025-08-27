import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import LoadingScreen from "./LoadingScreen";
import fatCatAnimation from "./assets/HalloweenCat.json"; // 🐱 ไฟล์แมวอ้วน

export default function Login({ onLoginSuccess }) {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false); // เริ่มต้น false
  const [closing, setClosing] = useState(false);

  const navigate = useNavigate();

  // ✅ เปิด popup แค่ทุก 1 ชั่วโมง
  useEffect(() => {
    const lastSeen = localStorage.getItem("loginGuideLastSeen");
    const oneHour = 60 * 60 * 1000; // 1 ชั่วโมง
    if (!lastSeen || Date.now() - parseInt(lastSeen, 10) > oneHour) {
      setShowGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem("loginGuideLastSeen", Date.now().toString());
      setShowGuide(false);
      setClosing(false);
    }, 250); // รออนิเมชันปิด
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const MIN_LOADING_TIME = 3000;
    const startTime = Date.now();

    try {
      const res = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: loginValue, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("fullname", data.user.fullname);

      setLoginValue("");
      setPassword("");

      const elapsed = Date.now() - startTime;
      const remaining = MIN_LOADING_TIME - elapsed;

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(data.user);
        if (data.user.role === "admin") {
          navigate("/admin-daily-logs", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, remaining > 0 ? remaining : 0);

    } catch (error) {
      setErr(error.message);
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={styles.page}>
      {/* ✅ keyframes animation */}
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

      {/* ✅ ป็อปอัปสอนวิธีใช้งาน */}
      {showGuide && (
        <div style={styles.overlay}>
          <div
            style={{
              ...styles.modal,
              animation: closing ? "popOut 0.25s ease forwards" : "popIn 0.35s ease",
            }}
          >
            <h2 style={{ marginBottom: 10 }}>📘 วิธีใช้งาน</h2>
            <p>1. กรอกอีเมลมหาวิทยาลัย หรือ รหัสนักศึกษา</p>
            <p>2. กรอกรหัสผ่านที่ลงทะเบียนไว้</p>
            <p>3. กด "➡️ เข้าสู่ระบบ" เพื่อเข้าใช้งาน</p>
            <button style={styles.closeBtn} onClick={handleCloseGuide}>
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}

      <div style={styles.wrapper}>
        {/* 🐱 แมวนอนอ้วน */}
        <div style={styles.catWrapper}>
          <Lottie animationData={fatCatAnimation} loop={true} style={{ width: 260, height: 260 }} />
        </div>

        {/* ฟอร์ม */}
        <form onSubmit={handleSubmit} style={styles.card}>
          <h1 style={styles.title}>🔑 Welcome Back</h1>
          <p style={styles.subtitle}>เข้าสู่ระบบเพื่อจัดการงานของคุณ</p>
          {err && <p style={styles.error}>{err}</p>}

          <input
            style={styles.input}
            placeholder="Email หรือ รหัสนักศึกษา"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.btn}>➡️ เข้าสู่ระบบ</button>

          <p style={styles.switchText}>
            ยังไม่มีบัญชี?{" "}
            <Link to="/register" style={styles.link}>
              สมัครสมาชิก
            </Link>
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
    background: "linear-gradient(135deg, #eff6ff, #e0f2fe)",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
    zIndex: 1,
  },
  catWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    minWidth: "300px",
    maxWidth: "380px",
    padding: "40px 32px",
    borderRadius: 20,
    background: "#ffffff",
    textAlign: "center",
  },
  title: {
    fontSize: "1.9rem",
    fontWeight: 700,
    marginBottom: "10px",
    color: "#1e3a8a",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "22px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    background: "#f9fafb",
  },
  btn: {
    padding: "12px",
    width: "100%",
    background: "linear-gradient(90deg, #3b82f6, #2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    boxShadow: "0 4px 15px rgba(37,99,235,0.4)",
  },
  error: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 12,
    fontSize: "14px",
  },
  switchText: {
    textAlign: "center",
    marginTop: 18,
    fontSize: "14px",
    color: "#374151",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
  },

  /* ✅ Popup styles */
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
    padding: "25px 30px",
    borderRadius: "15px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "left",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  closeBtn: {
    marginTop: 15,
    padding: "10px 15px",
    background: "linear-gradient(90deg, #3b82f6, #2563eb)",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    width: "100%",
  },
};
