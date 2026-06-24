gcloud auth application-default login# GUARDIAN AI - Vertex AI + Application Default Credentials Setup

Your Guardian AI now uses **Vertex AI with Application Default Credentials (ADC)** instead of API keys. This is more secure and aligns with your organization's security policies.

## Architecture

```
React Frontend (AIAssistant.js)
        ↓ HTTP POST
Express Backend (vertexai-server.js)
        ↓ ADC Authentication
Vertex AI API (Gemini 1.5 Flash)
```

## Setup Instructions

### Step 1: Set Up Application Default Credentials

Run this command to set up ADC on your machine:

```bash
bash <(curl -sSL https://storage.googleapis.com/cloud-samples-data/adc/setup_adc.sh)
```

This will:
- Open your browser to authenticate with Google Cloud
- Store credentials locally in `~/.config/gcloud/application_default_credentials.json`
- All subsequent calls will automatically use these credentials

### Step 2: Start the GUARDIAN Backend Server

In a terminal, run:

```bash
node server/vertexai-server.js
```

You should see:
```
🚀 GUARDIAN Backend Server
📍 Project: astrointellect-2026
📍 Location: us-central1
✅ Vertex AI initialized successfully
✅ Using ADC (no API key required)

🌐 Server running on http://localhost:3001
```

### Step 3: Start the React Development Server

In another terminal, run:

```bash
npm start
```

### Step 4: Test Guardian AI

1. Open the app in your browser (http://localhost:3000)
2. Go to **Debris Catalog** tab
3. Click on a debris object (any row)
4. Click **"Assess Risk"**, **"Suggest Removal"**, or **"Write Mission Brief"**
5. Watch GUARDIAN respond using Vertex AI with ADC!

## Configuration

Modify these in `.env.local`:

- `REACT_APP_GCP_LOCATION` - GCP region (default: us-central1)
- `REACT_APP_GUARDIAN_BACKEND` - Backend URL (default: http://localhost:3001)

## Running Both Servers Simultaneously (Dev)

**Option 1: Multiple Terminal Tabs** (Recommended)
- Tab 1: `npm start` (React frontend)
- Tab 2: `node server/vertexai-server.js` (Vertex AI backend)

**Option 2: Concurrently** (with npm package)
```bash
npm install --save-dev concurrently
```

Then add to `package.json` scripts:
```json
"dev": "concurrently \"npm start\" \"node server/vertexai-server.js\""
```

Then run:
```bash
npm run dev
```

## Troubleshooting

### "Error: Network issue / DNS failure"
- Make sure backend server is running on port 3001
- Check that `REACT_APP_GUARDIAN_BACKEND=http://localhost:3001` in `.env.local`

### "Error: permission denied" or "PERMISSION_DENIED"
- Run ADC setup again: `bash <(curl -sSL https://storage.googleapis.com/cloud-samples-data/adc/setup_adc.sh)`
- Ensure your GCP service account has these roles:
  - `roles/aiplatform.user` (Vertex AI User)
  - `roles/vertexai.user` (Vertex AI User)

### "Error: Vertex AI model not found"
- Ensure Vertex AI API is enabled in Google Cloud Console
- Go to APIs & Services > Enabled APIs & services > search "Vertex AI"

### Backend won't start: "EADDRINUSE :::3001"
- Port 3001 is already in use. Either:
  - Kill the process using port 3001
  - Change `PORT` environment variable: `PORT=3002 node server/vertexai-server.js`

### ADC credentials not found
- Ensure ADC setup completed successfully
- Check that `~/.config/gcloud/application_default_credentials.json` exists
- Re-run: `bash <(curl -sSL https://storage.googleapis.com/cloud-samples-data/adc/setup_adc.sh)`

## Production Deployment

For production deployment, set up a **Google Cloud Service Account**:

1. Go to Google Cloud Console > Service Accounts
2. Create a new service account with "Vertex AI User" role
3. Download JSON key file
4. Set environment variable on your server:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   ```
5. Deploy the backend (Heroku, Cloud Run, etc.)
6. Update `REACT_APP_GUARDIAN_BACKEND` in prod `.env` to point to your server URL

## How It Works

1. **No API Keys**: ADC automatically uses your Google Cloud credentials
2. **Secure**: Credentials never exposed in frontend code
3. **Scalable**: Backend can be deployed to handle authentication
4. **Organization-Compliant**: Uses ADC per security policy

---

Questions? Check the backend logs:

```bash
node server/vertexai-server.js
# Watch for ✅ or ❌ messages
```
