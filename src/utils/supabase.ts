/**
 * Supabase Client
 * 
 * Handles all database operations for restaurant amenity data
 * 
 * @module utils/supabase
 */

import { createClient } from '@supabase/supabase-js';
import type { RestaurantAmenities } from '../types';
import { calculateScore } from './scoreCalculator';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured!');
  console.warn('SUPABASE_URL:', supabaseUrl ? 'configured' : 'MISSING');
  console.warn('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'configured' : 'MISSING');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔧 Supabase client initialized:', {
  url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET',
  hasKey: !!supabaseAnonKey
});

/**
 * Database row structure matching your Supabase table
 */
interface RestaurantRow {
  key: string; // Google Places ID
  created_at?: string;
  bread: { yes: number; no: number; idk: number };
  refill: { yes: number; no: number; idk: number };
  attendant: { yes: number; no: number; idk: number };
  pay: { yes: number; no: number; idk: number };
  score: number;
}

/**
 * Fetch restaurant amenity data from Supabase
 */
export async function getRestaurantAmenities(placeId: string): Promise<RestaurantAmenities | null> {
  try {
    console.log('🔍 Fetching single restaurant:', placeId);
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('key', placeId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found - return null
        console.log('ℹ️ No data found for place:', placeId);
        return null;
      }
      console.error('❌ Error fetching single restaurant:', error);
      throw error;
    }

    if (!data) return null;

    const row = data as RestaurantRow;

    // Calculate if each amenity is yes/no based on majority
    const freeRefills = row.refill.yes > row.refill.no ? true : row.refill.no > row.refill.yes ? false : null;
    const breadBasket = row.bread.yes > row.bread.no ? true : row.bread.no > row.bread.yes ? false : null;
    const payAtTable = row.pay.yes > row.pay.no ? true : row.pay.no > row.pay.yes ? false : null;
    const attendant = row.attendant.yes > row.attendant.no ? true : row.attendant.no > row.attendant.yes ? false : null;

    return {
      freeRefills,
      breadBasket,
      payAtTable,
      attendant,
      verifiedAt: data.created_at,
      freeRefillsStats: {
        yes: row.refill.yes,
        no: row.refill.no,
        total: row.refill.yes + row.refill.no + row.refill.idk,
      },
      breadBasketStats: {
        yes: row.bread.yes,
        no: row.bread.no,
        total: row.bread.yes + row.bread.no + row.bread.idk,
      },
      payAtTableStats: {
        yes: row.pay.yes,
        no: row.pay.no,
        total: row.pay.yes + row.pay.no + row.pay.idk,
      },
      attendantStats: {
        yes: row.attendant.yes,
        no: row.attendant.no,
        total: row.attendant.yes + row.attendant.no + row.attendant.idk,
      },
    };
  } catch (error) {
    console.error('Error fetching restaurant amenities:', error);
    return null;
  }
}

/**
 * Submit or update restaurant amenity report
 */
