# Refill

A modern React Native application built with Expo and TypeScript, designed for seamless cross-platform development (iOS, Android, and Web).

## 🚀 Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo SDK 54** - Development platform for universal React apps
- **TypeScript** - Type-safe development
- **Metro Bundler** - Fast, scalable bundler for React Native
- **React 19** - Latest React features

## 📦 Project Structure

```
/Refill
├── App.tsx                 # Main application component
├── index.ts               # Entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── assets/                # Static assets (icons, images)
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (installed automatically)
- For iOS: macOS with Xcode
- For Android: Android Studio with SDK

### Installation

The project is already set up! Dependencies are installed in `node_modules/`.

### Running the App

#### Start Development Server
```bash
npm start
# or
npm run dev  # Starts with cache cleared
```

#### Run on Specific Platform
```bash
# iOS (macOS only)
npm run ios

# Android
npm run android

# Web
npm run web
```

### Development Workflow

1. **Start the development server**: `npm start`
2. **Scan QR code** with Expo Go app (iOS/Android) or press `w` for web
3. **Edit code** in `App.tsx` - changes will hot-reload automatically
4. **Add dependencies**: `npm install <package-name>`

## 🏗️ Architecture

### New Architecture Enabled

This project uses React Native's **New Architecture** (Fabric + TurboModules) for:
- Better performance
- Improved type safety
- Reduced bridge overhead
- Native module synchronous access

### Platform-Specific Code

Use platform-specific extensions when needed:
- `Component.ios.tsx` - iOS specific
- `Component.android.tsx` - Android specific
- `Component.web.tsx` - Web specific
- `Component.tsx` - Shared (default)

## 📱 Building for Production

### Development Build (Recommended)
```bash
# Install Expo CLI globally first (if needed)
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS Build
eas build:configure

# Create development builds
eas build --platform ios --profile development
eas build --platform android --profile development
```

### Production Build
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

## 🔗 Backend Integration

This project is designed to work with a **Next.js backend** for easy deployment:

```typescript
// Example API call
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const response = await fetch(`${API_URL}/api/endpoint`);
const data = await response.json();
```

### Environment Variables

Create a `.env` file in the root:
```bash
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

## 🧪 Testing

```bash
# Add Jest and testing libraries
npm install --save-dev jest @testing-library/react-native @types/jest

# Run tests
npm test
```

## 📝 Code Quality

### TypeScript

Strict type checking is enabled. The `tsconfig.json` is configured for React Native:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### Linting

```bash
# Add ESLint
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Run lint
npm run lint
```

## 🎨 Styling

React Native uses StyleSheet API:
```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
```

Consider adding:
- **NativeWind** (Tailwind for React Native)
- **React Native Paper** (Material Design)
- **Styled Components**

## 📚 Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Expo SDK API Reference](https://docs.expo.dev/versions/latest/)

## 🚢 Deployment

### Web Deployment

Export static web build:
```bash
npx expo export -p web
```

Deploy the `dist/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting

### Mobile App Stores

Use **EAS Submit** for streamlined app store submission:
```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. For team members:
1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass
5. Get code review approval

---

**Built with ⚡️ by engineers who care about quality, performance, and developer experience.**






