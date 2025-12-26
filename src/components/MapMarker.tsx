/**
 * Custom Map Marker Component
 * 
 * Color-coded markers for the map based on restaurant data and score
 * 
 * @module components/MapMarker
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface MapMarkerProps {
  type: 'refill' | 'bread' | 'restaurant';
  size?: number;
  score?: number; // 0-10 score
  name?: string;
  hasData?: boolean; // Whether restaurant has any reported data
}

export const MapMarker = memo<MapMarkerProps>(({ 
  type, 
  size = 24, 
  score, 
  name,
  hasData = false 
}) => {
  /**
   * Get marker color based on score or amenity type
   */
  const getMarkerColor = (): string => {
    // If we have a score, use score-based coloring
    if (score !== undefined && score !== null) {
      if (score >= 7) return '#10B981'; // Green - excellent
      if (score >= 5) return '#F59E0B'; // Amber - good
      if (score >= 3) return '#EF4444'; // Red - poor
      return '#9CA3AF'; // Gray - very poor
    }
    
    // If we have amenity data but no score, use type-based colors
    if (hasData) {
      switch (type) {
        case 'refill':
          return '#10B981'; // Green - has free refills
        case 'bread':
          return '#F59E0B'; // Amber - has bread basket
        default:
          return '#3B82F6'; // Blue - has some data
      }
    }
    
    // No data - grey
    return '#9CA3AF';
  };

  return (
    <View style={styles.container}>
      {name && (
        <View style={styles.nameContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {name}
          </Text>
        </View>
      )}
      <View style={[styles.marker, { 
        backgroundColor: getMarkerColor(), 
        width: size, 
        height: size, 
        borderRadius: size / 2 
      }]}>
        <Ionicons 
          name="restaurant" 
          size={size * 0.5} 
          color="#FFFFFF" 
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  nameContainer: {
    backgroundColor: 'rgba(31, 46, 57, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
    maxWidth: 120,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  marker: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

