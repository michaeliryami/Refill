# Refill App - Google Places API Setup

## 🗺️ Getting Your Google Places API Key

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### Step 2: Create a New Project
1. Click "Select a project" dropdown at the top
2. Click "New Project"
3. Name it "Refill" or whatever you prefer
4. Click "Create"

### Step 3: Enable Required APIs
1. Go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Places API**
   - **Maps SDK for Android** (if using Android)
   - **Maps SDK for iOS** (if using iOS)
   - **Geocoding API** (recommended)

### Step 4: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key (looks like: `AIzaSyB...`)

### Step 5: Restrict Your API Key (Important!)
1. Click on your API key to edit it
2. Under "API restrictions":
   - Select "Restrict key"
   - Check: Places API, Maps SDK for Android, Maps SDK for iOS
3. Under "Application restrictions" (for production):
   - Set based on your platform needs
4. Click "Save"

## 🔧 Configure Your App

### Option 1: Environment Variable (Recommended)
Create a `.env` file in your project root:

```bash
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE
```

### Option 2: app.json (Android Maps only)
Update the `android.config.googleMaps.apiKey` in `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_API_KEY_HERE"
        }
      }
    }
  }
}
```

## 🚀 Run the App

### Without API Key (Uses Mock Data)
The app will work with mock data showing 3 sample restaurants:
- Olive Garden (Italian)
- Red Lobster (Seafood)
- Chipotle (Mexican)

```bash
npm start
```

### With API Key (Live Data)
Once you add your API key, the app will search real restaurants using Google Places!

## 🧪 Testing

### Test Search Functionality:
1. Open the app
2. Search for "pizza near me" or any restaurant
3. Tap markers to see details
4. Submit amenity reports

### Test Filters:
- Tap "Free Soda" to see only restaurants with free refills
- Tap "Bread Basket" to see only restaurants with bread baskets
- Tap "All" to see everything

## 💰 Pricing

Google Places API is free for:
- First $200 of usage per month
- ~28,000 searches per month
- Perfect for development and small apps

For more details: https://mapsplatform.google.com/pricing/

## 🔐 Security Tips

1. **Never commit your API key to Git**
   - Add `.env` to `.gitignore` (already done!)
   
2. **Use API restrictions in production**
   - Restrict to specific APIs
   - Set application restrictions

3. **Monitor usage**
   - Check Google Cloud Console regularly
   - Set up billing alerts

## 🐛 Troubleshooting

### "Places API error: REQUEST_DENIED"
- Make sure Places API is enabled in Google Cloud Console
- Check that your API key is correct
- Verify API restrictions aren't blocking requests

### "No restaurants found"
- Check your internet connection
- Verify the API key is set correctly
- Try searching for a specific restaurant name

### Map not showing (Android)
- Make sure you added the API key to `app.json`
- Rebuild the app after adding the key

## 📱 Current Features

✅ **Working Now:**
- Interactive map with user location
- Search for restaurants
- Filter by amenities (Free Soda, Bread Basket)
- View restaurant details
- 4-question amenity survey
- Report inaccuracies
- Get directions to restaurant
- Mock data for testing without API key

🔜 **Coming Soon (Backend with Supabase):**
- Save amenity reports to database
- User accounts and authentication
- Voting system for accuracy
- Add new restaurants
- Photos and reviews

## 📚 Resources

- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Expo Location Docs](https://docs.expo.dev/versions/latest/sdk/location/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

---

**Need help?** Check the other documentation files or open an issue!





