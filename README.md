# My Daily Pet

Mobile app to plan and track the daily care of your pets: baths, walks, medication,
vaccines, meals and play time. Built with Expo (React Native) and Firebase.

## Features

- Pets with icon, type, gender, birthdate, weight and weight history
- Events per pet with recurrence, notes and local reminders (lead time per event)
- Today tab with what is overdue, due today or due in the next 7 days
- Calendar per pet with activities by day
- Discover tab: veterinary news (RSS) and recent papers (PubMed)
- English and Brazilian Portuguese, following the device language
- JSON export, password reset, account deletion

## Stack

Expo SDK 58, expo-router, Firebase Auth + Firestore, i18n-js, expo-notifications.

## Running

```bash
npm install
npm start
```

Scan the QR code with Expo Go (SDK 58). Phone and computer must be on the same
network; `npx expo start --tunnel ngrok` works across networks.

Create a `.env` in the project root with your Firebase web config:

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

Firestore rules live in `firestore.rules`; deploy them with
`firebase deploy --only firestore:rules`.

## Checks

```bash
npx tsc --noEmit
npx expo lint
```

## Project layout

- `app/` routes (expo-router): `login`, `register`, `(tabs)/{today,pets,discover,account}`
- `components/ui/` design kit, `components/forms/` pet and event forms
- `services/` Firestore access, notifications, export, content feeds
- `i18n/` and `locales/` translations, `constants/theme.ts` design tokens
