import React, { useState, useEffect } from 'react';
import { MasterLocation } from './types';
import { MasterLocationForm } from './MasterLocationForm';
import { usePermissions } from '../../hooks/usePermissions';
import toast from 'react-hot-toast';
import { Pagination } from '../../components/Pagination';
import { AdvancedSearch } from '../../components/AdvancedSearch';
import { FilterCondition, FilterField, applyAdvancedFilters } from '../../utils/filterUtils';

const LOCATION_FIELDS: FilterField[] = [
  { id: 'location_code', label: 'Code', type: 'text' },
  { id: 'location_name', label: 'Name', type: 'text' },
  { id: 'locatype.locatype_name', label: 'Type', type: 'text' },
  { id: 'location_address', label: 'Address', type: 'text' },
];

export const MasterLocationList: React.FC = () => {
  const [locations, setLocations] = useState<MasterLocation[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced Search State
  const [advancedFilters, setAdvancedFilters] = useState<FilterCondition[]>([]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { canAdd, canEdit, canDelete } = usePermissions();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/master-locations', { headers: { 'Authorization': 'Bearer 123' }});
      if (!res.ok) throw new Error('Failed to fetch locations');
      setLocations(await res.json());
    } catch (err: any) {
      toast.error('Frontend/Backend Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. Quick Filter
  const quickFiltered = locations.filter(l => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      l.location_name.toLowerCase().includes(term) || 
      l.location_code.toLowerCase().includes(term) ||
      (l.location_address && l.location_address.toLowerCase().includes(term)) ||
      (l.locatype?.locatype_name && l.locatype.locatype_name.toLowerCase().includes(term))
    );
  });

  // 2. Advanced Filters
  const fullyFilteredLocations = applyAdvancedFilters(quickFiltered, advancedFilters);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, advancedFilters]);

  // Paginate
  const paginatedLocations = fullyFilteredLocations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/master-locations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer 123' }
      });
      if (!res.ok) throw new Error('Delete failed');
      setLocations(prev => prev.filter(l => l.id !== id));
      toast.success('Location deleted successfully!');
    } catch (err: any) {
      toast.error('Backend Error: ' + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Master Locations</h2>
        {canAdd && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add New
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Create Master Location</h3>
          <MasterLocationForm 
            isLoading={loading}
            onCancel={() => setShowForm(false)}
            onSubmit={async (data) => {
              setLoading(true);
              setError('');
              try {
                const res = await fetch('/api/master-locations', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 123'
                  },
                  body: JSON.stringify(data)
                });
                
                if (!res.ok) {
                  const errData = await res.json().catch(() => ({}));
                  throw new Error(errData.message || 'Failed to save location');
                }
                
                toast.success('Location saved successfully!');
                setShowForm(false);
                fetchLocations();
              } catch (err: any) {
                toast.error('Backend Error: ' + err.message);
                setError(err.message);
              } finally {
                setLoading(false);
              }
            }} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <input 
              type="text" 
              placeholder="Quick search..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-md mb-2"
            />
            
            <AdvancedSearch 
              fields={LOCATION_FIELDS}
              filters={advancedFilters}
              onChange={setAdvancedFilters}
              isOpen={isAdvancedSearchOpen}
              onToggle={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedLocations.map(loc => (
                  <tr key={loc.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{loc.location_code}</td>
                    <td className="px-6 py-4 font-medium">{loc.location_name}</td>
                    <td className="px-6 py-4">{loc.locatype?.locatype_name || loc.location_locatype}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{loc.location_address || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {canEdit && (
                          <button className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 border border-amber-200 rounded-md transition-colors" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            onClick={() => handleDelete(loc.id)} 
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-md transition-colors"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedLocations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No locations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={currentPage}
            totalItems={fullyFilteredLocations.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
