# 🛰️ AstroIntellect

**AI-Powered Space Debris Tracking & Command Center**  
*Google Solution Challenge 2026 Submission*

---

## 🌌 Overview

**AstroIntellect** is a web application that uses artificial intelligence and real-time satellite data to track, analyze, and visualize space debris orbiting Earth. Built for the **Google Solution Challenge 2026**, it aims to address the growing threat of orbital congestion to active satellites, space stations, and future space missions.

With over **27,000 catalogued objects** currently in orbit (and hundreds of thousands of smaller fragments), space debris poses a critical risk to both crewed and uncrewed spacecraft. AstroIntellect puts the power of Google's AI ecosystem — Gemini, Firebase, and Maps — into a single command center interface.

---

## ✨ Features (Planned)

| Module | Description |
|---|---|
| 🌍 **Orbit Tracker** | 3D real-time visualization of debris orbits |
| 🤖 **AI Risk Analysis** | Gemini-powered collision probability scoring |
| 📡 **Live TLE Feed** | Live Two-Line Element ingestion from Space-Track.org |
| ⚠️ **Collision Alerts** | Automated proximity warnings for active satellites |
| 📊 **Analytics Dashboard** | Historical debris growth charts & trend forecasts |
| 🛸 **Debris Registry** | Searchable database of catalogued space objects |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Authentication | Firebase Auth (Google Sign-In) |
| Database | Firebase Realtime Database |
| AI / LLM | Google Gemini API (`@google/generative-ai`) |
| Maps | Google Maps (`@react-google-maps/api`) |
| Charts | React Google Charts |
| Styling | Vanilla CSS (dark space theme, glassmorphism) |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-org/astrointellect-2026.git
cd astrointellect-2026
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your API keys:

```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_DB_URL=your_database_url
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_MAPS_API_KEY=your_maps_api_key
```

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

### 4. Enable Firebase services

In the [Firebase Console](https://console.firebase.google.com):
- Enable **Authentication → Google** sign-in provider
- Enable **Realtime Database** and set rules for your environment

### 5. Run the development server
```bash
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
astrointellect-2026/
├── public/
└── src/
    ├── components/        # Reusable UI pieces (spinner, cards, modals…)
    ├── firebase/
    │   ├── config.js      # Firebase app initialization
    │   └── auth.js        # Google sign-in / sign-out helpers
    ├── pages/
    │   ├── LoginPage.js   # Auth screen
    │   └── Dashboard.js   # Main command center
    ├── styles/
    │   ├── global.css     # Design tokens & base styles
    │   ├── LoginPage.css  # Login screen styles
    │   └── Dashboard.css  # Dashboard styles
    ├── App.js             # Auth routing logic
    └── index.js           # React entry point
```

---

## 👥 Team

Built with ❤️ for the **Google Solution Challenge 2026**.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
