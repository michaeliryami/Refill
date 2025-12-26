/**
 * Home Screen
 * 
 * Main landing screen for the Refill application.
 * Demonstrates best practices for screen components.
 * 
 * @module screens/HomeScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { Button } from '../components/Button';
import { Colors, Typography, Spacing, Shadows } from '../utils/constants';

/**
 * HomeScreen Component
 * 
 * @example
 * ```tsx
 * <HomeScreen />
 * ```
 */
export const HomeScreen: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handle button press with simulated async operation
   */
  const handleIncrement = async (): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setCount((prev) => prev + 1);
    setIsLoading(false);
  };

  /**
   * Reset counter
   */
  const handleReset = (): void => {
    setCount(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Refill</Text>
          <Text style={styles.subtitle}>
            Your React Native journey starts here
          </Text>
        </View>

        {/* Platform Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Platform Information</Text>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Platform" value={Platform.OS} />
            <InfoRow label="Version" value={Platform.Version.toString()} />
            <InfoRow 
              label="Environment" 
              value={process.env.EXPO_PUBLIC_ENV || 'development'} 
            />
          </View>
        </View>

        {/* Counter Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Interactive Counter</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.counterDisplay}>
              <Text style={styles.counterLabel}>Current Count</Text>
              <Text style={styles.counterValue}>{count}</Text>
            </View>

            <View style={styles.buttonGroup}>
              <Button
                variant="primary"
                size="large"
                onPress={handleIncrement}
                loading={isLoading}
                fullWidth
                testID="increment-button"
              >
                Increment
              </Button>

              <View style={styles.buttonSpacer} />

              <Button
                variant="outline"
                size="large"
                onPress={handleReset}
                disabled={count === 0}
                fullWidth
                testID="reset-button"
              >
                Reset
              </Button>
            </View>
          </View>
        </View>

        {/* Features Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Key Features</Text>
          </View>
          <View style={styles.cardContent}>
            <FeatureItem 
              icon="✓" 
              title="TypeScript" 
              description="Full type safety across the codebase"
            />
            <FeatureItem 
              icon="⚡" 
              title="Expo SDK 54" 
              description="Latest Expo features and APIs"
            />
            <FeatureItem 
              icon="🎨" 
              title="Design System" 
              description="Consistent UI components and patterns"
            />
            <FeatureItem 
              icon="🔧" 
              title="Custom Hooks" 
              description="Reusable business logic"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with best practices by engineers who care
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * InfoRow Component - Helper for displaying key-value pairs
 */
interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/**
 * FeatureItem Component - Helper for displaying features
 */
interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

/**
 * Styles
 */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },
  
  // Header
  header: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.base,
  },
  cardHeader: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  cardContent: {
    padding: Spacing.md,
  },
  
  // Info Row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  infoValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Counter
  counterDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
  },
  counterLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  counterValue: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  
  // Button Group
  buttonGroup: {
    width: '100%',
  },
  buttonSpacer: {
    height: Spacing.md,
  },
  
  // Feature Item
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: Typography.fontSize['2xl'],
    marginRight: Spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});




