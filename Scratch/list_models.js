/**
 * List available Gemini models and their capabilities
 */

require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log("📋 Fetching available models...\n");
    const models = await genAI.listModels();
    
    console.log("Available models:\n");
    for (const model of models.models) {
      if (model.name.includes('generative')) {
        console.log(`✅ ${model.name}`);
        console.log(`   Display: ${model.displayName}`);
        console.log(`   Supported methods: ${model.supportedGenerationMethods?.join(", ") || "N/A"}`);
        console.log();
      }
    }
  } catch (error) {
    console.error("❌ Error listing models:", error.message);
  }
}

listModels();
