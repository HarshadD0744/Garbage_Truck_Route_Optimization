import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddBinModalProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddBinModal: React.FC<AddBinModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    binId: '',
    capacity: '',
    location: {
      type: 'Point',
      coordinates: ['', ''] as [string, string],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/bins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          capacity: Number(formData.capacity),
          location: {
            type: 'Point',
            coordinates: [
              Number(formData.location.coordinates[0]),
              Number(formData.location.coordinates[1]),
            ],
          },
        }),
      });

      if (response.ok) {
        onAdd();
        onClose();
      }
    } catch (error) {
      console.error('Error adding bin:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Bin</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bin ID
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.binId}
              onChange={(e) =>
                setFormData({ ...formData, binId: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (L)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Latitude"
                className="p-2 border rounded"
                value={formData.location.coordinates[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      coordinates: [e.target.value, formData.location.coordinates[1]],
                    },
                  })
                }
                required
                step="any"
              />
              <input
                type="number"
                placeholder="Longitude"
                className="p-2 border rounded"
                value={formData.location.coordinates[1]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      coordinates: [formData.location.coordinates[0], e.target.value],
                    },
                  })
                }
                required
                step="any"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Add Bin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBinModal;