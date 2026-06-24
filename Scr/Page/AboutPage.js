import React from 'react';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* 1. HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-emoji">🛰️</div>
        <h1 className="about-title">AstroIntellect</h1>
        <p className="about-subtitle">AI-Powered Space Debris Command Center</p>
        <div className="about-badge">Built for Google Solution Challenge 2026</div>
      </section>

      {/* 2. WHAT WE DO */}
      <section className="about-section">
        <h2 className="about-section-title">What We Do</h2>
        <div className="about-grid-3">
          <div className="about-card">
            <div className="about-card-icon">🔍</div>
            <h3>Real-Time Tracking</h3>
            <p>Monitor 54,000+ debris objects in Low Earth Orbit using live orbital data</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">🤖</div>
            <h3>Gemini AI Analysis</h3>
            <p>Ask GUARDIAN AI any question about collision risk, removal methods, or mission planning</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">🚀</div>
            <h3>Mission Planning</h3>
            <p>Generate complete ADR mission plans with cost, timeline, and delta-V calculations in seconds</p>
          </div>
        </div>
      </section>

      {/* 3. SDG GOALS */}
      <section className="about-section">
        <h2 className="about-section-title">Sustainable Development Goals</h2>
        <div className="about-grid-3">
          <div className="about-card sdg-green">
            <div className="about-card-icon">13</div>
            <h3>Climate Action</h3>
            <p>Protecting 847 climate monitoring satellites that track global warming, sea level rise, and deforestation from Kessler Syndrome cascade risk</p>
          </div>
          <div className="about-card sdg-orange">
            <div className="about-card-icon">9</div>
            <h3>Industry & Innovation</h3>
            <p>Safeguarding the $480B annual satellite economy and enabling next-generation space infrastructure through AI-powered debris removal</p>
          </div>
          <div className="about-card sdg-blue">
            <div className="about-card-icon">17</div>
            <h3>Partnerships</h3>
            <p>Creating a unified platform for ESA, NASA, ISRO, and JAXA to coordinate global debris removal missions</p>
          </div>
        </div>
      </section>

      {/* 4. GOOGLE TECH STACK */}
      <section className="about-section">
        <h2 className="about-section-title">Google Tech Stack</h2>
        <div className="about-grid-2">
          <div className="tech-item"><span className="tech-icon">🔥</span> <strong>Firebase</strong> — Real-time database and authentication</div>
          <div className="tech-item"><span className="tech-icon">🤖</span> <strong>Gemini AI</strong> — Mission intelligence and risk analysis</div>
          <div className="tech-item"><span className="tech-icon">🗺️</span> <strong>Google Maps</strong> — Debris ground track visualization</div>
          <div className="tech-item"><span className="tech-icon">🧠</span> <strong>Vertex AI</strong> — Debris type classification from radar images</div>
          <div className="tech-item"><span className="tech-icon">🌍</span> <strong>Earth Engine</strong> — Orbital density heatmaps</div>
          <div className="tech-item"><span className="tech-icon">☁️</span> <strong>Cloud Run</strong> — Auto-scaling backend for 54,000+ objects</div>
        </div>
      </section>

      {/* 5. THE PROBLEM */}
      <section className="about-section">
        <h2 className="about-section-title">The Problem</h2>
        <div className="about-stats-grid">
          <div className="about-stat-box">
            <div className="stat-value">54,000+</div>
            <div className="stat-label">Tracked Debris Objects</div>
          </div>
          <div className="about-stat-box">
            <div className="stat-value">140M+</div>
            <div className="stat-label">Total Pieces Including Tiny Fragments</div>
          </div>
          <div className="about-stat-box">
            <div className="stat-value">73%</div>
            <div className="stat-label">Kessler Cascade Risk at 800–1000km</div>
          </div>
          <div className="about-stat-box">
            <div className="stat-value">$480B</div>
            <div className="stat-label">Annual Economy at Risk</div>
          </div>
        </div>
      </section>

      {/* 6. TEAM */}
      <footer className="about-footer">
        <div className="footer-content">
          <p className="footer-highlight">Built for Google Solution Challenge 2026</p>
          <p>Hackathon: hack2skill.com | Final Submission</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
