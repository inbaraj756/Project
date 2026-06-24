/**
 * Test different Gemini model names
 */

require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-exp",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-pro",
  "gemini-pro-vision",
];

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say hello");
    const text = await result.response.text();
    console.log(`✅ ${modelName} - WORKS!`);
    return true;
  } catch (error) {
    const msg = error.message;
    if (msg.includes("404") || msg.includes("not found")) {
      console.log(`❌ ${modelName} - Not available`);
    } else if (msg.includes("quota")) {
      console.log(`⚠️ ${modelName} - Quota exceeded`);
    } else {
      console.log(`❌ ${modelName} - Error: ${error.message.split('\n')[0]}`);
    }
    return false;
  }
}

async function main() {
  console.log("🔍 Testing Gemini models...\n");
  
  for (const model of modelsToTest) {
    await testModel(model);
  }
}

main();
