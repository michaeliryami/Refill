/**
 * Amenity Survey Component
 * 
 * Component for users to report restaurant amenities
 * 
 * @module components/AmenitySurvey
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../utils/constants';
import type { RestaurantAmenities } from '../types';

export interface AmenitySurveyProps {
  initialAmenities?: RestaurantAmenities;
  onSubmit: (amenities: RestaurantAmenities) => Promise<void>;
  onCancel?: () => void;
}

interface AmenityOption {
  key: keyof Omit<RestaurantAmenities, 'verifiedAt' | 'reportedBy' | 'freeRefillsStats' | 'breadBasketStats' | 'payAtTableStats' | 'attendantStats'>;
  label: string;
  iconName: string;
  iconLibrary: 'ionicons' | 'material';
  description: string;
}

const amenityOptions: AmenityOption[] = [
  {
    key: 'freeRefills',
    label: 'Free Refills',
    iconName: 'water',
    iconLibrary: 'ionicons',
    description: 'Fountain drinks',
  },
  {
    key: 'breadBasket',
    label: 'Bread',
    iconName: 'food',
    iconLibrary: 'material',
    description: 'Free basket',
  },
  {
    key: 'payAtTable',
    label: 'Pay at Table',
    iconName: 'credit-card',
    iconLibrary: 'material',
    description: 'Toast or Clover',
  },
  {
    key: 'attendant',
    label: 'Bathroom Attendant',
    iconName: 'person',
    iconLibrary: 'ionicons',
    description: 'Tip expected',
  },
];

export const AmenitySurvey: React.FC<AmenitySurveyProps> = ({
  initialAmenities,
  onSubmit,
  onCancel,
}) => {
  const [amenities, setAmenities] = useState<RestaurantAmenities>(
    initialAmenities || {
      freeRefills: null,
      breadBasket: null,
      payAtTable: null,
      attendant: null,
      baseScore: 5,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [baseScore, setBaseScore] = useState(initialAmenities?.baseScore || 5);

  const toggleAmenity = (key: keyof Omit<RestaurantAmenities, 'verifiedAt' | 'reportedBy' | 'freeRefillsStats' | 'breadBasketStats' | 'payAtTableStats' | 'attendantStats'>): void => {
    setAmenities((prev: RestaurantAmenities) => ({
      ...prev,
      [key]: prev[key] === null ? true : prev[key] === true ? false : null,
    }));
  };

  const getButtonColor = (value: boolean | null): string => {
    if (value === true) return '#10B981'; // Green for YES
    if (value === false) return '#EF4444'; // Red for NO
    return '#9CA3AF'; // Gray for not answered
  };

  const getButtonText = (value: boolean | null): string => {
    if (value === true) return 'YES';
    if (value === false) return 'NO';
    return '?';
  };

  const getButtonTextColor = (value: boolean | null): string => {
    return Colors.white; // White text for all states for better contrast
  };

  const canSubmit = Object.values(amenities).some(v => v !== null);

  const handleSubmit = async (): Promise<void> => {
    if (!canSubmit || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ ...amenities, baseScore });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Amenities</Text>
      <Text style={styles.subtitle}>
        Help others by sharing what amenities this restaurant offers
      </Text>

      {/* Experience Score Slider */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreQuestion}>general vibe & food rating</Text>
        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreValue}>{baseScore.toFixed(1)}</Text>
          <Text style={styles.scoreMax}> / 10</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={0.1}
          value={baseScore}
          onValueChange={setBaseScore}
          minimumTrackTintColor="#10B981"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#10B981"
        />
        <View style={styles.scoreLabels}>
          <Text style={styles.scoreLabel}>Poor</Text>
          <Text style={styles.scoreLabel}>Excellent</Text>
        </View>
      </View>

      <View style={styles.amenitiesGrid}>
        {amenityOptions.map((option) => (
          <View key={option.key} style={styles.amenityCard}>
            <View style={styles.amenityHeader}>
              <View style={styles.iconCircle}>
                {option.iconLibrary === 'material' ? (
                  <MaterialCommunityIcons name={option.iconName as any} size={24} color="#1F2937" />
                ) : (
                  <Ionicons name={option.iconName as any} size={24} color="#1F2937" />
                )}
              </View>
              <View style={styles.amenityInfo}>
                <Text style={styles.amenityLabel}>{option.label}</Text>
                <Text style={styles.amenityDescription}>{option.description}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.amenityButton,
                { backgroundColor: getButtonColor(amenities[option.key] as boolean | null) }
              ]}
              onPress={() => toggleAmenity(option.key)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.amenityButtonText,
                { color: getButtonTextColor(amenities[option.key] as boolean | null) }
              ]}>
                {getButtonText(amenities[option.key] as boolean | null)}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        {onCancel && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.submitButton,
            (!canSubmit || isSubmitting) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  scoreSection: {
    backgroundColor: '#F9FAFB',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scoreQuestion: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  scoreDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: Typography.fontWeight.bold,
    color: '#10B981',
  },
  scoreMax: {
    fontSize: Typography.fontSize.xl,
    color: Colors.textSecondary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  scoreLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  scoreLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  amenitiesGrid: {
    gap: Spacing.md,
  },
  amenityCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 72,
  },
  amenityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  amenityInfo: {
    flex: 1,
  },
  amenityLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
    flexShrink: 1,
  },
  amenityDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  amenityButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.base,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amenityButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.base,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.lg,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },
  submitButton: {
    backgroundColor: '#FFEB3B',
    paddingVertical: Spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
});

