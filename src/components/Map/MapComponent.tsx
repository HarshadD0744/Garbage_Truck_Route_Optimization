import React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Trash2, Truck } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  trucks: any[];
  bins: any[];
  selectedTruck?: any;
  route?: [number, number][];
  onTruckClick?: (truck: any) => void;
  onBinClick?: (bin: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  trucks = [],
  bins = [],
  selectedTruck,
  route,
  onTruckClick,
  onBinClick,
}) => {
  const truckIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const getBinIcon = (fullness: number) => new Icon({
    iconUrl: fullness >= 75
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const isInRange = (bin: any) => {
    if (!selectedTruck?.location?.coordinates) return false;
    const R = 6371; // Earth's radius in km
    const lat1 = selectedTruck.location.coordinates[0] * Math.PI / 180;
    const lat2 = bin.location.coordinates[0] * Math.PI / 180;
    const dLat = (bin.location.coordinates[0] - selectedTruck.location.coordinates[0]) * Math.PI / 180;
    const dLon = (bin.location.coordinates[1] - selectedTruck.location.coordinates[1]) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance <= 4; // 4km radius
  };

  return (
    <MapContainer
      center={[11.022045652261154, 76.95761757897061]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {trucks.map((truck) => truck?.location?.coordinates && (
        <React.Fragment key={truck._id}>
          <Marker
            position={truck.location.coordinates}
            icon={truckIcon}
            eventHandlers={{
              click: () => onTruckClick?.(truck),
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">Truck {truck.truckId}</h3>
                <p>Capacity: {truck.currentLoad}/{truck.capacity}</p>
                {truck.collector && <p>Assigned to: {truck.collector.username}</p>}
              </div>
            </Popup>
          </Marker>

          {selectedTruck?._id === truck._id && (
            <Circle
              center={truck.location.coordinates}
              radius={4000}
              pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
            />
          )}
        </React.Fragment>
      ))}

      {bins.map((bin) => bin?.location?.coordinates && (
        <Marker
          key={bin._id}
          position={bin.location.coordinates}
          icon={getBinIcon(bin.fullness)}
          eventHandlers={{
            click: () => onBinClick?.(bin),
          }}
        >
          <Popup>
            <div>
              <h3 className="font-bold">Bin {bin.binId}</h3>
              <p>Fullness: {bin.fullness}%</p>
              <p>Capacity: {bin.capacity}L</p>
              {isInRange(bin) && <p className="text-green-600">In truck range</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {route && route.length > 0 && (
        <Polyline
          positions={route}
          pathOptions={{ color: 'blue', weight: 3 }}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;