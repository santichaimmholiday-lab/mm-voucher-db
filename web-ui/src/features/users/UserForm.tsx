import React, { useState } from 'react';
import { User, Mail, Shield, KeyRound } from 'lucide-react';

interface Props {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<Props> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    role: initialData?.role || 'User',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center space-x-1"><User className="w-4 h-4"/> <span>Username</span></div>
          </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={e => handleChange('username', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center space-x-1"><Mail className="w-4 h-4"/> <span>Email</span></div>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center space-x-1"><Shield className="w-4 h-4"/> <span>Role</span></div>
          </label>
          <select
            value={formData.role}
            onChange={e => handleChange('role', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Admin">Admin (Full Access)</option>
            <option value="Manager">Manager</option>
            <option value="User">User / Staff</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center space-x-1">
              <KeyRound className="w-4 h-4"/> 
              <span>Password {initialData ? '(Leave blank to keep old)' : '*'}</span>
            </div>
          </label>
          <input
            type="password"
            required={!initialData}
            value={formData.password}
            onChange={e => handleChange('password', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={initialData ? 'Enter new password...' : 'Enter password...'}
            minLength={6}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};
