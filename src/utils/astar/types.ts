export interface Point {
    lat: number;
    lng: number;
  }
  
  export interface Node {
    coordinates: [number, number];
    g: number;  // Cost from start to current node
    h: number;  // Estimated cost from current node to goal
    f: number;  // Total cost (g + h)
    parent: Node | null;
  }
  
  export interface Bin {
    location: {
      coordinates: [number, number];
    };
    fullness: number;
    capacity: number;
  }