import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Legacy modules mapped
const MODULES = ['Master_location', 'Customer', 'Voucher', 'Promotion'];
const ACTIONS = ['read', 'add', 'edit', 'delete', 'printx', 'confirm', 'upload'];
const ROLES = ['Manager', 'Staff', 'User'];

export const PermissionsDashboard: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPermissions(selectedRole);
  }, [selectedRole]);

  const fetchPermissions = async (role: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/permissions/roles/' + role);
      if (res.ok) {
        const data = await res.json();
        setPermissions(data);
      }
    } catch (e) {
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (module: string, action: string) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action]
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/permissions/roles/' + selectedRole, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissions)
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Permissions updated successfully!');
    } catch (e) {
      toast.error('Error saving permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Permissions Matrix</h1>
          <p className="text-gray-500 text-sm mt-1">Configure granular access control for Roles (Replaces Legacy edit_securable)</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Select Role:</label>
            <select 
              value={selectedRole} 
              onChange={e => setSelectedRole(e.target.value)}
              className="border border-gray-300 rounded-md p-2 bg-white shadow-sm"
              disabled={loading}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-gray-500">Loading matrix...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-r">Module Name</th>
                {ACTIONS.map(action => (
                  <th key={action} className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                    {action}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MODULES.map(module => (
                <tr key={module} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 border-r">{module}</td>
                  {ACTIONS.map(action => (
                    <td key={action} className="px-4 py-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        checked={permissions[module]?.[action] || false}
                        onChange={() => togglePermission(module, action)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="mt-4 bg-blue-50 p-4 rounded text-blue-800 text-sm">
        <strong>Note:</strong> Users assigned the "Admin" role automatically bypass this matrix and are granted all permissions system-wide.
      </div>
    </div>
  );
};
