# Medicine Store Admin

React + Vite admin dashboard for an e-pharmacy. Authentication and all data collections run on **Firebase** (Auth + Cloud Firestore). The UI follows the provided Figma admin dashboard.

## About

An admin logs in, then manages pharmacy statistics, orders, products, suppliers, and customers. The first successful login with the demo account seeds Firestore collections automatically.

## Tech stack

- React 18 + Vite
- React Router, React Hook Form, Yup
- MUI X Date Pickers
- Firebase Authentication
- Cloud Firestore

## Design and task

- Figma: [Admin dashboard](https://www.figma.com/design/z1JklHHxX8kTGo3zWvlzat/Admin-dashboard?node-id=0-1)
- Technical task: login, dashboard statistics, orders, products, suppliers, customers, filters, add/edit/delete, JWT-style session via Firebase Auth

## Firebase setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication → Email/Password**.
3. Create a **Cloud Firestore** database (start in test mode, then publish `firestore.rules`).
4. Project settings → Your apps → Web app → copy the config.
5. Copy `.env.example` to `.env` and paste the values:

```bash
copy .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

6. In Firestore rules, allow signed-in admins only (this repo includes `firestore.rules`).

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. After login the app opens `/home`.

Demo account:

- Email: `vendor@gmail.com`
- Password: `12345678`

The first login creates this Firebase user if it does not exist, then seeds products, suppliers, customers, orders, and income/expense documents.

## Links

- Repository: https://github.com/bgokay007-tech/Medicine-Store
- Live page: https://medicine-store-aecfa.web.app

## Deploy

The live site is on Firebase Hosting. Rebuild and publish with:

```bash
npm run build
firebase deploy --only hosting
```

You can also build a static site and host it on Netlify, GitHub Pages, or Render:

```bash
npm run build
```

Set the same `VITE_FIREBASE_*` variables in the host dashboard **before** the build, so Vite can embed them.

On Render, `render.yaml` builds the Vite app and serves `dist` with `npm start`.
