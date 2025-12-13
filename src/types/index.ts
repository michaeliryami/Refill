/**
 * Common Type Definitions
 * 
 * Centralized type definitions for the Refill application.
 * Ensures type safety and consistency across the codebase.
 * 
 * @module types
 */

/**
 * User Entity
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication State
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Restaurant Amenities
 */
export interface RestaurantAmenities {
  freeRefills: boolean | null;
  breadBasket: boolean | null;
  payAtTable: boolean | null;
  attendant: boolean | null;
  baseScore?: number; // User's baseline experience score (0-10)
  verifiedAt?: string;
  reportedBy?: string;
  // Report statistics
  freeRefillsStats?: { yes: number; no: number; total: number };
  breadBasketStats?: { yes: number; no: number; total: number };
  payAtTableStats?: { yes: number; no: number; total: number };
  attendantStats?: { yes: number; no: number; total: number };
}

/**
 * Restaurant Location
 */
export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Restaurant Entity
 */
export interface Restaurant {
  id: string;
  placeId: string;
  name: string;
  address: string;
  location: Location;
  distance?: number;
  rating?: number;
  priceLevel?: number;
  cuisine?: string;
  isOpen?: boolean;
  closingTime?: string;
  amenities: RestaurantAmenities;
  photoUrl?: string;
  score?: number; // Calculated score (0-10)
}

/**
 * Google Places Result
 */
export interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
  }>;
  types: string[];
}

/**
 * API Response Types
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ErrorResponse {
  message: string;
  code: string;
  details?: Record<string, any>;
}

/**
 * Form Validation Types
 */
export type ValidationRule<T = any> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

/**
 * Navigation Types
 * 
 * Define your navigation stack types here for type-safe navigation
 */
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

/**
 * Environment Variables Type
 */
export interface EnvConfig {
  API_URL: string;
  ENV: 'development' | 'staging' | 'production';
  ENABLE_ANALYTICS: boolean;
}

/**
 * Async State for Data Fetching
 */
export type AsyncState<T, E = Error> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: E };

/**
 * Map Region
 */
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

