/**
 * Google Places Service
 * 
 * Service for interacting with Google Places API to search for restaurants
 * and retrieve place details.
 * 
 * @module utils/googlePlaces
 */

import type { GooglePlaceResult, Restaurant, Location } from '@types';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || 'AIzaSyDQIbT3FENMDxFzOMNDf-aFq56TmTmSFuU';
const PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Search for nearby restaurants
 */
export async function searchNearbyRestaurants(
  location: Location,
  radius: number = 5000,
  keyword?: string
): Promise<Restaurant[]> {
  try {
    const url = `${PLACES_API_BASE_URL}/nearbysearch/json?` +
      `location=${location.latitude},${location.longitude}` +
      `&radius=${radius}` +
      `&type=restaurant` +
      `${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}` +
      `&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API error: ${data.status}`);
    }

    return (data.results || []).map((place: GooglePlaceResult) => 
      mapGooglePlaceToRestaurant(place, location)
    );
  } catch (error) {
    console.error('Error searching restaurants:', error);
    return [];
  }
}

/**
 * Search restaurants by text query
 */
export async function searchRestaurantsByText(
  query: string,
  location?: Location
): Promise<Restaurant[]> {
  try {
    // Build query - if location provided, use it; otherwise search globally
    let url = `${PLACES_API_BASE_URL}/textsearch/json?` +
      `query=${encodeURIComponent(query)}` +
      `&type=restaurant` +
      `&key=${GOOGLE_PLACES_API_KEY}`;

    // Add location bias if available, but don't restrict to radius
    if (location) {
      url += `&location=${location.latitude},${location.longitude}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API error: ${data.status}`);
    }

    // Use provided location for distance calculation, or use first result's location
    const referenceLocation = location || 
      (data.results?.[0] ? {
        latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng,
      } : { latitude: 0, longitude: 0 });

    return (data.results || []).map((place: GooglePlaceResult) => 
      mapGooglePlaceToRestaurant(place, referenceLocation)
    );
  } catch (error) {
    console.error('Error searching restaurants:', error);
    return [];
  }
}

/**
 * Get place details
 */
export async function getPlaceDetails(placeId: string): Promise<any> {
  try {
    const url = `${PLACES_API_BASE_URL}/details/json?` +
      `place_id=${placeId}` +
      `&fields=name,formatted_address,geometry,rating,opening_hours,price_level,photos,types` +
      `&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Places API error: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
}

/**
 * Get photo URL from photo reference
 */
export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  return `${PLACES_API_BASE_URL}/photo?` +
    `maxwidth=${maxWidth}` +
    `&photo_reference=${photoReference}` +
    `&key=${GOOGLE_PLACES_API_KEY}`;
}

/**
 * Calculate distance between two coordinates (in miles)
 */
function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Map Google Place to Restaurant type
 */
function mapGooglePlaceToRestaurant(
  place: GooglePlaceResult,
  userLocation: Location
): Restaurant {
  const restaurantLocation: Location = {
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
  };

  const distance = calculateDistance(userLocation, restaurantLocation);

  // Extract cuisine from types
  const cuisineTypes = place.types.filter(type => 
    !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(type)
  );
  const cuisine = cuisineTypes.length > 0 
    ? cuisineTypes[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Restaurant';

  return {
    id: place.place_id,
    placeId: place.place_id,
    name: place.name,
    address: place.vicinity,
    location: restaurantLocation,
    distance: Math.round(distance * 10) / 10,
    rating: place.rating,
    priceLevel: place.price_level,
    cuisine,
    isOpen: place.opening_hours?.open_now,
    photoUrl: place.photos?.[0] 
      ? getPhotoUrl(place.photos[0].photo_reference)
      : undefined,
    amenities: {
      freeRefills: null,
      breadBasket: null,
      payAtTable: null,
      attendant: null,
    },
  };
}

/**
 * Mock data for development (when API key is not set)
 */
export function getMockRestaurants(userLocation: Location): Restaurant[] {
  return [
    {
      id: 'mock-1',
      placeId: 'mock-place-1',
      name: 'Olive Garden',
      address: '123 Pasta Lane',
      location: {
        latitude: userLocation.latitude + 0.01,
        longitude: userLocation.longitude + 0.01,
      },
      distance: 0.4,
      rating: 4.5,
      priceLevel: 2,
      cuisine: 'Italian',
      isOpen: true,
      closingTime: '10 PM',
      amenities: {
        freeRefills: true,
        breadBasket: true,
        payAtTable: true,
        attendant: false,
        freeRefillsStats: { yes: 45, no: 3, total: 48 },
        breadBasketStats: { yes: 50, no: 0, total: 50 },
        payAtTableStats: { yes: 32, no: 8, total: 40 },
        attendantStats: { yes: 5, no: 35, total: 40 },
      },
    },
    {
      id: 'mock-2',
      placeId: 'mock-place-2',
      name: 'Red Lobster',
      address: '456 Seafood Ave',
      location: {
        latitude: userLocation.latitude + 0.02,
        longitude: userLocation.longitude - 0.01,
      },
      distance: 0.8,
      rating: 4.2,
      priceLevel: 3,
      cuisine: 'Seafood',
      isOpen: true,
      closingTime: '11 PM',
      amenities: {
        freeRefills: true,
        breadBasket: false,
        payAtTable: false,
        attendant: true,
        freeRefillsStats: { yes: 28, no: 5, total: 33 },
        breadBasketStats: { yes: 8, no: 25, total: 33 },
        payAtTableStats: { yes: 10, no: 20, total: 30 },
        attendantStats: { yes: 22, no: 8, total: 30 },
      },
    },
    {
      id: 'mock-3',
      placeId: 'mock-place-3',
      name: 'Chipotle',
      address: '789 Burrito Blvd',
      location: {
        latitude: userLocation.latitude - 0.015,
        longitude: userLocation.longitude + 0.02,
      },
      distance: 1.2,
      rating: 4.0,
      priceLevel: 1,
      cuisine: 'Mexican',
      isOpen: false,
      closingTime: '10 PM',
      amenities: {
        freeRefills: true,
        breadBasket: false,
        payAtTable: false,
        attendant: false,
        freeRefillsStats: { yes: 60, no: 2, total: 62 },
        breadBasketStats: { yes: 1, no: 58, total: 59 },
        payAtTableStats: { yes: 3, no: 55, total: 58 },
        attendantStats: { yes: 2, no: 56, total: 58 },
      },
    },
  ];
}