export async function submitRestaurantReport(
  placeId: string,
  amenities: RestaurantAmenities
): Promise<boolean> {
  try {
    // First, check if restaurant exists
    const { data: existing, error: fetchError } = await supabase
      .from('places')
      .select('*')
      .eq('key', placeId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      // Restaurant exists - increment the counts
      const row = existing as RestaurantRow;
      
      // Calculate old report count BEFORE adding new report
      const oldReportCount = row.refill.yes + row.refill.no + row.refill.idk;
      const oldScore = row.score || 0;
      
      const updatedRow: Partial<RestaurantRow> = {
        bread: {
          yes: row.bread.yes + (amenities.breadBasket === true ? 1 : 0),
          no: row.bread.no + (amenities.breadBasket === false ? 1 : 0),
          idk: row.bread.idk + (amenities.breadBasket === null ? 1 : 0),
        },
        refill: {
          yes: row.refill.yes + (amenities.freeRefills === true ? 1 : 0),
          no: row.refill.no + (amenities.freeRefills === false ? 1 : 0),
          idk: row.refill.idk + (amenities.freeRefills === null ? 1 : 0),
        },
        attendant: {
          yes: row.attendant.yes + (amenities.attendant === true ? 1 : 0),
          no: row.attendant.no + (amenities.attendant === false ? 1 : 0),
          idk: row.attendant.idk + (amenities.attendant === null ? 1 : 0),
        },
        pay: {
          yes: row.pay.yes + (amenities.payAtTable === true ? 1 : 0),
          no: row.pay.no + (amenities.payAtTable === false ? 1 : 0),
          idk: row.pay.idk + (amenities.payAtTable === null ? 1 : 0),
        },
      };

      // Calculate this user's score (already capped at 10 in calculateScore)
      const userScore = calculateScore(amenities);
      
      // Calculate weighted average: (old_score * old_count + new_score) / (old_count + 1)
      // Cap at 10 to ensure it never exceeds maximum
      const weightedAverage = oldReportCount > 0
        ? (oldScore * oldReportCount + userScore) / (oldReportCount + 1)
        : userScore;
      
      updatedRow.score = Math.min(10, weightedAverage);

      const { error: updateError } = await supabase
        .from('places')
        .update(updatedRow)
        .eq('key', placeId);

      if (updateError) throw updateError;
    } else {
      // New restaurant - create initial row
      const newRow: Omit<RestaurantRow, 'created_at'> = {
        key: placeId,
        bread: {
          yes: amenities.breadBasket === true ? 1 : 0,
          no: amenities.breadBasket === false ? 1 : 0,
          idk: amenities.breadBasket === null ? 1 : 0,
        },
        refill: {
          yes: amenities.freeRefills === true ? 1 : 0,
          no: amenities.freeRefills === false ? 1 : 0,
          idk: amenities.freeRefills === null ? 1 : 0,
        },
        attendant: {
          yes: amenities.attendant === true ? 1 : 0,
          no: amenities.attendant === false ? 1 : 0,
          idk: amenities.attendant === null ? 1 : 0,
        },
        pay: {
          yes: amenities.payAtTable === true ? 1 : 0,
          no: amenities.payAtTable === false ? 1 : 0,
          idk: amenities.payAtTable === null ? 1 : 0,
        },
        score: 0,
      };

      // Calculate initial score using the new scoring system (capped at 10)
      newRow.score = Math.min(10, calculateScore(amenities));

      const { error: insertError } = await supabase
        .from('places')
        .insert(newRow);

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error('Error submitting report:', error);
    return false;
  }
}

/**
 * Restaurant data including score
 */
export interface RestaurantData {
  amenities: RestaurantAmenities;
  score: number;
}

/**
 * Fetch multiple restaurants' amenity data
 */
export async function getMultipleRestaurantAmenities(
  placeIds: string[]
): Promise<Map<string, RestaurantData>> {
  try {
    console.log('🔍 Querying Supabase for place IDs:', placeIds.length, 'places');
    console.log('First 3 place IDs:', placeIds.slice(0, 3));
    
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .in('key', placeIds);

    if (error) {
      console.error('❌ Supabase query error:', error);
      throw error;
    }

    console.log('✅ Supabase returned:', data?.length || 0, 'results');
    if (data && data.length > 0) {
      console.log('Sample data keys:', data.slice(0, 3).map((d: any) => d.key));
    }

    const dataMap = new Map<string, RestaurantData>();

    if (!data) return dataMap;

    data.forEach((row: any) => {
      const r = row as RestaurantRow;
      
      const freeRefills = r.refill.yes > r.refill.no ? true : r.refill.no > r.refill.yes ? false : null;
      const breadBasket = r.bread.yes > r.bread.no ? true : r.bread.no > r.bread.yes ? false : null;
      const payAtTable = r.pay.yes > r.pay.no ? true : r.pay.no > r.pay.yes ? false : null;
      const attendant = r.attendant.yes > r.attendant.no ? true : r.attendant.no > r.attendant.yes ? false : null;

      dataMap.set(r.key, {
        score: r.score || 0,
        amenities: {
          freeRefills,
          breadBasket,
          payAtTable,
          attendant,
          verifiedAt: row.created_at,
          freeRefillsStats: {
            yes: r.refill.yes,
            no: r.refill.no,
            total: r.refill.yes + r.refill.no + r.refill.idk,
          },
          breadBasketStats: {
            yes: r.bread.yes,
            no: r.bread.no,
            total: r.bread.yes + r.bread.no + r.bread.idk,
          },
          payAtTableStats: {
            yes: r.pay.yes,
            no: r.pay.no,
            total: r.pay.yes + r.pay.no + r.pay.idk,
          },
          attendantStats: {
            yes: r.attendant.yes,
            no: r.attendant.no,
            total: r.attendant.yes + r.attendant.no + r.attendant.idk,
          },
        },
      });
    });

    return dataMap;
  } catch (error) {
    console.error('Error fetching multiple restaurant amenities:', error);
    return new Map();
  }
}

