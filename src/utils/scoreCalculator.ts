/**
 * Score Calculator
 * 
 * Calculates restaurant scores based on user experience and amenities
 * 
 * @module utils/scoreCalculator
 */

import type { RestaurantAmenities } from '../types';

/**
 * Calculate the final restaurant score based on baseline and amenities
 * 
 * Scoring system:
 * - Base score: User's experience rating (0-10)
 * - Refills YES: +2.2, NO: -2.2
 * - Bread YES: +1, NO: -3
 * - Pay at table YES: +1.5, NO: -0.5
 * - Attendant YES: -3, NO: +0 (we don't like attendants)
 * - Max score: 10
 */
export function calculateScore(amenities: RestaurantAmenities): number {
  let score = amenities.baseScore || 5; // Default to 5 if not provided

  // Refills adjustment
  if (amenities.freeRefills === true) {
    score += 2.2;
  } else if (amenities.freeRefills === false) {
    score -= 2.2;
  }

  // Bread adjustment
  if (amenities.breadBasket === true) {
    score += 1;
  } else if (amenities.breadBasket === false) {
    score -= 3;
  }

  // Pay at table adjustment
  if (amenities.payAtTable === true) {
    score += 1.5;
  } else if (amenities.payAtTable === false) {
    score -= 0.5;
  }

  // Attendant adjustment (negative if present)
  if (amenities.attendant === true) {
    score -= 3;
  }

  // Cap at 10, floor at 0
  return Math.max(0, Math.min(10, score));
}

/**
 * Calculate average score from multiple reports
 */
export function calculateAverageScore(
  scores: number[],
  weights?: number[]
): number {
  if (scores.length === 0) return 0;
  
  if (weights && weights.length === scores.length) {
    const weightedSum = scores.reduce((sum, score, i) => sum + score * weights[i], 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    return weightedSum / totalWeight;
  }
  
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
}

/**
 * Get color for score display
 */
export function getScoreColor(score: number): string {
  if (score >= 8) return '#10B981'; // Green - Excellent
  if (score >= 6) return '#F59E0B'; // Amber - Good
  if (score >= 4) return '#F97316'; // Orange - Average
  return '#EF4444'; // Red - Poor
}

/**
 * Get score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Very Good';
  if (score >= 5) return 'Good';
  if (score >= 3) return 'Fair';
  return 'Poor';
}





