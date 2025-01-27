import React from 'react';
import { Trash2 } from 'lucide-react';

interface BinDetailsProps {
  bin: any;
}

const BinDetails: React.FC<BinDetailsProps> = ({ bin }) => {
  return (
    <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Trash2 className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold">Bin Details</h3>
      </div>
      
      <div className="space-y-2">
        <p>
          <span className="font-medium">ID:</span> {bin.binId}
        </p>
        <p>
          <span className="font-medium">Capacity:</span> {bin.capacity}L
        </p>
        <p>
          <span className="font-medium">Current Fullness:</span> {bin.fullness}%
        </p>
        <p>
          <span className="font-medium">Location:</span>
          <br />
          Lat: {bin.location.coordinates[0]}
          <br />
          Lng: {bin.location.coordinates[1]}
        </p>
      </div>
    </div>
  );
};

export default BinDetails;