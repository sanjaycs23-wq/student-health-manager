# Deployment Guide

This workspace contains:

- `backend/`: Node.js + Express API
- `mobile/`: Main Expo React Native app
- `student-health/`: Separate prototype app, not the main deployment target

## 1. Deploy the backend

Recommended host: Render

Files already prepared:

- `render.yaml`
- `backend/.env.example`

What to do:

1. Push this project to GitHub.
2. In Render, create a new Blueprint or Web Service from the repo.
3. Confirm these settings:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. Set environment variables in Render:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
5. Use MongoDB Atlas for the database connection string.

Expected backend URL example:

`https://student-health-manager.onrender.com`

## 2. Configure the mobile app

File already prepared:

- `mobile/src/api/api.js`

The mobile app reads:

- `EXPO_PUBLIC_API_URL`

Create a local file in `mobile/` named `.env` and add:

`EXPO_PUBLIC_API_URL=https://student-health-manager.onrender.com`

## 3. Install Expo build tooling

Run in VS Code terminal:

```bash
npm install -g eas-cli
eas login
```

`eas login` requires your Expo account and cannot be completed automatically without your credentials.

## 4. Configure EAS build

Already prepared:

- `mobile/eas.json`

The `preview` profile is set to build an Android APK.

## 5. Build the APK

Run in VS Code terminal:

```bash
cd mobile
npm run build:apk
```

Or:

```bash
cd mobile
eas build -p android --profile preview
```

## 6. Download and install

After the cloud build finishes, Expo will give you an APK download URL.

Install it on the phone and test:

- Signup
- Login
- Add record
- Fetch records

## What I already completed in code

- Added Render deployment config in `render.yaml`
- Updated `mobile/src/api/api.js` to support `EXPO_PUBLIC_API_URL`
- Added `mobile/eas.json`
- Added `mobile/.env.example`
- Added mobile build scripts to `mobile/package.json`

## What still requires your account access

- GitHub push
- Render project creation
- MongoDB Atlas cluster creation
- Expo login
- Starting the final cloud APK build
