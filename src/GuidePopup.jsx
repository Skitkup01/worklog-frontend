// GuidePopup.jsx
import React, { useEffect, useState } from "react";

export default function GuidePopup({ storageKey, title, steps, duration = 60 * 60 * 1000 }) {
  const [show, setShow] = useState(false);

  // เปิด popup ถ้ายังไม่เคยดู หรือเกินเวลาแล้ว
  useEffect(() => {
    const lastSeen = localStorage.getItem(storageKey);
    if (!lastSeen || Date.now() - parseInt(lastSeen, 10) > duration) {
      setShow(true);
    }
  }, [storageKey, duration]);

  const handleClose = () => {
    localStorage.setItem(storageKey, Date.now().toString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{title}</h2>
        {steps.map((s, i) => (
          <p key={i}>{i + 1}. {s}</p>
        ))}
        <button style={styles.closeBtn} onClick={handleClose}>
          เข้าใจแล้ว
        </button>
      </div>
    </div>
  );
}

const styles = {
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
    maxWidth: "420px",
    width: "90%",
    textAlign: "left",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    animation: "popIn 0.35s ease",
  },
  closeBtn: {
    marginTop: 15,
    padding: "10px 15px",
    background: "linear-gradient(90deg, #6c63ff, #4e4cb8)",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    width: "100%",
  },
};
