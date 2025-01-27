import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MapComponent from '../../components/Map/MapComponent';
import TruckList from '../../components/Sidebar/TruckList';
import BinList from '../../components/Sidebar/BinList';
import AddTruckForm from '../../components/Forms/AddTruckForm';
import AddBinForm from '../../components/Forms/AddBinForm';
import AssignTruckForm from '../../components/Forms/AssignTruckForm';
import { LogOut, Truck, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [trucks, setTrucks] = useState([]);
  const [bins, setBins] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const [activeTab, setActiveTab] = useState('trucks');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);

  useEffect(() => {
    fetchTrucks();
    fetchBins();
    const interval = setInterval(() => {
      fetchTrucks();
      fetchBins();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchTrucks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trucks');
      const data = await response.json();
      setTrucks(data);
    } catch (error) {
      console.error('Error fetching trucks:', error);
    }
  };

  const fetchBins = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bins');
      const data = await response.json();
      setBins(data);
    } catch (error) {
      console.error('Error fetching bins:', error);
    }
  };

  const handleTruckSelect = (truck: any) => {
    setSelectedTruck(truck);
    setShowAssignForm(true);
    setShowAddForm(false);
  };

  const handleDeleteTruck = async (truckId: string) => {
    if (!window.confirm('Are you sure you want to remove this truck?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/trucks/${truckId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTrucks();
        if (selectedTruck?._id === truckId) {
          setSelectedTruck(null);
          setShowAssignForm(false);
        }
      }
    } catch (error) {
      console.error('Error deleting truck:', error);
    }
  };

  const handleDeleteBin = async (binId: string) => {
    if (!window.confirm('Are you sure you want to remove this bin?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bins/${binId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBins();
        if (selectedBin?._id === binId) {
          setSelectedBin(null);
        }
      }
    } catch (error) {
      console.error('Error deleting bin:', error);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
              activeTab === 'trucks'
                ? 'bg-white shadow-sm text-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => {
              setActiveTab('trucks');
              setShowAddForm(false);
              setShowAssignForm(false);
            }}
          >
            <Truck className="w-4 h-4" />
            Trucks
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
              activeTab === 'bins'
                ? 'bg-white shadow-sm text-red-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => {
              setActiveTab('bins');
              setShowAddForm(false);
              setShowAssignForm(false);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Bins
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowAssignForm(false);
          }}
          className={`w-full mb-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
            activeTab === 'trucks'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {showAddForm ? 'View List' : `Add ${activeTab === 'trucks' ? 'Truck' : 'Bin'}`}
        </button>

        {/* Content */}
        {showAssignForm && selectedTruck ? (
          <AssignTruckForm
            truckId={selectedTruck._id}
            onAssign={() => {
              fetchTrucks();
              setShowAssignForm(false);
            }}
          />
        ) : showAddForm ? (
          activeTab === 'trucks' ? (
            <AddTruckForm onAdd={fetchTrucks} />
          ) : (
            <AddBinForm onAdd={fetchBins} />
          )
        ) : (
          activeTab === 'trucks' ? (
            <TruckList
              trucks={trucks}
              selectedTruck={selectedTruck}
              onTruckSelect={handleTruckSelect}
              onDelete={handleDeleteTruck}
              showDelete={true}
            />
          ) : (
            <BinList
              bins={bins}
              selectedBin={selectedBin}
              onBinSelect={setSelectedBin}
              onDelete={handleDeleteBin}
              showDelete={true}
            />
          )
        )}
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapComponent
          trucks={trucks}
          bins={bins}
          selectedTruck={selectedTruck}
          onTruckClick={handleTruckSelect}
          onBinClick={setSelectedBin}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;