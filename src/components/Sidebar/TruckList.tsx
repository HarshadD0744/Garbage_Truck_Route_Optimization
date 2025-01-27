import React from 'react';
import { Truck, X } from 'lucide-react';

interface TruckListProps {
  trucks: any[];
  onTruckSelect: (truck: any) => void;
  selectedTruck?: any;
  onDelete?: (truckId: string) => void;
  showDelete?: boolean;
}

const TruckList: React.FC<TruckListProps> = ({ 
  trucks, 
  onTruckSelect, 
  selectedTruck,
  onDelete,
  showDelete = false
}) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4">Trucks</h2>
      {trucks.map((truck) => (
        <div
          key={truck._id}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedTruck?._id === truck._id
              ? 'bg-green-100 border-green-500'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 flex-1"
              onClick={() => onTruckSelect(truck)}
            >
              <Truck className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-medium">Truck {truck.truckId}</h3>
                <p className="text-sm text-gray-500">
                  Load: {truck.currentLoad}/{truck.capacity}
                </p>
              </div>
            </div>
            {showDelete && onDelete && (
              <button
                onClick={() => onDelete(truck._id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove truck"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TruckList;