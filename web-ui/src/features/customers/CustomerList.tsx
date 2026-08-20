import React, { useState, useEffect } from 'react';
import { Customer } from './types';
import { CustomerForm } from './CustomerForm';
import { usePermissions } from '../../hooks/usePermissions';
import toast from 'react-hot-toast';
import { Pagination } from '../../components/Pagination';
import { AdvancedSearch } from '../../components/AdvancedSearch';
import { FilterCondition, FilterField, applyAdvancedFilters } from '../../utils/filterUtils';

const CUSTOMER_FIELDS: FilterField[] = [
  { id: 'cus_nickname', label: 'Nickname', type: 'text' },
  { id: 'cus_name', label: 'Name', type: 'text' },
  { id: 'cus_tel', label: 'Telephone', type: 'text' },
  { id: 'cus_fax', label: 'Fax', type: 'text' },
];

export const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
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

  const { isAdmin } = usePermissions();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/customers', { headers: { 'Authorization': 'Bearer 123' }});
      if (!res.ok) throw new Error('Failed to fetch customers');
      setCustomers(await res.json());
    } catch (err: any) {
      toast.error('Frontend/Backend Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. Quick Filter
  const quickFiltered = customers.filter(c => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      c.cus_name.toLowerCase().includes(term) || 
      c.cus_nickname.toLowerCase().includes(term) ||
      (c.cus_tel && c.cus_tel.toLowerCase().includes(term)) ||
      (c.cus_fax && c.cus_fax.toLowerCase().includes(term))
    );
  });

  // 2. Advanced Filters
  const fullyFilteredCustomers = applyAdvancedFilters(quickFiltered, advancedFilters);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, advancedFilters]);

  // Paginate
  const paginatedCustomers = fullyFilteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (!isAdmin) {
    return <div className="p-6 text-red-600 font-bold">Access Denied: Admin privileges required.</div>;
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/customers/${id}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': 'Bearer 123' }
      });
      if (!res.ok) throw new Error('Delete failed');
      setCustomers(prev => prev.filter(c => c.id !== id));
      toast.success('Customer deleted successfully!');
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
        <h2 className="text-xl font-bold">Master Customers</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add New
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Create Customer</h3>
          <CustomerForm 
            isLoading={loading}
            onCancel={() => setShowForm(false)}
            onSubmit={async (data) => {
              setLoading(true);
              try {
                const res = await fetch('/api/customers', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 123'
                  },
                  body: JSON.stringify(data)
                });
                if (!res.ok) {
                  const errData = await res.json().catch(() => ({}));
                  throw new Error(errData.message || 'Failed to save customer');
                }
                toast.success('Customer saved successfully!');
                setShowForm(false);
                fetchCustomers();
              } catch (err: any) {
                toast.error('Backend Error: ' + err.message);
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
              fields={CUSTOMER_FIELDS}
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
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Nickname</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Tel</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Fax</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCustomers.map(cus => (
                  <tr key={cus.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{cus.cus_nickname}</td>
                    <td className="px-6 py-4 font-medium">{cus.cus_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cus.cus_tel || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cus.cus_fax || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 border border-amber-200 rounded-md transition-colors" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(cus.id)} 
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-md transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={currentPage}
            totalItems={fullyFilteredCustomers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
