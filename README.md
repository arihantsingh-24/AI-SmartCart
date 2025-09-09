# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# SmartCart AI (MVP)

Voice-driven shopping list using React + Tailwind. Uses browser Web Speech API for MVP; swap to Gemini 2.5 Flash Live for higher accuracy.

## Setup

1. Install deps:

```bash
npm i
```

2. Tailwind is pre-configured via `tailwind.config.js` and `postcss.config.js`.

3. Start dev server:

```bash
npm run dev
```

## Voice Recognition

- Default: Browser Web Speech API (Chrome recommended). Floating mic button toggles listening. Real-time transcript shows above list.
- Gemini (optional, not enabled in MVP):
  - Create an API key and set it in an environment variable `VITE_GEMINI_API_KEY`.
  - Implement streaming transcription in `src/services/speech.js` `GeminiLiveClient`.

Create `.env.local` (optional):

```
VITE_GEMINI_API_KEY=your_key_here
```

## Commands

- "Add milk"
- "Add 2 bananas"
- "Remove apples"

Items auto-categorize (basic keyword rules) and persist in Local Storage.

## Deploy

- Vercel: Import the repo, framework Vite, build `npm run build`, output `dist`.
- Firebase Hosting: `npm run build` then `firebase deploy` (after `firebase init hosting`).

## Folder Structure

- `src/components`: UI components (MicButton, Transcript, ShoppingList)
- `src/services`: Speech providers (BrowserSpeechRecognizer, GeminiLiveClient placeholder)
- `src/utils`: Storage, categories, command parsing

## Notes

- Mobile-friendly Tailwind layout; uses a floating microphone button.
- You can extend categories in `src/utils/categories.js`.
