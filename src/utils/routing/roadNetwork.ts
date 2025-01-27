import { RouteResult, LatLngTuple, RouteSegment } from './types';
import { DEFAULT_RANGE } from './constants';
import { filterEligibleBins } from './binFilters';
import { getRouteData } from './osrm';

export async function calculateRoadNetworkRoute(
  start: LatLngTuple,
  bins: any[],
  range: number = DEFAULT_RANGE
): Promise<RouteResult> {
  try {
    const eligibleBins = filterEligibleBins(bins, start, range);
    
    if (eligibleBins.length === 0) {
      return { 
        route: [start], 
        segments: [],
        totalDistance: 0,
        estimatedDuration: 0 
      };
    }

    // Initialize variables for tracking the best route
    let bestRoute: LatLngTuple[] = [start];
    let bestSegments: { start: LatLngTuple; end: LatLngTuple }[] = [];
    let bestTotalDistance = Infinity;
    let bestDuration = Infinity;

    // Create distance matrix
    const distanceMatrix = await createDistanceMatrix([start, ...eligibleBins.map(b => b.location.coordinates)]);

    // Find the best route using nearest neighbor with look-ahead
    const result = await findBestRoute(
      start,
      eligibleBins,
      distanceMatrix
    );

    if (result) {
      bestRoute = result.route;
      bestSegments = result.segments;
      bestTotalDistance = result.totalDistance;
      bestDuration = result.duration;
    }

    return {
      route: bestRoute,
      segments: bestSegments,
      totalDistance: bestTotalDistance,
      estimatedDuration: bestDuration
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    return {
      route: [start],
      segments: [],
      totalDistance: 0,
      estimatedDuration: 0
    };
  }
}

async function createDistanceMatrix(points: LatLngTuple[]): Promise<Map<string, Map<string, RouteSegment>>> {
  const matrix = new Map<string, Map<string, RouteSegment>>();

  for (let i = 0; i < points.length; i++) {
    const from = points[i];
    matrix.set(pointToKey(from), new Map());

    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        const to = points[j];
        const route = await getRouteData(from, to);
        matrix.get(pointToKey(from))!.set(pointToKey(to), route);
      }
    }
  }

  return matrix;
}

async function findBestRoute(
  start: LatLngTuple,
  bins: any[],
  distanceMatrix: Map<string, Map<string, RouteSegment>>
): Promise<{
  route: LatLngTuple[];
  segments: { start: LatLngTuple; end: LatLngTuple }[];
  totalDistance: number;
  duration: number;
} | null> {
  const route: LatLngTuple[] = [start];
  const segments: { start: LatLngTuple; end: LatLngTuple }[] = [];
  let totalDistance = 0;
  let duration = 0;
  let currentPoint = start;
  const visited = new Set<string>([pointToKey(start)]);

  while (visited.size < bins.length + 1) {
    let bestNextPoint: LatLngTuple | null = null;
    let bestDistance = Infinity;
    let bestSegment: RouteSegment | null = null;

    // Look at all unvisited points
    for (const bin of bins) {
      const binPoint = bin.location.coordinates;
      const binKey = pointToKey(binPoint);
      
      if (!visited.has(binKey)) {
        const currentToNext = distanceMatrix.get(pointToKey(currentPoint))!.get(binKey)!;
        
        // Calculate the cost including a look-ahead to the next possible point
        let lookAheadCost = currentToNext.distance;
        
        if (visited.size < bins.length) {
          let minNextCost = Infinity;
          for (const futureBin of bins) {
            const futurePoint = futureBin.location.coordinates;
            const futureKey = pointToKey(futurePoint);
            
            if (!visited.has(futureKey) && futureKey !== binKey) {
              const nextToFuture = distanceMatrix.get(binKey)!.get(futureKey)!;
              minNextCost = Math.min(minNextCost, nextToFuture.distance);
            }
          }
          lookAheadCost += minNextCost * 0.5; // Weight the look-ahead cost
        }

        if (lookAheadCost < bestDistance) {
          bestDistance = lookAheadCost;
          bestNextPoint = binPoint;
          bestSegment = currentToNext;
        }
      }
    }

    if (!bestNextPoint || !bestSegment) break;

    route.push(...bestSegment.coordinates);
    segments.push({
      start: currentPoint,
      end: bestNextPoint
    });

    totalDistance += bestSegment.distance / 1000; // Convert to km
    duration += bestSegment.duration;
    currentPoint = bestNextPoint;
    visited.add(pointToKey(bestNextPoint));
  }

  return {
    route,
    segments,
    totalDistance,
    duration
  };
}

function pointToKey(point: LatLngTuple): string {
  return `${point[0]},${point[1]}`;
}