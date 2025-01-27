import { LatLngTuple, RouteSegment } from './types';
import { OSRM_API } from './constants';
import { calculateDirectDistance, calculateEstimatedDuration } from './distance';

export async function getRouteData(
  start: LatLngTuple, 
  end: LatLngTuple
): Promise<RouteSegment> {
  try {
    const coordinates = `${start[1]},${start[0]};${end[1]},${end[0]}`;
    const url = `${OSRM_API}/driving/${coordinates}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.routes?.[0]) {
      throw new Error('Failed to get route');
    }

    const route = data.routes[0];
    return {
      distance: route.distance,
      duration: route.duration,
      coordinates: route.geometry.coordinates.map((coord: [number, number]) => 
        [coord[1], coord[0]] as LatLngTuple
      )
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    // Fallback to direct line if routing fails
    return {
      distance: calculateDirectDistance(start, end),
      duration: calculateEstimatedDuration(start, end),
      coordinates: [start, end]
    };
  }
}