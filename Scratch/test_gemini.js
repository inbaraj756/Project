const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = env.match(/REACT_APP_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

async function test() {
  const versions = ["v1", "v1beta"];
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-2.0-flash-exp"];
  
  for (const version of versions) {
    console.log(`\n--- Testing API Version: ${version} ---`);
    const genAI = new GoogleGenerativeAI(apiKey);
    
    for (const m of models) {
      try {
        console.log(`Testing model: ${m}...`);
        const model = genAI.getGenerativeModel({ model: m }, { apiVersion: version });
        const result = await model.generateContent("Hello");
        console.log(`✅ SUCCESS: ${version}/${m}`);
        return; // Stop on first success
      } catch (e) {
        console.log(`❌ FAILED: ${version}/${m} - ${e.message}`);
      }
    }
  }
}

test();

