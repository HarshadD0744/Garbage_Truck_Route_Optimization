import React from 'react';
import { Trash2, X } from 'lucide-react';

interface BinListProps {
  bins: any[];
  onBinSelect: (bin: any) => void;
  selectedBin?: any;
  onDelete?: (binId: string) => void;
  showDelete?: boolean;
}

const BinList: React.FC<BinListProps> = ({ 
  bins, 
  onBinSelect, 
  selectedBin,
  onDelete,
  showDelete = false 
}) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4">Bins</h2>
      {bins.map((bin) => (
        <div
          key={bin._id}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedBin?._id === bin._id
              ? 'bg-red-100 border-red-500'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 flex-1"
              onClick={() => onBinSelect(bin)}
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-medium">Bin {bin.binId}</h3>
                <p className="text-sm text-gray-500">
                  Fullness: {bin.fullness}%
                </p>
              </div>
            </div>
            {showDelete && onDelete && (
              <button
                onClick={() => onDelete(bin._id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove bin"
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

export default BinList;