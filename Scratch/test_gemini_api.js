/**
 * Test script to diagnose Gemini API connectivity issues
 * Run with: node scratch/test_gemini_api.js
 */

// Load env vars from .env.local
require('dotenv').config({ path: '.env.local' });

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ ERROR: REACT_APP_GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

console.log("🔍 Testing Gemini API with key:", apiKey.substring(0, 10) + "...");
console.log("📡 Attempting to initialize GoogleGenerativeAI...\n");

try {
  const genAI = new GoogleGenerativeAI(apiKey);
  console.log("✅ GoogleGenerativeAI initialized successfully");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("✅ Model (gemini-1.5-flash) loaded\n");

  console.log("📤 Sending test prompt to Gemini API...");
  
  model.generateContent("Say hello").then((result) => {
    const response = result.response;
    const text = response.text();
    console.log("✅ SUCCESS! Gemini API is working.\n");
    console.log("Response:", text.substring(0, 100) + "...\n");
  }).catch((error) => {
    console.error("❌ FAILED: Gemini API call failed");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
  });

} catch (error) {
  console.error("❌ FAILED: Could not initialize Gemini API");
  console.error("Error:", error.message);
  console.error("Full error:", error);
}
