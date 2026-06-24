import React, { useState, useRef, useEffect } from "react";
import "../styles/AIAssistant.css";

const SYSTEM_PROMPT = `You are GUARDIAN, the AI mission intelligence core of AstroIntellect. 
You help space debris operators understand collision risks and plan removal missions. 
You have expertise in orbital mechanics, active debris removal (ADR) technologies, 
and the Google tech stack used in AstroIntellect (Firebase, Vertex AI, TensorFlow.js). 
Always connect your answers to SDG 13 (Climate Action) by mentioning the 847 climate monitoring satellites at risk. 
Be technical but clear. Keep responses under 200 words.`;

const AIAssistant = ({ selectedObj }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesRef = useRef([]);

  const backendUrl = process.env.REACT_APP_GUARDIAN_BACKEND || "http://localhost:3001";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (selectedObj) {
      const initial = [
        { role: "ai", text: `I am GUARDIAN. How can I assist with the analysis of ${selectedObj.name}?` }
      ];
      setMessages(initial);
      messagesRef.current = initial;
      setInput("");
    }
  }, [selectedObj]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    if (!backendUrl || backendUrl.trim() === "") {
      const errMsg = { role: "ai", text: "Error: GUARDIAN backend not configured. Please set REACT_APP_GUARDIAN_BACKEND in .env.local" };
      const updated = [...messagesRef.current, { role: "user", text }, errMsg];
      setMessages(updated);
      messagesRef.current = updated;
      setInput("");
      return;
    }

    const userMessage = { role: "user", text };
    const updatedMessages = [...messagesRef.current, userMessage];
    setMessages(updatedMessages);
    messagesRef.current = updatedMessages;
    setInput("");
    setIsLoading(true);

    try {
      console.log("GUARDIAN: Connecting to backend:", backendUrl);
      const historyText = updatedMessages
        .map(m => `${m.role === "ai" ? "GUARDIAN" : "Operator"}: ${m.text}`)
        .join("\n");

      const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation History:\n${historyText}\n\nGUARDIAN:`;

      const response = await fetch(`${backendUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt })
      });

      if (!response.ok) {
        // Read the error body from backend for a better message
        let errBody = {};
        try { errBody = await response.json(); } catch (_) {}
        const backendMsg = errBody.error || `Backend error: ${response.status}`;
        throw new Error(backendMsg);
      }

      const data = await response.json();
      const responseText = data.text;

      if (!responseText || responseText.trim() === "") {
        throw new Error("Empty response from Gemini");
      }

      const aiMessage = { role: "ai", text: responseText };
      const finalMessages = [...messagesRef.current, aiMessage];
      setMessages(finalMessages);
      messagesRef.current = finalMessages;

    } catch (error) {
      console.error("GUARDIAN Error:", error);

      let errorMsg = error.message || "Communication link failed.";

      if (error.message?.includes("Failed to fetch") || error.message?.includes("Load failed")) {
        errorMsg = "⚠️ Cannot reach backend server. Please run: node server/vertexai-server.js in a separate terminal.";
      }

      const errMessage = { role: "ai", text: errorMsg };
      const withError = [...messagesRef.current, errMessage];
      setMessages(withError);
      messagesRef.current = withError;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (type) => {
    if (!selectedObj) return;
    let prompt = "";
    if (type === "assess") {
      prompt = `Assess the collision risk for ${selectedObj.name} at ${selectedObj.altitude}. What is the Kessler cascade risk and which climate satellites are most threatened?`;
    } else if (type === "remove") {
      prompt = `What is the best Active Debris Removal method for ${selectedObj.name}? Include estimated cost, timeline, and delta-V requirements.`;
    } else if (type === "brief") {
      prompt = `Write a formal 150-word mission brief for removing ${selectedObj.name} suitable for submission to ESA and NASA mission planners.`;
    }
    sendMessage(prompt);
  };

  if (!selectedObj) return null;

  return (
    <div className="ai-container">
      <div className="ai-header">
        <div className="ai-header-content">
          <span className="ai-header-icon" aria-hidden="true">🤖</span>
          <span className="ai-header-title">GUARDIAN Intelligence</span>
        </div>
        <div className="ai-status-dot" title="System Online"></div>
      </div>

      <div className="ai-quick-actions">
        <button onClick={() => handleAction("assess")} disabled={isLoading}>Assess Risk</button>
        <button onClick={() => handleAction("remove")} disabled={isLoading}>Suggest Removal</button>
        <button onClick={() => handleAction("brief")} disabled={isLoading}>Write Mission Brief</button>
      </div>

      <div className="ai-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-msg-row ${msg.role === "ai" ? "ai-msg-left" : "ai-msg-right"}`}>
            <div className={`ai-msg-bubble ${msg.role === "ai" ? "ai-bubble-ai" : "ai-bubble-user"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ai-msg-row ai-msg-left">
            <div className="ai-msg-bubble ai-bubble-ai ai-loading">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage(input)}
          placeholder="Ask GUARDIAN..."
          disabled={isLoading}
        />
        <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;