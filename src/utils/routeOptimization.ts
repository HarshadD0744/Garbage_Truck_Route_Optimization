interface Point {
  lat: number;
  lng: number;
}

interface Bin {
  location: {
    coordinates: [number, number];
  };
  fullness: number;
  capacity: number;
}

export async function findOptimalRoute(
  start: [number, number],
  bins: Bin[],
  availableCapacity: number
): Promise<[number, number][]> {
  const eligibleBins = bins.filter(
    (bin) => bin.fullness >= 75 && bin.capacity <= availableCapacity
  );

  if (eligibleBins.length === 0) {
    return [start];
  }

  // Calculate distances between all points
  const distances = new Map<string, Map<string, number>>();
  const points = [start, ...eligibleBins.map((bin) => bin.location.coordinates)];

  for (let i = 0; i < points.length; i++) {
    distances.set(points[i].toString(), new Map());
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        const distance = calculateDistance(points[i], points[j]);
        distances.get(points[i].toString())!.set(points[j].toString(), distance);
      }
    }
  }

  // Nearest neighbor algorithm with capacity constraints
  const route: [number, number][] = [start];
  let currentPoint = start;
  let remainingCapacity = availableCapacity;
  const visited = new Set<string>([start.toString()]);

  while (visited.size < points.length) {
    let nearest: [number, number] | null = null;
    let minDistance = Infinity;

    for (const point of points) {
      const pointStr = point.toString();
      if (!visited.has(pointStr)) {
        const bin = eligibleBins.find(
          (b) =>
            b.location.coordinates[0] === point[0] &&
            b.location.coordinates[1] === point[1]
        );

        if (bin && bin.capacity <= remainingCapacity) {
          const distance = distances.get(currentPoint.toString())!.get(pointStr)!;
          if (distance < minDistance) {
            minDistance = distance;
            nearest = point;
          }
        }
      }
    }

    if (!nearest) break;

    route.push(nearest);
    visited.add(nearest.toString());
    currentPoint = nearest;
    const bin = eligibleBins.find(
      (b) =>
        b.location.coordinates[0] === nearest![0] &&
        b.location.coordinates[1] === nearest![1]
    );
    remainingCapacity -= bin!.capacity;
  }

  // Add return to start point
  route.push(start);

  return route;
}

function calculateDistance(point1: [number, number], point2: [number, number]): number {
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