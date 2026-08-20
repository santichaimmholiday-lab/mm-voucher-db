import React, { useState, useEffect } from 'react';
import { MasterLocation } from './types';
import { MasterLocationForm } from './MasterLocationForm';

// Mock hook for permissions
const usePermissions = () => ({
  canAdd: true,
  canEdit: true,
  canDelete: false // Simulating restricted permission
});

export const MasterLocationList: React.FC = () => {
  const [locations, setLocations] = useState<MasterLocation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const { canAdd, canEdit, canDelete } = usePermissions();

  useEffect(() => {
    // Fetch data mockup
    setLocations([
      { id: '1', location_code: 'BKK-01', location_name: 'Bangkok Head Office', is_deleted: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ]);
  }, []);

  const filteredLocations = locations.filter(l => 
    l.location_name.toLowerCase().includes(search.toLowerCase()) || 
    l.location_code.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      setLoading(true);
      // await api.delete(id); BR-MAS-002 Soft Delete API Call
      setLocations(prev => prev.filter(l => l.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Master Locations</h1>
        {canAdd && (
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            + Add New
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {showForm ? (
        <div className="bg-white p-4 shadow rounded mb-4 border">
          <h2 className="text-lg font-semibold mb-4">Create Master Location</h2>
          <MasterLocationForm 
            isLoading={loading}
            onCancel={() => setShowForm(false)}
            onSubmit={async (data) => {
              // try { await api.post(data); BR-MAS-001 Duplicate Check handling } catch(e) { setError(e) }
              console.log('Saving...', data);
              setShowForm(false);
            }} 
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded border overflow-hidden">
          <div className="p-4 border-b">
            <input 
              type="text" 
              placeholder="Search by name or code..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map(loc => (
                <tr key={loc.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{loc.location_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loc.location_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {canEdit && <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>}
                    {canDelete ? (
                      <button onClick={() => handleDelete(loc.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    ) : (
                      <span className="text-gray-400 cursor-not-allowed" title="No Permission">Delete</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLocations.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No locations found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination UI goes here */}
        </div>
      )}
    </div>
  );
};
