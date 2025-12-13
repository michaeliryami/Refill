# Quick Start Guide

## 🚀 Get Started in 60 Seconds

### 1. Verify Installation

```bash
# Check if you're in the right directory
pwd
# Should show: /Users/michaeliryami/Desktop/Refill

# Dependencies are already installed!
ls node_modules
```

### 2. Start Development

```bash
# Option A: Quick start
npm start

# Option B: Clear cache and start
npm run dev
```

### 3. Open on Your Device

**Mobile (iOS/Android):**
1. Install [Expo Go](https://expo.dev/client) app on your phone
2. Scan the QR code from the terminal
3. App will load on your device

**iOS Simulator (macOS only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Web Browser:**
```bash
npm run web
```

## 📱 What You'll See

The app opens with a beautiful HomeScreen featuring:
- Platform information (iOS/Android/Web)
- Interactive counter with loading states
- List of key features
- Professional UI with the design system

## 🎨 Your First Edit

1. Open `src/screens/HomeScreen.tsx`
2. Change the title text
3. Save the file
4. Watch it hot-reload instantly! ⚡

## 🛠️ Project Features

### ✅ Already Set Up

- **TypeScript** - Full type safety
- **Expo SDK 54** - Latest features
- **Design System** - Colors, typography, spacing constants
- **API Client** - Ready for backend integration
- **Custom Hooks** - useApi, useDebouncedValue, usePrevious
- **Reusable Components** - Button (more coming)
- **Path Aliases** - Clean imports with @components, @hooks, etc.
- **ESLint** - Code quality
- **Development Guide** - See DEVELOPMENT.md

### 📁 Quick File Reference

```
App.tsx                          # Main entry - renders HomeScreen
src/screens/HomeScreen.tsx       # Main screen (edit this first!)
src/components/Button.tsx        # Reusable button component
src/utils/api.ts                 # API client for backend
src/utils/constants.ts           # Design system (colors, spacing)
src/hooks/useApi.ts              # Custom hooks
src/types/index.ts               # TypeScript types
```

## 🔗 Connect to Your Backend

### Option 1: Update Environment Variable

```bash
# Edit your .env file (create if doesn't exist)
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Option 2: Use the API Client

```typescript
import { api } from '@utils/api';

// GET request
const response = await api.get('/api/users');

// POST request
const response = await api.post('/api/users', { name: 'John' });

// With authentication
api.setAuthToken('your-jwt-token');
const response = await api.get('/api/protected');
```

## 🎯 Next Steps

1. **Read the Development Guide**: `DEVELOPMENT.md`
2. **Customize HomeScreen**: Edit `src/screens/HomeScreen.tsx`
3. **Create New Components**: Follow patterns in `src/components/`
4. **Add Navigation**: Install React Navigation
5. **Connect Backend**: Set up your Next.js API routes

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 19000
lsof -ti:19000 | xargs kill -9

# Or use a different port
npm start -- --port 19001
```

### Metro Bundler Issues
```bash
# Clear cache and restart
npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### iOS Simulator Not Opening
```bash
# Make sure Xcode is installed
xcode-select --install

# Try running directly
npx expo run:ios
```

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Development Guide**: See `DEVELOPMENT.md`
- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/

## 💡 Pro Tips

1. **Use the Design System**: Import from `@utils/constants`
   ```typescript
   import { Colors, Spacing, Typography } from '@utils/constants';
   ```

2. **Path Aliases**: Clean imports
   ```typescript
   import { Button } from '@components';
   import { useApi } from '@hooks';
   ```

3. **Hot Reload**: Press `r` in terminal to reload manually

4. **Dev Menu**: Shake device or `Cmd+D` (iOS) / `Cmd+M` (Android)

5. **Debug**: Press `j` in terminal to open debugger

## 🎉 You're Ready!

Start building your app with confidence. The architecture is production-ready, type-safe, and follows React Native best practices.

**Questions?** Check `DEVELOPMENT.md` for detailed guides.

Happy coding! 🚀

