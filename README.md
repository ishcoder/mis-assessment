<div align="center">
  <h1>MIS Executive Assessment</h1>
  <p>Systems + Automation MCQ evaluation (runs 100% client-side — no paid AI API required).</p>
</div>

## What this is
- 24 MCQs across Systems Thinking, Google Sheets, Apps Script, AppSheet, and Integration/Data Model
- Immediate results + category-wise breakdown + rule-based expert evaluation
- Copy / download a summary for HR records

## Run locally
**Prereq:** Node.js 18+

```bash
npm install
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:3000`).

## Deploy on GitHub Pages
This repo includes a GitHub Actions workflow that builds and deploys to GitHub Pages.

1. Create a GitHub repo and push this code.
2. In GitHub: **Settings → Pages**
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Push to the `main` branch → it will auto-deploy.

If you prefer manual deploy:
```bash
npm install
npm run build
```
Then upload the `dist/` folder to any static host.

## Customize
- Edit questions in `constants.ts`
- Change the evaluation logic in `App.tsx` (search `COACHING_BY_SHORT`)

## License
MIT
