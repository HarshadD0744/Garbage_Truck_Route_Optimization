// A* pathfinding algorithm implementation
export function findOptimalRoute(start, bins, truckCapacity) {
  const openSet = [start];
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  gScore.set(start.toString(), 0);
  fScore.set(start.toString(), heuristic(start, bins[0]));

  while (openSet.length > 0) {
    const current = getLowestFScore(openSet, fScore);
    if (isGoal(current, bins)) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);
    const neighbors = getNeighbors(current, bins, truckCapacity);

    for (const neighbor of neighbors) {
      const tentativeGScore = gScore.get(current.toString()) + distance(current, neighbor);

      if (!gScore.has(neighbor.toString()) || tentativeGScore < gScore.get(neighbor.toString())) {
        cameFrom.set(neighbor.toString(), current);
        gScore.set(neighbor.toString(), tentativeGScore);
        fScore.set(neighbor.toString(), tentativeGScore + heuristic(neighbor, bins[0]));

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return null;
}

function heuristic(a, b) {
  return distance(a, b);
}

function distance(a, b) {
  const R = 6371; // Earth's radius in km
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

function getLowestFScore(openSet, fScore) {
  return openSet.reduce((lowest, current) =>
    fScore.get(current.toString()) < fScore.get(lowest.toString()) ? current : lowest
  );
}

function isGoal(current, bins) {
  return bins.every(bin => bin.collected);
}

function getNeighbors(current, bins, truckCapacity) {
  return bins
    .filter(bin => !bin.collected && bin.fullness >= 75)
    .filter(bin => distance(current, bin.location) <= 4) // 4km range
    .slice(0, Math.floor((truckCapacity - current.load) / 100)); // Consider truck capacity
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(current.toString())) {
    current = cameFrom.get(current.toString());
    path.unshift(current);
  }
  return path;
}