# 🌤️ WeatherDash — Multi-User Weather Dashboard

A full-stack weather dashboard where users can register, log in, track multiple cities, view real-time weather, mark favorites, and get AI-powered weather insights.

---

## 🔗 Links

| | |
|---|---|
| Live App | `<your-frontend-url>` |
| Backend API | `<your-backend-url>` |
| GitHub Repo | `<your-github-url>` |
| Walkthrough Video | `<your-video-link>` |

---

## 📋 Project Overview

WeatherDash is a personalized weather dashboard for multiple users. Each user gets their own isolated dashboard where they can:

- Register and log in securely
- Search and add cities to their dashboard
- View real-time weather — temperature, humidity, wind speed, visibility, and feels like
- See a 5-day forecast for any city
- Mark cities as favorites (persisted across sessions)
- Get AI-powered insights for any city (what to wear, umbrella needed, etc.)
- Chat with an AI assistant about their tracked cities
- Get a one-click weather summary across all their cities

All data is completely isolated per user — no user can see or touch another user's data.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT in HTTP-only cookies |
| Weather API | Open-Meteo (free, no API key needed) |
| AI | Groq API — LLaMA 3.3 70B |
| Validation | Zod |

### Stack Justification

The preferred stack was used as-is since it was a natural fit for the problem.

**MongoDB** suits this project well because the data is document-oriented — each city belongs to one user, there are no complex joins, and the schema can evolve freely.

**Open-Meteo** was chosen over OpenWeatherMap because it requires zero API key setup (no friction for anyone running the project), has no rate limits on the free tier, and uses the ECMWF model which is more accurate for forecasts. The trade-off is it returns WMO numeric weather codes instead of icon URLs — solved by building a local code-to-emoji mapper, which removes the external icon CDN dependency entirely.

**Groq** was chosen over OpenAI for AI inference because it is free and returns responses near-instantly on LLaMA 3.3 70B, making the AI chat feel snappy rather than slow.

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas cluster
- Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/SharukhPathan15/skybrain-weather.git
cd WEATHER
```

### 2. Setup Backend

```bash
cd weather-backend
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/weatherdash
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
GROQ_API_KEY=your_groq_key_here
```

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd weather-frontend
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### 4. Visit the app

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Architecture

```
client/                          Next.js frontend
├── app/
│   ├── login/page.jsx           Login page
│   ├── register/page.jsx        Register with password strength checker
│   └── dashboard/page.jsx       Main dashboard (protected)
├── components/
│   ├── Navbar.jsx               Sticky nav with profile dropdown
│   ├── WeatherCard.jsx          City card — weather, favorites, AI insight
│   ├── AddCity.jsx              City search with autocomplete dropdown
│   ├── ForecastModal.jsx        5-day forecast popup
│   ├── InsightModal.jsx         AI insight popup
│   ├── AIChat.jsx               Floating AI chat assistant
│   └── ConfirmModal.jsx         Reusable confirm dialog
└── lib/
    ├── api.js                   Axios instance + all API functions
    └── weather.js               Weather formatting helpers

server/                          Node.js + Express backend
├── modules/
│   ├── auth/                    Register, login, logout, /me
│   ├── cities/                  Add, delete, favorite toggle, search
│   ├── weather/                 Bulk weather fetch + forecast
│   └── ai/                      Chat, per-city insight, city summary
├── middleware/
│   ├── auth.middleware.js       JWT verification + req.user injection
│   └── error.middleware.js      Global error handler
└── utils/
    └── jwt.utils.js             Token generation and verification
