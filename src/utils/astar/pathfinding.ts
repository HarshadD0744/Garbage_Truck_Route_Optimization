import { Node, Bin } from './types';
import { calculateDistance, calculateBearing } from './distance';

export interface PathSegment {
  coordinates: [number, number];
  direction: string;
  distance: number;
}

export function findPathWithDirections(
  start: [number, number],
  bins: Bin[]
): PathSegment[] {
  // Filter bins with fullness >= 75%
  const eligibleBins = bins.filter(bin => bin.fullness >= 75);
  if (eligibleBins.length === 0) return [];

  // Find the farthest bin to use as goal
  const farthestBin = findFarthestBin(start, eligibleBins);
  
  // Sort remaining bins by distance from start
  const sortedBins = sortBinsByDistance(start, eligibleBins);

  // Create path through nearest neighbors
  const path: PathSegment[] = [];
  let currentPoint = start;

  for (const bin of sortedBins) {
    const binCoords = bin.location.coordinates;
    const distance = calculateDistance(currentPoint, binCoords);
    const direction = calculateBearing(currentPoint, binCoords);

    path.push({
      coordinates: binCoords,
      direction,
      distance
    });

    currentPoint = binCoords;
  }

  return path;
}

function findFarthestBin(start: [number, number], bins: Bin[]): Bin {
  let maxDistance = 0;
  let farthestBin = bins[0];

  for (const bin of bins) {
    const distance = calculateDistance(start, bin.location.coordinates);
    if (distance > maxDistance) {
      maxDistance = distance;
      farthestBin = bin;
    }
  }

  return farthestBin;
}

function sortBinsByDistance(start: [number, number], bins: Bin[]): Bin[] {
  return [...bins].sort((a, b) => {
    const distA = calculateDistance(start, a.location.coordinates);
    const distB = calculateDistance(start, b.location.coordinates);
    return distA - distB;
  });
}