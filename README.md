<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b6e62ebd-262b-48d0-8800-8c9cd195d029

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Standalone Auth Page

An auth-only deployable project now lives in `auth-standalone/`.

Use it when you want to deploy only the login/register flow without the rest of the DR circle pages.

1. Enter `auth-standalone/`
2. Install dependencies with `npm install`
3. Run locally with `npm run dev`
4. Build for deployment with `npm run build`
