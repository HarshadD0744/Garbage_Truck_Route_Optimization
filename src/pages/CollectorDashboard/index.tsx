import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MapComponent from '../../components/Map/MapComponent';
import BinList from '../../components/Sidebar/BinList';
import BinDetails from '../../components/Sidebar/BinDetails';
import { LogOut, Navigation, Route } from 'lucide-react';
import { calculateRoadNetworkRoute } from '../../utils/routing/roadNetwork';

const CollectorDashboard = () => {
  const { user, logout } = useAuth();
  const [truck, setTruck] = useState(null);
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [routeStats, setRouteStats] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const fetchTruckAndBins = async () => {
    try {
      setError(null);
      
      // Fetch assigned truck
      const truckResponse = await fetch(
        `http://localhost:5000/api/trucks/collector/${user._id}`
      );
      if (!truckResponse.ok) throw new Error('Failed to fetch truck data');
      const truckData = await truckResponse.json();
      setTruck(truckData);

      // Fetch all bins
      const binsResponse = await fetch('http://localhost:5000/api/bins');
      if (!binsResponse.ok) throw new Error('Failed to fetch bins data');
      const binsData = await binsResponse.json();
      setBins(binsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchTruckAndBins();
      const interval = setInterval(fetchTruckAndBins, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const calculateRoute = async () => {
    if (!truck?.location?.coordinates) {
      setError('Truck location not available');
      return;
    }
    
    setIsCalculatingRoute(true);
    setError(null);
    
    try {
      const result = await calculateRoadNetworkRoute(
        truck.location.coordinates,
        bins,
        truck.range || 4
      );
      
      if (result.route.length <= 1) {
        setError('No eligible bins found within range');
        setRoute([]);
        setRouteStats(null);
      } else {
        setRoute(result.route);
        setRouteStats({
          distance: result.totalDistance,
          duration: result.estimatedDuration
        });
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      setError('Failed to calculate route');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="h-screen flex">
      <div className="w-96 bg-white border-r p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Collector Dashboard</h1>
          <button onClick={logout} className="p-2 text-gray-500 hover:text-gray-700">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {truck && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h2 className="font-semibold mb-2">Your Truck</h2>
            <p>ID: {truck.truckId}</p>
            <p>Capacity: {truck.currentLoad}/{truck.capacity}L</p>
            {routeStats && (
              <div className="mt-2 text-green-700">
                <p>Route Distance: {routeStats.distance.toFixed(2)} km</p>
                <p>Estimated Time: {Math.round(routeStats.duration / 60)} minutes</p>
              </div>
            )}
            <div className="mt-4 space-y-2">
              <button
                onClick={calculateRoute}
                disabled={isCalculatingRoute}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                         flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Route className="w-4 h-4" />
                {isCalculatingRoute ? 'Calculating...' : 'Calculate Route'}
              </button>
              <button
                onClick={fetchTruckAndBins}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                         flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Refresh Data
              </button>
            </div>
          </div>
        )}

        {selectedBin ? (
          <>
            <BinDetails bin={selectedBin} />
            <button
              onClick={() => setSelectedBin(null)}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 mb-6"
            >
              Back to List
            </button>
          </>
        ) : (
          <BinList
            bins={bins}
            onBinSelect={setSelectedBin}
            selectedBin={selectedBin}
          />
        )}
      </div>

      <div className="flex-1">
        <MapComponent
          trucks={truck ? [truck] : []}
          bins={bins}
          selectedTruck={truck}
          route={route}
          onBinClick={setSelectedBin}
        />
      </div>
    </div>
  );
};

export default CollectorDashboard;