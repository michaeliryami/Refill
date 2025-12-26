/**
 * Restaurant Details Component
 * 
 * Displays restaurant information and amenities in a bottom sheet
 * 
 * @module components/RestaurantDetails
 */

import React, { useState, memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../utils/constants';
import type { Restaurant } from '../types';
import { AmenitySurvey } from './AmenitySurvey';
import { getScoreColor, getScoreLabel } from '../utils/scoreCalculator';

export interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onClose: () => void;
  onReport: (restaurantId: string, amenities: any) => Promise<void>;
}

const RestaurantDetailsComponent: React.FC<RestaurantDetailsProps> = ({
  restaurant,
  onClose,
  onReport,
}) => {
  const [showSurvey, setShowSurvey] = useState(false);

  const openDirections = useCallback((): void => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.location.latitude},${restaurant.location.longitude}`;
    Linking.openURL(url);
  }, [restaurant.location]);

  const formatDistance = useCallback((distance?: number): string => {
    if (!distance) return '';
    return `${distance} mi away`;
  }, []);

  const renderAmenityStatus = (
    value: boolean | null,
    stats: { yes: number; no: number; total: number } | undefined,
    label: string,
    iconName: string,
    iconLibrary: 'ionicons' | 'material' = 'ionicons',
    invertColors: boolean = false // For bathroom attendant where "no" is good
  ): React.ReactElement => {
    const totalReports = stats?.total || 0;
    const yesCount = stats?.yes || 0;
    const noCount = stats?.no || 0;
    const idkCount = totalReports - yesCount - noCount;
    
    // Calculate percentages for the bar
    const yesPercent = totalReports > 0 ? (yesCount / totalReports) * 100 : 0;
    const noPercent = totalReports > 0 ? (noCount / totalReports) * 100 : 0;
    const idkPercent = totalReports > 0 ? (idkCount / totalReports) * 100 : 0;

    return (
      <View style={styles.amenityCard}>
        <View style={styles.amenityIconCircle}>
          {iconLibrary === 'material' ? (
            <MaterialCommunityIcons name={iconName as any} size={28} color="#1F2937" />
          ) : (
            <Ionicons name={iconName as any} size={28} color="#1F2937" />
          )}
        </View>
        <View style={styles.amenityContent}>
          <Text style={styles.amenityLabel}>{label}</Text>
          {totalReports > 0 ? (
            <Text style={styles.reportCount}>{totalReports} {totalReports === 1 ? 'report' : 'reports'}</Text>
          ) : (
            <Text style={styles.reportCount}>No reports</Text>
          )}
        </View>

        {totalReports > 0 && (
          <>
            <View style={styles.percentageBar}>
              {yesPercent > 0 && (
                <View style={[
                  styles.barSegment, 
                  invertColors ? styles.noBar : styles.yesBar, 
                  { width: `${yesPercent}%` }
                ]} />
              )}
              {noPercent > 0 && (
                <View style={[
                  styles.barSegment, 
                  invertColors ? styles.yesBar : styles.noBar, 
                  { width: `${noPercent}%` }
                ]} />
              )}
              {idkPercent > 0 && (
                <View style={[styles.barSegment, styles.idkBar, { width: `${idkPercent}%` }]} />
              )}
            </View>
            <View style={styles.barLabels}>
              <View style={styles.barLabelItem}>
                <View style={[styles.barLabelDot, { backgroundColor: invertColors ? '#EF4444' : '#10B981' }]} />
                <Text style={styles.barLabelText}>YES ({yesCount})</Text>
              </View>
              <View style={styles.barLabelItem}>
                <View style={[styles.barLabelDot, { backgroundColor: invertColors ? '#10B981' : '#EF4444' }]} />
                <Text style={styles.barLabelText}>NO ({noCount})</Text>
              </View>
              {idkCount > 0 && (
                <View style={styles.barLabelItem}>
                  <View style={[styles.barLabelDot, { backgroundColor: '#9CA3AF' }]} />
                  <Text style={styles.barLabelText}>? ({idkCount})</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    );
  };

  if (showSurvey) {
    return (
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        <AmenitySurvey
          initialAmenities={restaurant.amenities}
          onSubmit={async (amenities) => {
            await onReport(restaurant.id, amenities);
            setShowSurvey(false);
          }}
          onCancel={() => setShowSurvey(false)}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={11}
      scrollEventThrottle={16}
      bounces={true}
      nestedScrollEnabled={true}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={28} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        
        {restaurant.distance && (
          <View style={styles.distanceRow}>
            <Ionicons name="location" size={14} color="#6B7280" style={{ marginRight: 4 }} />
            <Text style={styles.distance}>{formatDistance(restaurant.distance)} away</Text>
          </View>
        )}

        <View style={styles.statusRow}>
          {restaurant.isOpen !== undefined && (
            <View style={[styles.statusBadge, restaurant.isOpen ? styles.openBadge : styles.closedBadge]}>
              <Text style={[styles.statusText, restaurant.isOpen ? styles.openText : styles.closedText]}>
                {restaurant.isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          )}
          {restaurant.closingTime && restaurant.isOpen && (
            <Text style={styles.closingTime}>Closes {restaurant.closingTime}</Text>
          )}
        </View>
      </View>

      {/* Score Display */}
      {restaurant.score !== undefined && restaurant.score !== null && (
        <View style={styles.scoreContainer}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Overall Score</Text>
            <View style={styles.scoreValueContainer}>
              <Text style={[styles.scoreNumber, { color: getScoreColor(restaurant.score) }]}>
                {restaurant.score.toFixed(1)}
              </Text>
              <Text style={styles.scoreOutOf}> / 10</Text>
            </View>
          </View>
          <View style={styles.scoreBarContainer}>
            <View 
              style={[
                styles.scoreBar, 
                { 
                  width: `${(restaurant.score / 10) * 100}%`,
                  backgroundColor: getScoreColor(restaurant.score) 
                }
              ]} 
            />
          </View>
          <Text style={styles.scoreLabel}>{getScoreLabel(restaurant.score)}</Text>
        </View>
      )}

      {/* Essentials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Essentials</Text>

        <View style={styles.amenitiesList}>
          {renderAmenityStatus(
            restaurant.amenities.freeRefills,
            restaurant.amenities.freeRefillsStats,
            'Free Refills',
            'water',
            'ionicons'
          )}
          {renderAmenityStatus(
            restaurant.amenities.breadBasket,
            restaurant.amenities.breadBasketStats,
            'Bread Basket',
            'food',
            'material'
          )}
          {renderAmenityStatus(
            restaurant.amenities.payAtTable,
            restaurant.amenities.payAtTableStats,
            'Pay at Table',
            'credit-card',
            'material'
          )}
          {renderAmenityStatus(
            restaurant.amenities.attendant,
            restaurant.amenities.attendantStats,
            'Bathroom Attendant',
            'person',
            'ionicons',
            true // Invert colors - NO is good!
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.reportButton]}
          onPress={() => setShowSurvey(true)}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.reportText}>Share Your Intel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.directionsButton]}
          onPress={openDirections}
        >
          <Ionicons name="navigate" size={18} color="#1F2E39" style={{ marginRight: 6 }} />
          <Text style={styles.directionsText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const RestaurantDetails = memo(RestaurantDetailsComponent);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.md,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  distance: {
    fontSize: Typography.fontSize.sm,
    color: '#6B7280',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  openBadge: {
    backgroundColor: '#E8F5E9',
  },
  closedBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  openText: {
    color: '#2E7D32',
  },
  closedText: {
    color: '#C62828',
  },
  closingTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  scoreContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  scoreTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  scoreOutOf: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
  },
  scoreBarContainer: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  scoreBar: {
    height: '100%',
    borderRadius: 6,
  },
  scoreLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: Spacing.lg,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  amenityCard: {
    width: '47%',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    minHeight: 145,
  },
  amenityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  amenityContent: {
    flex: 1,
    marginBottom: Spacing.sm,
  },
  amenityLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
    minHeight: 32,
  },
  reportCount: {
    fontSize: Typography.fontSize.xs,
    color: '#9CA3AF',
  },
  percentageBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  barSegment: {
    height: '100%',
  },
  yesBar: {
    backgroundColor: '#10B981', // Green
  },
  noBar: {
    backgroundColor: '#EF4444', // Red
  },
  idkBar: {
    backgroundColor: '#9CA3AF', // Gray
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
    flexWrap: 'wrap',
  },
  barLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barLabelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  barLabelText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: Typography.fontWeight.semibold,
  },
  actions: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.base,
    gap: Spacing.sm,
  },
  reportButton: {
    backgroundColor: '#1F2E39',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    ...Shadows.base,
  },
  reportText: {
    fontSize: Typography.fontSize.xl,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.bold,
  },
  directionsButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1F2E39',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  directionsText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: '#1F2E39',
  },
});

