<div align="center">
  <img width="1200" height="475" alt="ResumePro Elite" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ResumePro Elite

A high-quality Resume/CV Builder with multiple templates, a deterministic ATS scorecard, and export utilities.

This repo is prepared for GitHub and Vercel.

## Requirements
- Node.js 18+ (recommended)
- npm (or pnpm/yarn)

## Local Development

1) Install dependencies
```bash
npm install
```

2) Create your environment file
```bash
cp .env.example .env.local
```

3) Set your Gemini API key (if you use Gemini features)
- Open `.env.local` and set:
  - `GEMINI_API_KEY=...`

4) Run the app
```bash
npm run dev
```

Vite will start the dev server (by default on port 3000 as configured).

## Build
```bash
npm run build
npm run preview
```

## Deploy to Vercel

1) Push this repo to GitHub.
2) Import the GitHub repo into Vercel.
3) Add environment variables in Vercel (Project Settings → Environment Variables):
   - `GEMINI_API_KEY` (only if required)
4) Deploy.

Vercel should auto-detect Vite and use:
- Build Command: `npm run build`
- Output Directory: `dist`

## Notes
- This project uses HashRouter, so it does not require special SPA rewrites for Vercel.
- Do not commit secrets. Keep `.env.local` private.

