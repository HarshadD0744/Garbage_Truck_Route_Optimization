import React, { useState } from 'react';
import { Truck } from 'lucide-react';

interface AddTruckFormProps {
  onAdd: () => void;
}

const AddTruckForm: React.FC<AddTruckFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    truckId: '',
    capacity: '',
    location: {
      type: 'Point',
      coordinates: ['', ''] as [string, string],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/trucks', {
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
        setFormData({
          truckId: '',
          capacity: '',
          location: { type: 'Point', coordinates: ['', ''] },
        });
      }
    } catch (error) {
      console.error('Error adding truck:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold">Add New Truck</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Truck ID
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.truckId}
            onChange={(e) =>
              setFormData({ ...formData, truckId: e.target.value })
            }
            required
          />
        </div>

        <div>
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

        <div>
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
          Add Truck
        </button>
      </form>
    </div>
  );
};

export default AddTruckForm;