/**
 * Express backend with Gemini API + API Key
 * Run with: node server/vertexai-server.js
 * Default port: 3001
 */

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const app = express();

// ─── LOAD ENV VARS FROM .env.local ───
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
    console.log('✅ Loaded .env.local');
  } else {
    console.warn('⚠️  .env.local not found');
  }
} catch (err) {
  console.warn('⚠️  Could not load .env.local:', err.message);
}

// ─── MIDDLEWARE ───
app.use(cors());
app.use(express.json());

// ─── ENVIRONMENT ───
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const port   = process.env.PORT || 3001;

console.log(`\n🚀 ASTROINTELLECT Backend Server`);

// ─── VALIDATE API KEY ───
let genAI = null;
let startupError = null;

const FIREBASE_KEY_PREFIX = 'AIzaSyDSBeg'; // Firebase key prefix to detect misconfig

if (!apiKey || apiKey.trim() === '' || apiKey === 'PASTE_YOUR_GEMINI_KEY_HERE') {
  startupError = 'MISSING_KEY';
  console.error('❌ REACT_APP_GEMINI_API_KEY is not set in .env.local');
  console.error('   Get your Gemini API key at: https://aistudio.google.com/app/apikey');
} else if (apiKey.startsWith(FIREBASE_KEY_PREFIX)) {
  startupError = 'FIREBASE_KEY';
  console.error('❌ You have set your FIREBASE API KEY as the Gemini API key — these are different!');
  console.error('   Firebase Key (current): ' + apiKey.slice(0, 12) + '...');
  console.error('   Get your GEMINI API key at: https://aistudio.google.com/app/apikey');
} else {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini AI client initialized');
    console.log('🔑 Key: ' + apiKey.slice(0, 8) + '...' + apiKey.slice(-4) + '\n');
  } catch (err) {
    startupError = 'INIT_FAILED';
    console.error('❌ Failed to init Gemini AI:', err.message);
  }
}

// ─── ROUTES ───

app.get('/api/health', (req, res) => {
  res.json({
    status: genAI ? 'ok' : 'error',
    service: 'AstroIntellect Backend',
    error: startupError || null
  });
});

app.post('/api/generate', async (req, res) => {
  // Return a clear error if key is wrong/missing
  if (!genAI) {
    const msg =
      startupError === 'FIREBASE_KEY'
        ? 'Configuration Error: You\'ve used your Firebase API key as the Gemini API key. These are different keys. Please get a Gemini API key from https://aistudio.google.com/app/apikey and add it as REACT_APP_GEMINI_API_KEY in .env.local, then restart the backend.'
        : startupError === 'MISSING_KEY'
        ? 'Configuration Error: No Gemini API key found. Please add REACT_APP_GEMINI_API_KEY to your .env.local file. Get a key at https://aistudio.google.com/app/apikey'
        : 'Gemini AI failed to initialize. Check server logs.';

    return res.status(500).json({ error: msg });
  }

  const { prompt, model: modelName = 'gemini-2.5-flash' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "prompt" field' });
  }

  console.log(`📨 Prompt received (${prompt.length} chars)`);
  console.log(`🤖 Calling ${modelName}...`);

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log(`✅ Response (${text.length} chars)\n`);
    res.json({ text });

  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);

    let userMessage = 'Error contacting Gemini AI.';

    if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key not valid')) {
      userMessage = 'Error: Your Gemini API key is invalid. Double-check it at https://aistudio.google.com/app/apikey';
    } else if (error.message.includes('API_KEY_SERVICE_BLOCKED')) {
      userMessage = 'Error: This API key is a Firebase key, not a Gemini key. Please get a separate Gemini API key from https://aistudio.google.com/app/apikey and set it as REACT_APP_GEMINI_API_KEY in .env.local';
    } else if (error.message.includes('quota') || error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
      userMessage = 'Error: Gemini API quota exceeded. Wait a moment and try again, or check your quota at https://aistudio.google.com';
    } else if (error.message.includes('SAFETY')) {
      userMessage = 'Error: Response blocked by safety filters. Try rephrasing your request.';
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
      userMessage = 'Error: API key does not have access to Gemini. Ensure the Generative Language API is enabled for your key at https://aistudio.google.com/app/apikey';
    }

    res.status(500).json({ error: userMessage });
  }
});

// ─── START SERVER ───
app.listen(port, () => {
  console.log(`🌐 Server on http://localhost:${port}`);
  console.log(`📡 Endpoint: POST http://localhost:${port}/api/generate\n`);
  if (!genAI) {
    console.log('⚠️  Server started but AI is NOT initialized — fix the API key above.\n');
  }
});
