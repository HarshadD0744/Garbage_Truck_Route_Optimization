import { LatLngTuple } from './types';
import { EARTH_RADIUS } from './constants';

export function calculateDirectDistance(point1: LatLngTuple, point2: LatLngTuple): number {
  const lat1 = toRad(point1[0]);
  const lat2 = toRad(point2[0]);
  const dLat = toRad(point2[0] - point1[0]);
  const dLon = toRad(point2[1] - point1[1]);

  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return EARTH_RADIUS * c; // Returns distance in meters
}

export function calculateEstimatedDuration(point1: LatLngTuple, point2: LatLngTuple): number {
  const distance = calculateDirectDistance(point1, point2);
  return (distance / 1000) / AVERAGE_SPEED * 3600; // Convert to seconds
}

export function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}