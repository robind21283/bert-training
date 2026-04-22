# Bert's Training App

Mobile-first PWA for executing Bert's training plan (Kelly Keebler). Logs reps to Notion.

## Setup

### 1. Notion
- Create a Notion integration at notion.so/my-integrations
- Connect it to your "Bert Training Log" database
- Copy the API key and Database ID

### 2. Netlify Environment Variables
In your Netlify dashboard → Site settings → Environment variables, add:

```
NOTION_API_KEY=ntn_your_key_here
NOTION_DATABASE_ID=34ac97ba4ee0806d82e1ce83d3467738
```

### 3. Deploy
Push to GitHub. Netlify auto-deploys on push.

```bash
npm install
npm run dev     # local dev (use netlify dev for functions)
npm run build   # production build
```

### 4. Initialize Notion Schema
After first deploy, hit this URL once to set up database columns:
`https://your-site.netlify.app/api/notion?action=setup`

## Structure

```
bert-training/
├── netlify/
│   └── functions/
│       └── notion.js       # Serverless proxy (keeps API key server-side)
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # Full app UI
│   ├── data.js             # All training data from Kelly's plans
│   └── api.js              # Client → Netlify function calls
├── public/
│   └── manifest.json       # PWA manifest
├── index.html
├── netlify.toml
└── vite.config.js
```

## Notion Database Schema

The setup endpoint creates these automatically:

| Property | Type |
|---|---|
| Name | Title (auto) |
| Date | Date |
| Behavior | Select |
| Status | Select: Done / Skipped / Snoozed |
| Rep Type | Select: Easy / Distance |
| Snooze Detail | Text |
| Logged At | Text |
| Energy Level | Select: Low / Medium / High |
| Notes | Text |
| Rep Number | Number |

## Add to iPhone Home Screen
Open in Safari → Share → Add to Home Screen. Runs as a standalone app.
