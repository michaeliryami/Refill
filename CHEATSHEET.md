# Refill Cheatsheet

Quick reference for common tasks and patterns.

## 🚀 Commands

### Development
```bash
npm start              # Start dev server
npm run dev           # Start with cache cleared
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run web           # Run in web browser
npm run lint          # Run ESLint
```

### Terminal Shortcuts (when dev server is running)
```
r  - Reload app
d  - Open developer menu
j  - Open debugger
i  - Run on iOS
a  - Run on Android
w  - Run on web
c  - Clear console
```

## 📁 File Imports

### Components
```typescript
import { Button } from '@components';
import type { ButtonProps } from '@components';
```

### Hooks
```typescript
import { useApi, useDebouncedValue, usePrevious } from '@hooks';
```

### Utils
```typescript
import { api, authAPI, userAPI } from '@utils/api';
import { Colors, Spacing, Typography } from '@utils/constants';
```

### Types
```typescript
import type { User, AuthState, AsyncState } from '@types';
```

### Screens
```typescript
import { HomeScreen } from '@screens';
```

## 🎨 Design System

### Colors
```typescript
import { Colors } from '@utils/constants';

Colors.primary           // #007AFF
Colors.secondary         // #5856D6
Colors.success          // #34C759
Colors.error            // #FF3B30
Colors.textPrimary      // #111827
Colors.textSecondary    // #6B7280
Colors.backgroundPrimary // #FFFFFF
```

### Spacing
```typescript
import { Spacing } from '@utils/constants';

Spacing.xs    // 4
Spacing.sm    // 8
Spacing.md    // 16
Spacing.lg    // 24
Spacing.xl    // 32
```

### Typography
```typescript
import { Typography } from '@utils/constants';

Typography.fontSize.xs        // 12
Typography.fontSize.base      // 16
Typography.fontSize['2xl']    // 24
Typography.fontWeight.bold    // '700'
```

### Shadows
```typescript
import { Shadows } from '@utils/constants';

style={[styles.card, Shadows.base]}
```

## 🔧 Common Patterns

### API Call with useApi Hook
```typescript
const { data, isLoading, error, execute } = useApi(
  async (id: string) => {
    const response = await api.get(`/api/items/${id}`);
    return response.data;
  },
  {
    immediate: false,
    onSuccess: (data) => console.log('Success!', data),
    onError: (error) => console.error('Error:', error),
  }
);

// Call it later
useEffect(() => {
  execute('item-123');
}, []);
```

### Direct API Call
```typescript
import { api } from '@utils/api';

// GET
const response = await api.get('/api/users');

// POST
const response = await api.post('/api/users', {
  name: 'John',
  email: 'john@example.com'
});

// With auth token
api.setAuthToken('your-jwt-token');
const response = await api.get('/api/protected');
```

### Button Usage
```typescript
<Button
  variant="primary"      // primary | secondary | outline | ghost
  size="medium"          // small | medium | large
  onPress={handlePress}
  loading={isLoading}
  disabled={!isValid}
  fullWidth
>
  Click Me
</Button>
```

### Debounced Input
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebouncedValue(search, 500);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

### StyleSheet Pattern
```typescript
import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundPrimary,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
});
```

### Platform-Specific Code
```typescript
import { Platform } from 'react-native';

// Method 1
const padding = Platform.OS === 'ios' ? 60 : 40;

// Method 2
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { shadowRadius: 4 },
      android: { elevation: 4 },
      web: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    }),
  },
});
```

### Error Handling
```typescript
import { ApiError } from '@utils/api';

try {
  const response = await api.get('/api/data');
  // Handle success
} catch (error) {
  if (error instanceof ApiError) {
    // API error
    console.error(`Error ${error.status}: ${error.message}`);
  } else {
    // Unknown error
    console.error('Unexpected error:', error);
  }
}
```

## 🧩 Component Template

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@utils/constants';

export interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
});
```

## 🪝 Hook Template

```typescript
import { useState, useEffect } from 'react';

export function useMyHook<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    // Side effects here
  }, []);

  return { value, setValue };
}
```

## 🎯 Screen Template

```typescript
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Button } from '@components';
import { Colors, Spacing, Typography } from '@utils/constants';

export const MyScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>My Screen</Text>
          <Button variant="primary" onPress={() => {}}>
            Action
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
});
```

## 🔍 Debugging

### Console Logs
```typescript
console.log('Info:', data);
console.warn('Warning:', issue);
console.error('Error:', error);
```

### React DevTools
```bash
# Install standalone
npm install -g react-devtools

# Run
react-devtools
```

### Network Debugging
```bash
# Enable network inspect in dev menu
# Shake device or Cmd+D (iOS) / Cmd+M (Android)
# Select "Debug Remote JS"
```

## 📦 Adding Packages

### Expo SDK Package
```bash
npx expo install package-name
```

### npm Package
```bash
npm install package-name
```

### Types
```bash
npm install --save-dev @types/package-name
```

## 🎨 Common UI Patterns

### Card
```typescript
<View style={[styles.card, Shadows.base]}>
  <Text style={styles.cardTitle}>Title</Text>
  <Text style={styles.cardContent}>Content</Text>
</View>
```

### List Item
```typescript
<TouchableOpacity style={styles.listItem} onPress={onPress}>
  <Text style={styles.listItemText}>{title}</Text>
  <Text style={styles.listItemSubtext}>{subtitle}</Text>
</TouchableOpacity>
```

### Loading Spinner
```typescript
import { ActivityIndicator } from 'react-native';

<ActivityIndicator size="large" color={Colors.primary} />
```

### Modal
```typescript
import { Modal } from 'react-native';

<Modal
  visible={isVisible}
  animationType="slide"
  transparent
  onRequestClose={onClose}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Content */}
    </View>
  </View>
</Modal>
```

## ⚡ Performance

### Memoization
```typescript
import React, { useMemo, useCallback } from 'react';

// Memoize component
const MyComponent = React.memo<Props>(({ data }) => {
  // ...
});

// Memoize value
const expensiveValue = useMemo(() => {
  return computeExpensive(data);
}, [data]);

// Memoize function
const handlePress = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### FlatList Optimization
```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={21}
/>
```

## 🔐 Environment Variables

```typescript
// Access
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const env = process.env.EXPO_PUBLIC_ENV;

// Note: Must be prefixed with EXPO_PUBLIC_
```

## 📱 Safe Area

```typescript
import { SafeAreaView } from 'react-native';

<SafeAreaView style={styles.container}>
  {/* Content */}
</SafeAreaView>
```

---

**Quick Tip**: Bookmark this file for instant reference while coding! 🔖




