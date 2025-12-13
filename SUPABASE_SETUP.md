# Supabase Setup Guide

## 📋 Environment Variables Needed

Create a `.env` file in the root of your project with these variables:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google Places API (already configured)
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSyDQIbT3FENMDxFzOMNDf-aFq56TmTmSFuU
```

## 🔑 Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on Settings (gear icon)
3. Go to "API" section
4. Copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 📊 Your Table Structure (Already Configured!)

Table name: `places`

Columns:
- `key` (text, primary key) - Google Places ID
- `created_at` (timestamp) - Auto-generated
- `bread` (json) - `{ yes: 0, no: 0, idk: 0 }`
- `refill` (json) - `{ yes: 0, no: 0, idk: 0 }`
- `attendant` (json) - `{ yes: 0, no: 0, idk: 0 }`
- `pay` (json) - `{ yes: 0, no: 0, idk: 0 }`
- `score` (numeric) - Calculated percentage score

## ✅ What's Already Implemented

The app now:
1. ✅ Fetches amenity data from Supabase when you view a restaurant
2. ✅ Creates new restaurant row on first report
3. ✅ Updates existing restaurant when subsequent reports come in
4. ✅ Automatically increments yes/no/idk counts in the JSON
5. ✅ Calculates and updates the score
6. ✅ Displays real-time stats (% bars and report counts)

## 🚀 How It Works

### When You View a Restaurant:
1. App checks Supabase for existing data using Google Places ID
2. If data exists, shows the vote percentages and totals
3. If no data, shows "No reports yet"

### When You Submit a Report:
1. App checks if restaurant exists in Supabase
2. If **new**: Creates row with initial counts (e.g., `{yes: 1, no: 0, idk: 0}`)
3. If **exists**: Increments the appropriate counter (e.g., `yes: 5` becomes `yes: 6`)
4. Recalculates the score
5. Updates the UI immediately

## 🔄 Data Flow

```
User submits survey
    ↓
App calls submitRestaurantReport()
    ↓
Supabase updates JSON directly
    ↓
App refreshes restaurant data
    ↓
UI shows updated percentages
```

## 📝 Example Data

After 3 users report on Olive Garden:

```json
{
  "key": "ChIJAQAAQOBZwokRBmqUgP5S0qc",
  "refill": { "yes": 3, "no": 0, "idk": 0 },
  "bread": { "yes": 2, "no": 1, "idk": 0 },
  "pay": { "yes": 1, "no": 2, "idk": 0 },
  "attendant": { "yes": 0, "no": 2, "idk": 1 },
  "score": 50
}
```

This shows:
- 100% say free refills (3/3)
- 67% say bread basket (2/3)
- 33% say pay at table (1/3)
- 0% say attendant (0/3)
- Overall score: 50%

## 🎯 Next Steps

1. **Add your Supabase credentials to `.env`**
2. **Restart the app**: `npm start`
3. **Test it**:
   - Search for a restaurant
   - Submit a report
   - Check your Supabase dashboard - you'll see the data!
   - View the restaurant again - stats should update

That's it! Your app is now fully connected to Supabase! 🎉

