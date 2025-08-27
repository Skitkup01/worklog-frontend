import React from "react";
import Lottie from "lottie-react";
import newCatAnimation from "./assets/Cat_New.json";
import "./LoadingScreenAlt.css";

export default function LoadingScreenNew() {
  return (
    <div className="loading-container">
      <Lottie animationData={newCatAnimation} loop={true} style={{ width: 250, height: 250 }} />
      <p className="loading-text">กำลังโหลด... น๊ะเมี๊ยวว~ 🐱✨</p>
    </div>
  );
}
