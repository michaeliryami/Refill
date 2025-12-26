# 🚀 Refill App - Deployment Guide

Complete guide to deploy your Refill app to the Apple App Store and Google Play Store.

---

## 📋 Prerequisites

### For iOS (App Store):
- ✅ Apple Developer Account ($99/year) - [Sign up here](https://developer.apple.com/programs/)
- ✅ Enrolled in Apple Developer Program
- ✅ Mac computer (recommended, but EAS can build without one)

### For Android (Google Play):
- ✅ Google Play Developer Account ($25 one-time) - [Sign up here](https://play.google.com/console/signup)
- ✅ No Mac required

---

## 🛠️ Step-by-Step Deployment

### 1. Install EAS CLI

```bash
# Install EAS CLI globally (you may need sudo)
sudo npm install -g eas-cli

# Or use it via npx (no installation needed)
npx eas-cli --version
```

### 2. Login to Your Expo Account

```bash
cd /Users/michaeliryami/Desktop/Refill

# Create an Expo account or login
npx eas login
```

### 3. Configure EAS Build

```bash
# Initialize EAS in your project
npx eas build:configure
```

This creates an `eas.json` file with build profiles.

### 4. Update Environment Variables for Production

**Important:** Your Google Places API key and Supabase credentials are currently in `.env` which won't be included in the build.

You need to add them to EAS:

```bash
# Add your environment variables to EAS
npx eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_PLACES_API_KEY --value AIzaSyDQIbT3FENMDxFzOMNDf-aFq56TmTmSFuU
npx eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value YOUR_SUPABASE_URL
npx eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value YOUR_SUPABASE_ANON_KEY
```

Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual values from `.env`.

---

## 📱 iOS Deployment (App Store)

### Step 1: Build for iOS

```bash
# Build a production iOS app
npx eas build --platform ios
```

EAS will:
- Ask you to log in to your Apple Developer account
- Create certificates and provisioning profiles automatically
- Build your app in the cloud
- Give you a download link when done (~15-20 minutes)

### Step 2: Submit to App Store

```bash
# Automatically submit to App Store
npx eas submit --platform ios
```

Or manually:
1. Download the `.ipa` file from EAS
2. Use [Transporter](https://apps.apple.com/app/transporter/id1450874784) or Xcode to upload
3. Go to [App Store Connect](https://appstoreconnect.apple.com)
4. Fill in app metadata (name, description, screenshots, etc.)
5. Submit for review

### iOS App Store Requirements:
- **App Name:** Refill
- **Description:** Find restaurants with free refills, bread baskets, and more amenities
- **Keywords:** restaurant, refills, dining, food, amenities
- **Screenshots:** Required (5.5", 6.5", 6.7" iPhone sizes)
- **Privacy Policy URL:** Required (you'll need to create one)
- **Category:** Food & Drink

---

## 🤖 Android Deployment (Google Play)

### Step 1: Build for Android

```bash
# Build a production Android app
npx eas build --platform android
```

Choose:
- **Build type:** `apk` (for testing) or `aab` (for Play Store - recommended)

This takes ~10-15 minutes.

### Step 2: Submit to Google Play

```bash
# Automatically submit to Google Play
npx eas submit --platform android
```

Or manually:
1. Download the `.aab` file from EAS
2. Go to [Google Play Console](https://play.google.com/console)
3. Create a new app
4. Upload the `.aab` file
5. Fill in store listing (name, description, screenshots)
6. Submit for review

### Google Play Requirements:
- **App Name:** Refill
- **Short Description:** (80 chars) Find restaurants with free refills & amenities
- **Full Description:** (4000 chars) Detailed description of your app
- **Screenshots:** At least 2 screenshots
- **Feature Graphic:** 1024x500px image
- **App Icon:** 512x512px
- **Privacy Policy URL:** Required
- **Content Rating:** Fill out questionnaire

---

## 🔐 Security Checklist

### Before Deploying:

1. **API Key Security:**
   - ⚠️ Your Google Places API key is exposed in `app.json`
   - Restrict it in [Google Cloud Console](https://console.cloud.google.com/):
     - Go to APIs & Services → Credentials
     - Click your API key
     - Under "Application restrictions", select "Android apps" and "iOS apps"
     - Add your bundle IDs: `com.refill.app`
     - Under "API restrictions", select "Restrict key" and only enable:
       - Maps SDK for Android
       - Maps SDK for iOS
       - Places API

2. **Supabase Security:**
   - Your anon key is safe to expose (it's designed for client-side use)
   - Ensure Row Level Security (RLS) is enabled on your `places` table
   - Review your RLS policies to ensure data security

3. **Create Privacy Policy:**
   - Both stores require a privacy policy
   - Include: location data collection, data storage, third-party services (Google, Supabase)
   - Host it on a public URL (GitHub Pages, your website, etc.)

---

## 📊 App Store Optimization (ASO)

### Suggested App Description:

```
Refill - Find Restaurants with Free Refills & Amenities

Tired of guessing which restaurants offer free refills, complimentary bread, or pay-at-table convenience? Refill is your crowd-sourced guide to restaurant amenities!

🔍 SEARCH & DISCOVER
- Find nearby restaurants on an interactive map
- Search for specific locations
- Filter by amenities you care about

🍽️ COMMUNITY-POWERED INTEL
- See what amenities restaurants offer
- Free refills (soda, coffee, tea)
- Complimentary bread baskets
- Pay-at-table options (Toast/Clover)
- Bathroom attendant info

⭐ RATE & SHARE
- Rate your dining experience
- Report amenities to help others
- View community consensus with visual stats

📍 POWERED BY YOUR LOCATION
- Real-time distance calculations
- Get directions instantly
- Discover hidden gems nearby

Join the community helping diners make informed choices!
```

### Keywords (iOS):
```
restaurant, refills, free refills, bread basket, dining, food, amenities, pay at table, restaurant finder, restaurant map
```

### Screenshots to Create:
1. Map view with restaurant markers
2. Restaurant details with amenity stats
3. Search functionality
4. Survey/report interface
5. Filter options

---

## 🚦 Build Commands Reference

```bash
# Development builds (for testing on devices)
npx eas build --profile development --platform ios
npx eas build --profile development --platform android

# Preview builds (internal testing)
npx eas build --profile preview --platform ios
npx eas build --profile preview --platform android

# Production builds (for app stores)
npx eas build --profile production --platform ios
npx eas build --profile production --platform android

# Build both platforms at once
npx eas build --platform all

# Check build status
npx eas build:list

# Submit to stores
npx eas submit --platform ios
npx eas submit --platform android
```

---

## 📱 Testing Before Release

### Internal Testing:

1. **iOS TestFlight:**
   ```bash
   npx eas build --profile production --platform ios
   npx eas submit --platform ios
   ```
   - Invite testers in App Store Connect
   - Get feedback before public release

2. **Android Internal Testing:**
   ```bash
   npx eas build --profile production --platform android
   ```
   - Upload to Google Play Console
   - Create internal testing track
   - Share link with testers

---

## 📈 Post-Launch

### Update Your App:

1. Increment version in `app.json`:
   ```json
   {
     "expo": {
       "version": "1.0.1",
       "ios": {
         "buildNumber": "2"
       },
       "android": {
         "versionCode": 2
       }
     }
   }
   ```

2. Build and submit:
   ```bash
   npx eas build --platform all
   npx eas submit --platform all
   ```

### Monitor:
- **iOS:** [App Store Connect Analytics](https://appstoreconnect.apple.com)
- **Android:** [Google Play Console](https://play.google.com/console)
- **Crashes:** Set up [Sentry](https://sentry.io) or similar

---

## 💰 Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Account | $99 | Annual |
| Google Play Developer | $25 | One-time |
| Expo EAS Build* | Free for first 30 builds/month | Monthly |
| Supabase | Free tier available | Monthly |
| Google Cloud (Places API) | Pay per request** | Monthly |

*After 30 builds/month, you'll need an [Expo subscription](https://expo.dev/pricing)

**Monitor your API usage in Google Cloud Console. Places API pricing is ~$17 per 1000 requests (Nearby Search).

---

## 🆘 Troubleshooting

### Build Failed?
- Check EAS build logs: `npx eas build:list`
- Common issues:
  - Missing credentials: Run `npx eas credentials` to manage
  - API key errors: Verify environment variables with `npx eas secret:list`
  - Version conflicts: Clear cache with `npx expo start -c`

### Submission Failed?
- **iOS:** Check App Store Connect for rejection reasons
- **Android:** Check Google Play Console for errors
- Common issues:
  - Missing privacy policy
  - Incorrect screenshots
  - Missing app description

### Need Help?
- [Expo Docs](https://docs.expo.dev)
- [Expo Discord](https://chat.expo.dev)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

---

## 🎉 Quick Start Checklist

- [ ] Install EAS CLI: `sudo npm install -g eas-cli`
- [ ] Login to Expo: `npx eas login`
- [ ] Configure EAS: `npx eas build:configure`
- [ ] Add environment variables: `npx eas secret:create`
- [ ] Restrict Google API key in Cloud Console
- [ ] Create privacy policy
- [ ] Register for Apple Developer ($99)
- [ ] Register for Google Play Developer ($25)
- [ ] Build iOS: `npx eas build --platform ios`
- [ ] Build Android: `npx eas build --platform android`
- [ ] Create App Store Connect listing
- [ ] Create Google Play Console listing
- [ ] Take screenshots
- [ ] Submit for review!

---

**Good luck with your launch! 🚀**


