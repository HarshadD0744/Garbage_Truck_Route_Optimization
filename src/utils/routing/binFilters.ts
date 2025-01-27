import { LatLngTuple } from './types';
import { DEFAULT_RANGE, MIN_BIN_FULLNESS } from './constants';
import { calculateDirectDistance } from './distance';

export function filterEligibleBins(
  bins: any[],
  truckLocation: LatLngTuple,
  range: number = DEFAULT_RANGE
): any[] {
  if (!bins || !truckLocation) return [];
  
  return bins.filter(bin => {
    if (!bin?.location?.coordinates) return false;
    
    // Check if bin coordinates are valid
    const coords = bin.location.coordinates;
    if (!Array.isArray(coords) || coords.length !== 2) return false;
    
    // Check if bin is in range
    const distance = calculateDirectDistance(truckLocation, coords) / 1000; // Convert to km
    const inRange = distance <= range;
    
    // Check fullness
    const isFullEnough = (bin.fullness || 0) >= MIN_BIN_FULLNESS;
    
    return inRange && isFullEnough;
  });
}