```

The backend uses a **modular structure** — each feature has its own folder with routes, controller, and service. Controllers handle HTTP, services handle business logic. This separation keeps each module independently readable and testable.

---

## 🔐 Authentication & Authorization

**JWT stored in HTTP-only cookies.**

- On register or login, the server signs a JWT with `userId` as the payload and sets it as an HTTP-only, `sameSite: strict` cookie.
- Every protected route runs through `auth.middleware.js` which reads the cookie, verifies the signature, fetches the user from MongoDB, and attaches them to `req.user`.
- All city and weather queries are scoped to `req.user._id` — even if someone has a valid token, they can only access their own cities. There is no way to query another user's data because every DB query includes a `userId` filter.
- Passwords are hashed with bcrypt (10 salt rounds) before storage.
- Password rules are enforced by Zod on the backend and validated live on the frontend with a checklist UI.

---

## 🤖 AI Agent Design & Purpose

The AI integration uses **Groq's LLaMA 3.3 70B** via the OpenAI-compatible API. Three features were built:

### 1. Per-City AI Insight
Clicking the ✨ sparkle icon on any weather card opens a modal with a 2-sentence practical insight for that city — what to wear, whether to carry an umbrella, activity suggestions. The current weather data is passed as context. Insight is cached in React state so repeat clicks are instant with no extra API call.

### 2. AI Chat Assistant
A floating chat bubble in the bottom-right corner. Every message includes the full weather data for all the user's tracked cities as context, plus the last 8 messages for conversation history. Users can also pin a specific city using the city chips to focus the conversation. The assistant can answer questions like "Should I go running today?", "Which of my cities has the best weather?", or "Will it rain in Mumbai this week?".

### 3. Cross-City Weather Summary
A single sparkle button in the chat header generates a comparative summary across all tracked cities — best and worst weather, travel recommendations, and notable conditions. The full live weather data is included so the LLM works with real numbers.

**Note on LangChain:** A direct API integration was chosen instead of LangChain because the use case does not require autonomous tool-calling or multi-step agent loops — the weather data is already available in the request. LangChain would add abstraction overhead without adding capability here. The "agent" behavior is achieved through structured context injection and prompt engineering.

---

## ✨ Creative Features

### 1. Live Password Strength Checker

**What it is:** On the registration page, as the user types their password, a live checklist appears showing exactly which requirements are met or unmet (uppercase, lowercase, number, special character, minimum length). A color-coded strength bar updates in real time from Weak → Fair → Good → Strong → Excellent. The submit button stays disabled until all rules pass.

**Problem it solves:** Most registration forms either silently reject weak passwords after submission, or show a vague "password too weak" error with no guidance. This creates a frustrating loop of submitting → getting an error → guessing → resubmitting. The live checklist gives users instant, actionable feedback so they know exactly what to fix before they even attempt to submit.

**Engineering approach:** The password rules are defined once as an array of `{ label, test }` objects and reused for both the UI checklist and the client-side submit guard. The same rules are independently enforced in the Zod schema on the backend — so even if someone bypasses the frontend, the API rejects weak passwords with a clear error.

---

### 2. Floating AI Chat Assistant with City Context

**What it is:** A persistent floating chat bubble in the bottom-right corner of the dashboard. The assistant has full awareness of all the user's tracked cities and their live weather data. Users can pin a specific city using city chips to focus the conversation, ask natural language questions, and get a one-click cross-city summary.

**Problem it solves:** Raw weather numbers (28°C, 72% humidity, 14 km/h wind) are not always useful on their own. Users often want answers to real questions — "Should I go for a run today?", "Which of my cities has the best weather this weekend?", "Do I need a jacket in Delhi right now?" — but no standard weather app answers these directly. The AI chat turns raw weather data into actionable, conversational answers.

**Engineering approach:** Every message sent to the LLM includes the full live weather context for all tracked cities serialized as JSON, plus the last 8 messages of conversation history for continuity. This means the assistant always has up-to-date data without needing to call any external API itself — the data pipeline flows from Open-Meteo → backend → frontend → AI context. Three distinct AI surfaces were built: per-city insight modal, floating chat, and cross-city summary — each optimized for a different user intent.

---

## ⚖️ Key Design Decisions & Trade-offs

**Open-Meteo over OpenWeatherMap**
No API key required, no rate limits, more accurate ECMWF model. Trade-off: WMO numeric codes instead of icon URLs, solved with a local emoji mapper.

**HTTP-only cookies over localStorage for JWT**
localStorage is vulnerable to XSS attacks. HTTP-only cookies are inaccessible to JavaScript. Trade-off: requires `sameSite` and CSRF awareness, handled with `sameSite: strict`.

**In-memory weather cache**
A `Map`-based cache with 10-minute TTL reduces Open-Meteo API calls on every refresh. Trade-off: cache is lost on server restart and does not work across multiple server instances. Production fix: Redis.

**Modular backend architecture**
Each feature (auth, cities, weather, AI) is a self-contained module. Slightly more boilerplate upfront, but each module can be understood, tested, and modified independently without touching others.

**Emoji icons over external CDN**
Switching to Open-Meteo meant OWM icon URLs were no longer valid. Emojis remove the external image dependency, eliminate broken image states, and work offline. Trade-off: less visual polish than dedicated weather icons.

---

## ⚠️ Known Limitations

- **In-memory cache** resets on server restart and does not scale horizontally. Production fix: Redis.
- **No refresh tokens** — JWT expires after 15 minutes, logging users out after inactivity. Production fix: refresh token rotation.
- **No rate limiting** on API endpoints. Production fix: `express-rate-limit` middleware.
- **No email verification** on registration. Production fix: verification email via SendGrid or Resend.
- **Forecast re-geocodes** the city name on every request instead of using stored coordinates. Production fix: use `lat`/`lon` already stored in the city document.
- **AI context grows with city count** — sending all city weather data to the LLM could hit token limits for users with many cities. Production fix: summarize or truncate context before sending.

---

## 🌍 Deployment Guide

### Frontend → Vercel
1. Push `client/` to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>/api`
4. Deploy

### Backend → Render
1. Push `server/` to GitHub
2. Create a new Web Service at [render.com](https://render.com)
3. Add all environment variables from `.env` in the Render dashboard
4. Deploy

### Database → MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist all IPs (`0.0.0.0/0`) or Render's outbound IPs
3. Copy the connection string to `MONGO_URI`

---

## 📁 Environment Variables

### Backend (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS |
| `GROQ_API_KEY` | From console.groq.com |

### Frontend (`client/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
