import { Bin } from '../astar/types';
import { getRouteWithDirections } from './osrm';
import { calculateDistance } from '../astar/distance';

export async function findOptimalRoute(
  start: [number, number],
  bins: Bin[]
): Promise<{
  route: [number, number][],
  steps: { instruction: string; distance: number }[]
}> {
  // Filter bins with fullness >= 75%
  const eligibleBins = bins.filter(bin => bin.fullness >= 75);
  if (eligibleBins.length === 0) {
    return { route: [], steps: [] };
  }

  // Sort bins by distance to create an initial path
  let currentPoint = start;
  const orderedWaypoints = [start];
  const remainingBins = [...eligibleBins];

  while (remainingBins.length > 0) {
    // Find nearest bin
    let nearestBin = remainingBins[0];
    let minDistance = calculateDistance(currentPoint, nearestBin.location.coordinates);

    for (const bin of remainingBins) {
      const distance = calculateDistance(currentPoint, bin.location.coordinates);
      if (distance < minDistance) {
        minDistance = distance;
        nearestBin = bin;
      }
    }

    // Add nearest bin to waypoints
    orderedWaypoints.push(nearestBin.location.coordinates);
    currentPoint = nearestBin.location.coordinates;
    
    // Remove bin from remaining bins
    const index = remainingBins.indexOf(nearestBin);
    remainingBins.splice(index, 1);
  }

  // Get actual road route through all waypoints
  try {
    const routeData = await getRouteWithDirections(orderedWaypoints);
    
    return {
      route: routeData.coordinates.map(coord => [coord[1], coord[0]]), // Convert back to lat,lng
      steps: routeData.steps.map(step => ({
        instruction: step.instruction,
        distance: step.distance
      }))
    };
  } catch (error) {
    console.error('Error getting route:', error);
    throw error;
  }
}