import React, { useState } from "react";
import { signInWithGoogle } from "../firebase/auth";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // onAuthChange in App.js will handle the redirect automatically
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Animated starfield background */}
      <div className="stars" aria-hidden="true" />
      <div className="twinkling" aria-hidden="true" />

      <div className="login-card" role="main">
        {/* Logo */}
        <div className="login-logo" aria-label="AstroIntellect logo">
          🛰️
        </div>

        {/* Branding */}
        <h1 className="login-title">AstroIntellect</h1>
        <p className="login-subtitle">AI-Powered Space Debris Command Center</p>

        {/* Badge */}
        <div className="login-badge">
          <span className="badge-dot" />
          Google Solution Challenge 2026
        </div>

        {/* Divider */}
        <div className="login-divider" />

        {/* Error */}
        {error && <p className="login-error" role="alert">{error}</p>}

        {/* Google Sign-In Button */}
        <button
          id="btn-google-signin"
          className={`btn-google ${loading ? "btn-google--loading" : ""}`}
          onClick={handleGoogleSignIn}
          disabled={loading}
          aria-label="Sign in with Google"
        >
          {!loading && (
            <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#fff"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="rgba(255,255,255,.85)"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="rgba(255,255,255,.7)"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="rgba(255,255,255,.55)"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {loading ? (
            <span className="spinner" aria-label="Signing in…" />
          ) : (
            "Sign in with Google"
          )}
        </button>

        {/* Footer */}
        <p className="login-footer">
          Secure authentication powered by Google Firebase
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
