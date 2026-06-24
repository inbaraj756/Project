import React, { useState } from 'react';
import { DEBRIS_DATA } from '../data/debrisData';
import '../styles/MissionPlanner.css';

const METHODS = [
  "Robotic Arm Capture (TRL 8 — most proven)",
  "Net Capture System (TRL 6 — mid maturity)",
  "Magnetic Tether (TRL 7 — good for metallic debris)",
  "Ion Beam Shepherd (TRL 5 — experimental, fuel-free)",
  "Laser Push (TRL 4 — early stage)"
];

const AGENCIES = ["ESA", "NASA", "ISRO", "JAXA", "SpaceX", "Private"];

const ICONS = {
  "MISSION NAME": "🚀",
  "TIMELINE": "⏱️",
  "LAUNCH WINDOW": "📅",
  "DELTA-V REQUIRED": "⛽",
  "COST PER OBJECT": "💰",
  "KESSLER RISK REDUCTION": "📉",
  "CLIMATE SATELLITES PROTECTED": "🌍",
  "SDG 13 IMPACT": "🌱",
  "SDG 9 IMPACT": "🏗️",
  "MISSION PHASES": "📋",
  "SUCCESS PROBABILITY": "🎯",
  "RISKS": "⚠️"
};

const MissionPlanner = () => {
  const [targetId, setTargetId] = useState(DEBRIS_DATA[0].id);
  const [method, setMethod] = useState(METHODS[0]);
  const [budget, setBudget] = useState(250);
  const [objectsCount, setObjectsCount] = useState(1);
  const [agency, setAgency] = useState(AGENCIES[0]);

  const [plan, setPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_GUARDIAN_BACKEND || "http://localhost:3001";

  const handleGenerate = async () => {
    const selectedObj = DEBRIS_DATA.find(d => d.id === parseInt(targetId));
    if (!selectedObj) return;

    if (!backendUrl || backendUrl.trim() === "") {
      setPlan("Error: GUARDIAN backend not configured. Please set REACT_APP_GUARDIAN_BACKEND in .env.local");
      return;
    }

    setIsLoading(true);
    setPlan("");

    const prompt = `Generate a detailed Active Debris Removal mission plan for:
Target: ${selectedObj.name} at ${selectedObj.altitude}
Method: ${method}
Budget: $${budget}M
Agency: ${agency}
Objects per mission: ${objectsCount}

Format the output EXACTLY as (no markdown, no asterisks, plain text only):
MISSION NAME: [creative name]
TIMELINE: [total mission duration]
LAUNCH WINDOW: [suggested year/quarter]
DELTA-V REQUIRED: [in m/s]
COST PER OBJECT: $[amount]M
KESSLER RISK REDUCTION: [percentage]%
CLIMATE SATELLITES PROTECTED: [number and names]
SDG 13 IMPACT: [2 sentences]
SDG 9 IMPACT: [2 sentences]
MISSION PHASES: [5 phases with duration each]
SUCCESS PROBABILITY: [percentage]%
RISKS: [3 key risks]`;

    try {
      console.log("MissionPlanner: Connecting to backend:", backendUrl);
      
      const response = await fetch(`${backendUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        // Read backend error body for a better message
        let errBody = {};
        try { errBody = await response.json(); } catch (_) {}
        const backendMsg = errBody.error || `Backend error: ${response.status}`;
        throw new Error(backendMsg);
      }

      const data = await response.json();
      const responseText = data.text;

      if (!responseText || responseText.trim() === '') {
        throw new Error("Empty response from Gemini");
      }

      setPlan(responseText);
    } catch (error) {
      console.error("MissionPlanner Error:", error);

      let errorMsg = error.message || "Error generating mission plan.";

      if (error.message?.includes("Failed to fetch") || error.message?.includes("Load failed")) {
        errorMsg = "Error: Cannot reach backend server. Please run: node server/vertexai-server.js in a separate terminal.";
      }

      setPlan(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!plan) return;
    navigator.clipboard.writeText(plan)
      .then(() => alert("Mission plan copied to clipboard!"))
      .catch(() => alert("Could not copy to clipboard. Please copy manually."));
  };

  return (
    <div className="mp-container">
      <div className="mp-left">
        <h2 className="mp-title">Mission Configuration</h2>

        <div className="mp-form-group">
          <label>Select Target Debris</label>
          <select value={targetId} onChange={e => setTargetId(e.target.value)}>
            {DEBRIS_DATA.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.risk} Risk)</option>
            ))}
          </select>
        </div>

        <div className="mp-form-group">
          <label>Removal Method</label>
          <select value={method} onChange={e => setMethod(e.target.value)}>
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="mp-form-row">
          <div className="mp-form-group">
            <label>Mission Budget ($M)</label>
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} min="1" />
          </div>
          <div className="mp-form-group">
            <label>Objects per Mission</label>
            <input type="number" value={objectsCount} onChange={e => setObjectsCount(e.target.value)} min="1" />
          </div>
        </div>

        <div className="mp-form-group">
          <label>Launching Agency</label>
          <select value={agency} onChange={e => setAgency(e.target.value)}>
            {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <button className="mp-generate-btn" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <span className="mp-spinner"></span>
          ) : "Generate Mission Plan with AI"}
        </button>
      </div>

      <div className="mp-right">
        {isLoading ? (
          <div className="mp-loading-state">
            <div className="mp-big-spinner"></div>
            <p>GUARDIAN is calculating orbital mechanics...</p>
          </div>
        ) : plan ? (
          <div className="mp-plan-output">
            <div className="mp-plan-header">
              <h3>Generated Mission Plan</h3>
              <button className="mp-export-btn" onClick={handleExport}>📋 Export Plan</button>
            </div>
            <div className="mp-plan-content">
              {plan.startsWith("Error:") ? (
                <div className="mp-error-msg">{plan}</div>
              ) : (
                plan.split('\n').map((line, i) => {
                  if (line.trim() === '') return null;

                  // Strip markdown bold/italic formatting from Gemini output
                  const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();

                  let matchedKey = null;
                  for (const key of Object.keys(ICONS)) {
                    if (cleanLine.toUpperCase().startsWith(key)) {
                      matchedKey = key;
                      break;
                    }
                  }

                  if (matchedKey) {
                    const colonIndex = cleanLine.indexOf(':');
                    const val = colonIndex !== -1 ? cleanLine.substring(colonIndex + 1).trim() : '';
                    return (
                      <div key={i} className="mp-plan-item">
                        <div className="mp-plan-key">
                          <span className="mp-plan-icon">{ICONS[matchedKey]}</span>
                          {matchedKey}
                        </div>
                        {val && <div className="mp-plan-val">{val}</div>}
                      </div>
                    );
                  } else {
                    return <div key={i} className="mp-plan-text">{cleanLine}</div>;
                  }
                })
              )}
            </div>
          </div>
        ) : (
          <div className="mp-empty-state">
            <span className="mp-empty-icon">🚀</span>
            <p>Configure parameters and click Generate to create a mission plan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionPlanner;