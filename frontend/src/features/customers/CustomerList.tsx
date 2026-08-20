import React, { useState, useEffect } from 'react';
import { Customer } from './types';
import { CustomerForm } from './CustomerForm';

// Mock hook for fetching permissions based on JWT Role
const usePermissions = () => ({
  isAdmin: true // Based on legacy BR-CUS-001 (Admin only module)
});

export const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const { isAdmin } = usePermissions();

  useEffect(() => {
    // If not admin, we would redirect or show Access Denied based on Router logic
    if (isAdmin) {
      // Mock fetching
      setCustomers([
        { id: '1', cus_nickname: 'C-001', cus_name: 'John Doe Tours', cus_tel: '021234567', is_deleted: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <div className="p-6 text-red-600 font-bold">Access Denied: Admin privileges required.</div>;
  }

  const filtered = customers.filter(c => 
    c.cus_name.toLowerCase().includes(search.toLowerCase()) || 
    c.cus_nickname.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      setLoading(true);
      // await api.delete(id); BR-CUS-002 Bug-fixed Soft Delete
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          + Add Customer
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {showForm ? (
        <div className="bg-white p-4 shadow rounded mb-4 border">
          <h2 className="text-lg font-semibold mb-4">Create Customer</h2>
          <CustomerForm 
            isLoading={loading}
            onCancel={() => setShowForm(false)}
            onSubmit={async (data) => {
              console.log('Saving...', data);
              setShowForm(false);
            }} 
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded border overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <input 
              type="text" 
              placeholder="Search nickname or name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/3 border-gray-300 rounded-md shadow-sm"
            />
            <span className="text-sm text-gray-500">Showing {filtered.length} customers</span>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nickname</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telephone</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{c.cus_nickname}</td>
                  <td className="px-6 py-4">{c.cus_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.cus_tel || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No customers match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
