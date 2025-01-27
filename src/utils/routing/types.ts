export interface RouteResult {
  route: [number, number][];
  totalDistance: number;
  estimatedDuration: number;
}

export interface RouteSegment {
  distance: number;
  duration: number;
  coordinates: [number, number][];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type LatLngTuple = [number, number];