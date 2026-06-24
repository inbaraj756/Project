# GUARDIAN AI - Service Account Setup Guide

Since you're seeing "Unable to authenticate your request", follow these steps to set up ADC with a service account.

## Option 1: Quick Setup (Recommended)

### Step 1: Get Your Service Account JSON Key

1. Open: https://console.cloud.google.com/iam-admin/serviceaccounts?project=gen-lang-client-0684865452

2. You should see a service account (might be auto-created). If not:
   - Click **"Create Service Account"**
   - Name: `guardian-adc`
   - Click **Create**

3. Click on the service account name

4. Go to **"Keys"** tab

5. Click **"Add Key"** → **"Create new key"** → **"JSON"**
   - A JSON file downloads automatically: `<something>-key.json`

6. Move that file to your project:
   - Copy the downloaded JSON file
   - Paste into: `config/service-account-key.json`

### Step 2: Update `.env.local`

Add this line to `.env.local`:

```
GOOGLE_APPLICATION_CREDENTIALS=./config/service-account-key.json
```

### Step 3: Restart Backend

Kill the backend server (Ctrl+C in the terminal) and restart:

```bash
node server/vertexai-server.js
```

You should now see:
```
✅ Vertex AI initialized successfully
✅ Using ADC (no API key required)
```

---

## Option 2: Manual Service Account Creation

If the above doesn't work, create one from scratch:

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=gen-lang-client-0684865452

2. Click **"Create Service Account"**

3. Fill in:
   - Service account name: `guardian-adc`
   - Service account ID: `guardian-adc`
   - Click **"Create and Continue"**

4. Grant roles:
   - Click on the dropdown and search for **"Vertex AI User"**
   - Select it
   - Click **"Add Another Role"**
   - Add **"Service Account User"**
   - Click **"Continue"** then **"Done"**

5. Back on the list, click your new `guardian-adc` account

6. Go to **"Keys"** → **"Add Key"** → **"Create new key"** → **"JSON"**

7. A JSON file downloads. Save it as `config/service-account-key.json`

8. Update `.env.local`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./config/service-account-key.json
   ```

9. Restart:
   ```bash
   node server/vertexai-server.js
   ```

---

## Testing

Once set up, test the backend:

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Say hello"}'
```

You should see a JSON response with the AI's answer.

---

## Troubleshooting

### "File not found" for service-account-key.json
- Make sure you downloaded the JSON file
- Save it exactly at: `config/service-account-key.json`
- Check the file exists

### "Missing IAM permissions"
- Go back to the service account
- Click **"Grant Access"**
- Add role: **"Vertex AI User"** (`roles/aiplatform.user`)

### "Still getting 500 error"
- Check backend logs (terminal where `node server/vertexai-server.js` runs)
- Look for the error message
- Share it for debugging

---

After completing these steps, Guardian AI should work!
