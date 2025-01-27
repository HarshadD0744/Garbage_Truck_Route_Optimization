// Haversine distance calculation
export function calculateDistance(point1: [number, number], point2: [number, number]): number {
    const R = 6371; // Earth's radius in kilometers
    const lat1 = toRad(point1[0]);
    const lat2 = toRad(point2[0]);
    const dLat = toRad(point2[0] - point1[0]);
    const dLon = toRad(point2[1] - point1[1]);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
  
  // Calculate bearing between two points
  export function calculateBearing(start: [number, number], end: [number, number]): string {
    const startLat = toRad(start[0]);
    const endLat = toRad(end[0]);
    const dLon = toRad(end[1] - start[1]);
  
    const y = Math.sin(dLon) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
             Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLon);
    const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
  
    // Convert bearing to cardinal direction
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  }
  
  function toDeg(rad: number): number {
    return rad * 180 / Math.PI;
  }