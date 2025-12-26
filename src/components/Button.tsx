/**
 * Button Component
 * 
 * A reusable, accessible button component with multiple variants and states.
 * Implements best practices for React Native UI components.
 * 
 * @module components/Button
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';

/**
 * Button Variants
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/**
 * Button Sizes
 */
type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button Props Interface
 */
export interface ButtonProps {
  /** Button text content */
  children: string;
  
  /** Click handler */
  onPress: () => void;
  
  /** Visual variant */
  variant?: ButtonVariant;
  
  /** Button size */
  size?: ButtonSize;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state - shows spinner */
  loading?: boolean;
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Custom styles */
  style?: ViewStyle;
  
  /** Custom text styles */
  textStyle?: TextStyle;
  
  /** Accessibility label */
  accessibilityLabel?: string;
  
  /** Test ID for testing */
  testID?: string;
}

/**
 * Button Component
 * 
 * Production-ready button component with comprehensive prop support.
 * 
 * @example
 * ```tsx
 * <Button 
 *   variant="primary" 
 *   size="large"
 *   onPress={() => console.log('Pressed')}
 *   loading={isLoading}
 * >
 *   Submit
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}) => {
  /**
   * Determine if button is interactive
   */
  const isDisabled = disabled || loading;

  /**
   * Get variant-specific styles
   */
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'ghost':
        return styles.ghostButton;
      default:
        return styles.primaryButton;
    }
  };

  /**
   * Get variant-specific text styles
   */
  const getVariantTextStyles = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  /**
   * Get size-specific styles
   */
  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return { button: styles.smallButton, text: styles.smallText };
      case 'medium':
        return { button: styles.mediumButton, text: styles.mediumText };
      case 'large':
        return { button: styles.largeButton, text: styles.largeText };
      default:
        return { button: styles.mediumButton, text: styles.mediumText };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        sizeStyles.button,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            color={variant === 'primary' ? '#fff' : '#007AFF'}
            size="small"
          />
        </View>
      ) : (
        <Text
          style={[
            styles.text,
            getVariantTextStyles(),
            sizeStyles.text,
            isDisabled && styles.disabledText,
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variants
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#5856D6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mediumButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  largeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  
  // Text base
  text: {
    fontWeight: '600',
  },
  
  // Text variants
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#007AFF',
  },
  ghostText: {
    color: '#007AFF',
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  fullWidth: {
    width: '100%',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});






