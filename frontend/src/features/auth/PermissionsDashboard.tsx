import React, { useState } from 'react';

// Legacy modules mapped
const MODULES = ['Master_location', 'Customer', 'Voucher', 'Promotion'];
const ACTIONS = ['read', 'add', 'edit', 'delete', 'printx', 'confirm', 'upload'];

export const PermissionsDashboard: React.FC = () => {
  // Mock data representing a specific Role or User's current permissions
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({
    'Master_location': { read: true, add: false, edit: false, delete: false, printx: false, confirm: false, upload: false },
    'Voucher': { read: true, add: true, edit: true, delete: false, printx: true, confirm: false, upload: false }
  });
  const [loading, setLoading] = useState(false);

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
    // Simulate API call to PATCH /api/permissions/roles/:roleId
    console.log('Saving permissions matrix:', permissions);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    alert('Permissions updated successfully (Simulated)');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Permissions Matrix</h1>
          <p className="text-gray-500 text-sm mt-1">Configure granular access control for Roles or Users (Replaces Legacy edit_securable)</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg border overflow-hidden">
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
      </div>
      
      <div className="mt-4 bg-blue-50 p-4 rounded text-blue-800 text-sm">
        <strong>Note:</strong> Users assigned the "Admin" role automatically bypass this matrix and are granted all permissions system-wide.
      </div>
    </div>
  );
};
