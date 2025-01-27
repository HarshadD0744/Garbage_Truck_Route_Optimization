import React, { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';

interface AssignTruckFormProps {
  truckId: string;
  onAssign: () => void;
}

const AssignTruckForm: React.FC<AssignTruckFormProps> = ({ truckId, onAssign }) => {
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState('');

  useEffect(() => {
    fetchCollectors();
  }, []);

  const fetchCollectors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/collectors');
      const data = await response.json();
      console.log("rr",data)
      setCollectors(data);
    } catch (error) {
      console.error('Error fetching collectors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/trucks/${truckId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectorId: selectedCollector }),
      });

      if (response.ok) {
        onAssign();
        setSelectedCollector('');
      }
    } catch (error) {
      console.error('Error assigning truck:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Assign Collector</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Collector
          </label>
          <select
            className="w-full p-2 border rounded"
            value={selectedCollector}
            onChange={(e) => setSelectedCollector(e.target.value)}
            required
          >
            <option value="">Choose a collector</option>
            {collectors.map((collector: any) => (
              <option key={collector._id} value={collector._id}>
                {collector.username}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Assign Truck
        </button>
      </form>
    </div>
  );
};

export default AssignTruckForm;