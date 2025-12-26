/**
 * Map Screen
 * 
 * Main screen showing map with restaurant markers and search functionality
 * 
 * @module screens/MapScreen
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  PanResponder,
  Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@utils/constants';
import type { Restaurant, Location as LocationType, MapRegion } from '@types';
import { searchNearbyRestaurants, searchRestaurantsByText } from '@utils/googlePlaces';
import { getMultipleRestaurantAmenities, submitRestaurantReport } from '@utils/supabase';
import { RestaurantDetails } from '@components/RestaurantDetails';
import { MapMarker } from '@components/MapMarker';
import { SuccessModal } from '@components/SuccessModal';

// Will be set to user location when available

export const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<MapRegion | null>(null);
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Array<'refills' | 'bread' | 'payAtTable' | 'attendant'>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Restaurant[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const mapRef = useRef<MapView>(null);
  const modalTranslateY = useRef(new Animated.Value(0)).current;

  /**
   * Pan responder for swipe to dismiss on drag handle only
   * Only responds to gestures on the drag handle, not the scrollable content
   */
  const dragHandlePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only respond to downward swipes
          return gestureState.dy > 5;
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            modalTranslateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 100 || gestureState.vy > 0.5) {
            // Swipe down threshold exceeded, close modal
            Animated.timing(modalTranslateY, {
              toValue: 600,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              setModalVisible(false);
              setSelectedRestaurant(null);
              modalTranslateY.setValue(0);
            });
          } else {
            // Reset position
            Animated.spring(modalTranslateY, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          // Reset if gesture is interrupted
          Animated.spring(modalTranslateY, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }).start();
        },
      }),
    [modalTranslateY]
  );

  /**
   * Request location permissions and get user location
   */
  useEffect(() => {
    let isMounted = true;
    
    (async () => {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert(
            'Location Permission',
            'Refill needs location access to show nearby restaurants.',
            [{ text: 'OK' }]
          );
          if (isMounted) {
            setInitialLoad(false);
          }
          return;
        }

        // Get location with high accuracy
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        if (!isMounted) return;

        const userLoc: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        
        setUserLocation(userLoc);
        
        const newRegion = {
          ...userLoc,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(newRegion);
        
        // Animate to user location
        mapRef.current?.animateToRegion(newRegion, 1000);

        // Load nearby restaurants immediately
        loadNearbyRestaurants(userLoc);
        setInitialLoad(false);
      } catch (error) {
        console.error('Error getting location:', error);
        if (isMounted) {
          setInitialLoad(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Load nearby restaurants and their amenity data from Supabase
   */
  const loadNearbyRestaurants = async (location: LocationType): Promise<void> => {
    // Don't show loading for initial load - just load in background
    const wasInitialLoad = initialLoad;
    if (!wasInitialLoad) {
      setIsLoading(true);
    }
    
    try {
      // Get restaurants from Google Places
      const results = await searchNearbyRestaurants(location, 5000);
      
      // Fetch amenity data from Supabase for all restaurants
      const placeIds = results.map(r => r.placeId);
      console.log('📍 Loading amenities for', placeIds.length, 'restaurants');
      const dataMap = await getMultipleRestaurantAmenities(placeIds);
      console.log('📊 Got data for', dataMap.size, 'restaurants from Supabase');
      
      // Merge amenity data and scores with restaurant data
      const restaurantsWithAmenities = results.map(restaurant => {
        const data = dataMap.get(restaurant.placeId);
        if (data) {
          console.log(`✨ Found data for ${restaurant.name}:`, {
            score: data.score,
            hasStats: !!data.amenities.freeRefillsStats,
            totalReports: data.amenities.freeRefillsStats?.total || 0
          });
        }
        return {
          ...restaurant,
          amenities: data?.amenities || restaurant.amenities,
          score: data?.score,
        };
      });
      
      setRestaurants(restaurantsWithAmenities);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setRestaurants([]);
    } finally {
      if (!wasInitialLoad) {
        setIsLoading(false);
      }
    }
  };

  /**
   * Handle search as user types
   */
  const handleSearchInput = useCallback(async (text: string): Promise<void> => {
    setSearchQuery(text);
    
    if (text.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const searchLocation = userLocation || {
        latitude: 39.8283,
        longitude: -98.5795,
      };

      const results = await searchRestaurantsByText(text, searchLocation);
      
      // Fetch amenity data for search results
      const placeIds = results.map(r => r.placeId);
      const dataMap = await getMultipleRestaurantAmenities(placeIds);
      
      // Merge amenity data with search results
      const resultsWithAmenities = results.map(restaurant => {
        const data = dataMap.get(restaurant.placeId);
        return {
          ...restaurant,
          amenities: data?.amenities || restaurant.amenities,
          score: data?.score,
        };
      });
      
      setSearchSuggestions(resultsWithAmenities.slice(0, 5)); // Show top 5 results
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchSuggestions([]);
    }
  }, [userLocation]);

  /**
   * Handle selecting a search suggestion
   */
  const handleSelectSuggestion = useCallback(async (restaurant: Restaurant): Promise<void> => {
    setSearchQuery(restaurant.name);
    setShowSuggestions(false);
    
    // Fetch amenity data for the selected restaurant
    console.log('🔎 Fetching data for selected restaurant:', restaurant.placeId);
    const dataMap = await getMultipleRestaurantAmenities([restaurant.placeId]);
    const data = dataMap.get(restaurant.placeId);
    
    // Update restaurant with amenity data
    const updatedRestaurant = {
      ...restaurant,
      amenities: data?.amenities || restaurant.amenities,
      score: data?.score,
    };
    
    console.log('Selected restaurant data:', {
      name: updatedRestaurant.name,
      hasData: !!data,
      score: updatedRestaurant.score
    });
    
    setRestaurants([updatedRestaurant]);
    
    // Pan to selected restaurant
    const newRegion = {
      latitude: updatedRestaurant.location.latitude,
      longitude: updatedRestaurant.location.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
    
    // Open the restaurant details modal
    setSelectedRestaurant(updatedRestaurant);
    setModalVisible(true);
  }, []);

  /**
   * Handle marker press
   */
  const handleMarkerPress = useCallback((restaurant: Restaurant): void => {
    modalTranslateY.setValue(0);
    setSelectedRestaurant(restaurant);
    setModalVisible(true);
  }, [modalTranslateY]);
  
  /**
   * Handle modal close
   */
  const handleCloseModal = useCallback(() => {
    modalTranslateY.setValue(0);
    setModalVisible(false);
    setSelectedRestaurant(null);
  }, [modalTranslateY]);

  /**
   * Handle report submission
   */
  const handleReport = useCallback(async (restaurantId: string, amenities: any): Promise<void> => {
    try {
      // Submit to Supabase
      const success = await submitRestaurantReport(restaurantId, amenities);
      
      if (!success) {
        Alert.alert('Error', 'Failed to submit report. Please try again.');
        return;
      }

      // Fetch updated data from Supabase
      const dataMap = await getMultipleRestaurantAmenities([restaurantId]);
      const updatedData = dataMap.get(restaurantId);
      
      if (updatedData) {
        // Update local state with real data from Supabase
        setRestaurants(prev =>
          prev.map(r =>
            r.id === restaurantId
              ? { ...r, amenities: updatedData.amenities, score: updatedData.score }
              : r
          )
        );

        if (selectedRestaurant?.id === restaurantId) {
          setSelectedRestaurant(prev =>
            prev ? { ...prev, amenities: updatedData.amenities, score: updatedData.score } : null
          );
        }
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  }, [selectedRestaurant]);

  /**
   * Toggle filter selection
   */
  const toggleFilter = useCallback((filter: 'refills' | 'bread' | 'payAtTable' | 'attendant') => {
    setSelectedFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  }, []);

  /**
   * Filter restaurants based on selected filters
   */
  const filteredRestaurants = useMemo((): Restaurant[] => {
    if (selectedFilters.length === 0) {
      return restaurants;
    }

    return restaurants.filter(restaurant => {
      return selectedFilters.every(filter => {
        switch (filter) {
          case 'refills':
            return restaurant.amenities.freeRefills === true;
          case 'bread':
            return restaurant.amenities.breadBasket === true;
          case 'payAtTable':
            return restaurant.amenities.payAtTable === true;
          case 'attendant':
            return restaurant.amenities.attendant === true;
          default:
            return true;
        }
      });
    });
  }, [restaurants, selectedFilters]);

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region || {
          latitude: 39.8283,
          longitude: -98.5795,
          latitudeDelta: 50,
          longitudeDelta: 50,
        }}
        showsUserLocation
        showsMyLocationButton
        zoomEnabled
        zoomControlEnabled
        pitchEnabled
        rotateEnabled
        scrollEnabled
        onPress={() => {
          setShowSuggestions(false);
          setShowFilters(false);
          Keyboard.dismiss();
        }}
      >
        {filteredRestaurants.map((restaurant, index) => {
          // Determine if restaurant has any reported data
          const hasData = 
            restaurant.amenities.freeRefillsStats?.total || 
            restaurant.amenities.breadBasketStats?.total || 
            restaurant.amenities.payAtTableStats?.total || 
            restaurant.amenities.attendantStats?.total || 
            false;

          // Only show names for first 15 closest restaurants to reduce render load
          const showName = index < 15;

          return (
            <Marker
              key={restaurant.id}
              coordinate={restaurant.location}
              onPress={() => handleMarkerPress(restaurant)}
              tracksViewChanges={false} // Critical for performance
            >
              <MapMarker
                type={
                  restaurant.amenities.freeRefills
                    ? 'refill'
                    : restaurant.amenities.breadBasket
                    ? 'bread'
                    : 'restaurant'
                }
                size={28}
                score={restaurant.score}
                name={showName ? restaurant.name : undefined}
                hasData={!!hasData}
              />
            </Marker>
          );
        })}
      </MapView>

      {/* Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchWrapper}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search restaurants..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={handleSearchInput}
                onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => {
                    setSearchQuery('');
                    setSearchSuggestions([]);
                    setShowSuggestions(false);
                    Keyboard.dismiss();
                    if (userLocation) {
                      loadNearbyRestaurants(userLocation);
                    }
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.filterButton} 
                onPress={() => {
                  setShowFilters(!showFilters);
                  setShowSuggestions(false);
                  Keyboard.dismiss();
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="menu" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {searchSuggestions.map((restaurant) => {
                // Calculate total review count
                const totalReviews = 
                  (restaurant.amenities.freeRefillsStats?.total || 0) +
                  (restaurant.amenities.breadBasketStats?.total || 0) +
                  (restaurant.amenities.payAtTableStats?.total || 0) +
                  (restaurant.amenities.attendantStats?.total || 0);
                
                const hasScore = restaurant.score !== undefined && restaurant.score !== null;
                
                return (
                  <TouchableOpacity
                    key={restaurant.id}
                    style={styles.suggestionItem}
                    onPress={() => {
                      handleSelectSuggestion(restaurant);
                      Keyboard.dismiss();
                    }}
                  >
                    <Ionicons name="location" size={18} color="#6B7280" style={styles.suggestionIcon} />
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionName}>{restaurant.name}</Text>
                      <Text style={styles.suggestionAddress}>{restaurant.address}</Text>
                      {hasScore && totalReviews > 0 && (
                        <View style={styles.suggestionScoreRow}>
                          <View style={styles.suggestionScoreBadge}>
                            <Text style={styles.suggestionScoreText}>
                              {restaurant.score.toFixed(1)}/10
                            </Text>
                          </View>
                          <Text style={styles.suggestionReviewCount}>
                            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                          </Text>
                        </View>
                      )}
                    </View>
                    {restaurant.distance && (
                      <Text style={styles.suggestionDistance}>{restaurant.distance} mi</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Filter Chips - Only show when menu is clicked */}
        {showFilters && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}
            contentContainerStyle={styles.filterChips}
          >
            <TouchableOpacity
              style={[styles.filterChip, selectedFilters.length === 0 && styles.filterChipActive]}
              onPress={() => setSelectedFilters([])}
            >
              <Text style={[styles.filterChipText, selectedFilters.length === 0 && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilters.includes('refills') && styles.filterChipActive]}
              onPress={() => toggleFilter('refills')}
            >
              <Ionicons 
                name="water" 
                size={16} 
                color={selectedFilters.includes('refills') ? '#FFFFFF' : '#6B7280'} 
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.filterChipText, selectedFilters.includes('refills') && styles.filterChipTextActive]}>
                Free Refills
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilters.includes('bread') && styles.filterChipActive]}
              onPress={() => toggleFilter('bread')}
            >
              <Ionicons 
                name="restaurant" 
                size={16} 
                color={selectedFilters.includes('bread') ? '#FFFFFF' : '#6B7280'} 
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.filterChipText, selectedFilters.includes('bread') && styles.filterChipTextActive]}>
                Bread
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilters.includes('payAtTable') && styles.filterChipActive]}
              onPress={() => toggleFilter('payAtTable')}
            >
              <Ionicons 
                name="card" 
                size={16} 
                color={selectedFilters.includes('payAtTable') ? '#FFFFFF' : '#6B7280'} 
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.filterChipText, selectedFilters.includes('payAtTable') && styles.filterChipTextActive]}>
                Pay at Table
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilters.includes('attendant') && styles.filterChipActive]}
              onPress={() => toggleFilter('attendant')}
            >
              <Ionicons 
                name="person" 
                size={16} 
                color={selectedFilters.includes('attendant') ? '#FFFFFF' : '#6B7280'} 
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.filterChipText, selectedFilters.includes('attendant') && styles.filterChipTextActive]}>
                Bathroom Attendant
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFEB3B" />
        </View>
      )}

      {/* Modal for Restaurant Details */}
      <Modal
        visible={modalVisible && selectedRestaurant !== null}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalOverlayTouchable}
            activeOpacity={1}
            onPress={handleCloseModal}
          />
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: modalTranslateY }],
              },
            ]}
          >
            {/* Drag handle - only this area triggers swipe to dismiss */}
            <View {...dragHandlePanResponder.panHandlers} style={styles.dragHandle}>
              <View style={styles.dragHandleLine} />
            </View>
            
            {/* Scrollable content - no pan responder interference */}
            {selectedRestaurant && (
              <RestaurantDetails
                restaurant={selectedRestaurant}
                onClose={handleCloseModal}
                onReport={handleReport}
              />
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Success!"
        message="Thank you for helping society!"
        onClose={() => setShowSuccessModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 1000,
  },
  searchWrapper: {
    position: 'relative',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadows.md,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    padding: 0,
  },
  clearButton: {
    marginLeft: Spacing.xs,
  },
  filterButton: {
    marginLeft: Spacing.xs,
  },
  suggestionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    ...Shadows.lg,
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionIcon: {
    marginRight: Spacing.sm,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  suggestionScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  suggestionScoreBadge: {
    backgroundColor: '#1F2E39',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  suggestionScoreText: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  suggestionReviewCount: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  suggestionDistance: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginLeft: Spacing.sm,
  },
  filterScrollView: {
    maxHeight: 50,
    marginTop: Spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
    ...Shadows.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.black,
  },
  filterChipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalOverlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  dragHandle: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 10,
  },
  dragHandleLine: {
    width: 40,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
  },
});

