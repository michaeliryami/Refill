# Development Guide

## 📁 Project Structure

```
/Refill
├── App.tsx                     # Root application component
├── index.ts                    # Entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config with path aliases
├── .eslintrc.js                # ESLint configuration
├── .gitignore                  # Git ignore rules
│
├── src/                        # Source code
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   └── index.ts           # Component exports
│   │
│   ├── screens/               # Screen components
│   │   ├── HomeScreen.tsx
│   │   └── index.ts          # Screen exports
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useApi.ts
│   │   └── index.ts
│   │
│   ├── utils/                # Utility functions
│   │   ├── api.ts           # API client
│   │   └── constants.ts     # Design system constants
│   │
│   └── types/               # TypeScript type definitions
│       └── index.ts
│
└── assets/                  # Static assets
    ├── icon.png
    ├── splash-icon.png
    └── ...
```

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
- **Components**: Pure UI components with minimal business logic
- **Screens**: Composed of components, handle screen-level state
- **Hooks**: Encapsulate reusable stateful logic
- **Utils**: Pure functions and constants

### 2. **Type Safety**
- All functions have explicit return types
- Strict TypeScript configuration enabled
- Interface-driven development

### 3. **Code Organization**
- Path aliases for clean imports (`@components`, `@hooks`, etc.)
- Index files for clean exports
- One component per file

### 4. **Performance**
- Memoization where appropriate
- Lazy loading for heavy components
- Optimized re-renders

## 🔧 Development Workflow

### Starting Development

```bash
# Clear cache and start
npm run dev

# Start normally
npm start
```

### Using Path Aliases

```typescript
// ✅ Good - using path aliases
import { Button } from '@components';
import { useApi } from '@hooks';
import { Colors } from '@utils/constants';

// ❌ Bad - relative paths
import { Button } from '../../components/Button';
```

### Creating a New Component

1. **Create the component file:**

```typescript
// src/components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

2. **Export from index:**

```typescript
// src/components/index.ts
export { Card } from './Card';
export type { CardProps } from './Card';
```

3. **Use in your app:**

```typescript
import { Card } from '@components';

<Card title="My Card">
  <Text>Content here</Text>
</Card>
```

### Creating a Custom Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { api } from '@utils/api';
import type { User } from '@types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    setUser(response.data.user);
    api.setAuthToken(response.data.token);
  };

  const logout = () => {
    setUser(null);
    api.setAuthToken(null);
  };

  return { user, isLoading, login, logout };
}
```

### Making API Calls

```typescript
import { useApi } from '@hooks';
import { api } from '@utils/api';

function MyComponent() {
  const { data, isLoading, error, execute } = useApi(
    async (userId: string) => {
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    }
  );

  useEffect(() => {
    execute('user-123');
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  return <UserProfile user={data} />;
}
```

## 🎨 Design System Usage

### Colors

```typescript
import { Colors } from '@utils/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundPrimary,
  },
  text: {
    color: Colors.textPrimary,
  },
});
```

### Typography

```typescript
import { Typography } from '@utils/constants';

const styles = StyleSheet.create({
  heading: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
});
```

### Spacing

```typescript
import { Spacing } from '@utils/constants';

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
});
```

## 🧪 Testing (Coming Soon)

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native

# Run tests
npm test
```

Example test:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@components';

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>Click Me</Button>
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## 📱 Platform-Specific Code

```typescript
import { Platform } from 'react-native';

// Method 1: Platform.select
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

// Method 2: Platform.OS
const padding = Platform.OS === 'ios' ? 60 : 40;

// Method 3: Platform-specific files
// Component.ios.tsx
// Component.android.tsx
// Component.tsx (default)
```

## 🚀 Performance Tips

1. **Use React.memo for expensive components:**

```typescript
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Component logic
});
```

2. **Use useCallback for functions:**

```typescript
const handlePress = useCallback(() => {
  doSomething();
}, [dependencies]);
```

3. **Use useMemo for expensive calculations:**

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

4. **Optimize FlatList:**

```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={21}
/>
```

## 📦 Adding Dependencies

```bash
# Add a package
npm install package-name

# Add Expo package
npx expo install package-name

# Add dev dependency
npm install --save-dev package-name
```

## 🔐 Environment Variables

Create different env files for different environments:

- `.env.development`
- `.env.staging`
- `.env.production`

Access in code:

```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

**Note:** All Expo environment variables must be prefixed with `EXPO_PUBLIC_`.

## 🐛 Debugging

### React Native Debugger
1. Install React Native Debugger
2. Start your app
3. Press `Cmd/Ctrl + D` in simulator
4. Select "Debug"

### Flipper
```bash
npx expo install expo-dev-client
npx expo run:ios
# or
npx expo run:android
```

### Console Logs
```typescript
console.log('Debug info');
console.warn('Warning');
console.error('Error');
```

## 📚 Best Practices

1. **Always define prop types with TypeScript interfaces**
2. **Use functional components with hooks**
3. **Keep components small and focused**
4. **Extract reusable logic into custom hooks**
5. **Use the design system constants**
6. **Write self-documenting code with JSDoc comments**
7. **Handle errors gracefully**
8. **Test on both iOS and Android**
9. **Use SafeAreaView for safe areas**
10. **Follow the established folder structure**

## 🤝 Code Review Checklist

- [ ] TypeScript types are defined for all props and functions
- [ ] Components have proper prop validation
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Code follows the style guide
- [ ] No console.logs in production code
- [ ] Responsive on different screen sizes
- [ ] Tested on iOS and Android
- [ ] Follows accessibility guidelines
- [ ] Documentation is updated

## 🎓 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Hooks](https://react.dev/reference/react)

