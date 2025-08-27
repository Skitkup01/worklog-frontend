import React from "react";
import Lottie from "lottie-react";
import catAnimation from "./assets/Cat_Pookie.json";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <Lottie animationData={catAnimation} loop={true} style={{ width: 250, height: 250 }} />
      <p className="loading-text">กำลังโหลด... เหมียว~</p>
    </div>
  );
}
