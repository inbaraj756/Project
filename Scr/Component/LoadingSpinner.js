import React from "react";

/**
 * LoadingSpinner — reusable full-screen loading overlay.
 * @param {string} message - Optional label shown below the spinner.
 */
const LoadingSpinner = ({ message = "Loading…" }) => {
  return (
    <div style={styles.overlay} role="status" aria-label={message}>
      <div style={styles.ring}>
        <div style={styles.orbit} />
      </div>
      <span style={styles.emoji} aria-hidden="true">🛰️</span>
      <p style={styles.text}>{message}</p>
    </div>
  );
};

const styles = {
  overlay: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0e1a",
    gap: "1rem",
  },
  ring: {
    position: "relative",
    width: 64,
    height: 64,
  },
  orbit: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "3px solid transparent",
    borderTopColor: "#00d4ff",
    borderRightColor: "#1a73e8",
    animation: "spin 0.9s linear infinite",
  },
  emoji: {
    fontSize: "2rem",
    filter: "drop-shadow(0 0 12px #00d4ff)",
  },
  text: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "0.8rem",
    color: "#00d4ff",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
};

export default LoadingSpinner;
