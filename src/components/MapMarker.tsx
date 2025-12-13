/**
 * Custom Map Marker Component
 * 
 * Color-coded markers for the map based on refill score
 * 
 * @module components/MapMarker
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

export interface MapMarkerProps {
  type: 'refill' | 'bread' | 'restaurant';
  size?: number;
  score?: number; // 0-100 percentage score for refills (future implementation)
}

export const MapMarker = memo<MapMarkerProps>(({ type, size = 16, score = 0 }) => {
  // For now, use type-based colors. Later, use score-based gradient
  const getMarkerColor = (): string => {
    // TODO: Implement score-based coloring when backend is ready
    // For now, color code by type
    switch (type) {
      case 'refill':
        return '#10B981'; // Green - has free refills
      case 'bread':
        return '#F59E0B'; // Amber - has bread basket
      case 'restaurant':
      default:
        return '#6B7280'; // Gray - no data yet
    }
  };

  return (
    <View style={[styles.marker, { 
      backgroundColor: getMarkerColor(), 
      width: size, 
      height: size, 
      borderRadius: size / 2 
    }]} />
  );
});

const styles = StyleSheet.create({
  marker: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

