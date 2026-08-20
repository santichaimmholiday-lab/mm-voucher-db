import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateMasterLocationPayload } from './types';

const formSchema = z.object({
  location_code: z.string().min(1, 'Location Code is required'),
  location_name: z.string().min(1, 'Location Name is required'),
  location_address: z.string().optional(),
  location_locatype: z.string().min(1, 'Location Type is required'),
});

interface Props {
  initialData?: CreateMasterLocationPayload;
  onSubmit: (data: CreateMasterLocationPayload) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const MasterLocationForm: React.FC<Props> = ({ initialData, onSubmit, isLoading, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateMasterLocationPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { location_code: '', location_name: '', location_address: '', location_locatype: '' }
  });

  const [locatypes, setLocatypes] = useState<{ id: string, locatype_name: string }[]>([]);
  const [isManagingType, setIsManagingType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  React.useEffect(() => {
    fetchLocatypes();
  }, []);

  const fetchLocatypes = async () => {
    try {
      const res = await fetch('/api/master-locatypes', { headers: { 'Authorization': 'Bearer 123' }});
      if (res.ok) setLocatypes(await res.json());
    } catch (e) {
      console.error('Failed to fetch locatypes', e);
    }
  };

  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    try {
      const res = await fetch('/api/master-locatypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer 123' },
        body: JSON.stringify({ locatype_code: newTypeName.toUpperCase().replace(/\s+/g, '_'), locatype_name: newTypeName })
      });
      if (res.ok) {
        setNewTypeName('');
        fetchLocatypes();
      } else {
        alert('Failed to save location type');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteType = async (id: string) => {
    if (window.confirm('Delete this location type?')) {
      try {
        const res = await fetch(`/api/master-locatypes/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer 123' }});
        if (res.ok) {
          fetchLocatypes();
          if (watch('location_locatype') === id) setValue('location_locatype', '');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Location Code <span className="text-red-500">*</span></label>
        <input 
          {...register('location_code')} 
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          disabled={isLoading}
        />
        {errors.location_code && <p className="text-red-500 text-xs mt-1">{errors.location_code.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Location Name <span className="text-red-500">*</span></label>
        <input 
          {...register('location_name')} 
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          disabled={isLoading}
        />
        {errors.location_name && <p className="text-red-500 text-xs mt-1">{errors.location_name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <textarea 
          {...register('location_address')} 
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          disabled={isLoading}
        />
      </div>

      {/* Location Type Dropdown with Inline Management */}
      <div>
        <label className="block text-sm font-medium">Location Type <span className="text-red-500">*</span></label>
        <div className="flex space-x-2 mt-1">
          <div className="flex-1">
            <select 
              {...register('location_locatype')} 
              className="block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-white"
              disabled={isLoading}
            >
              <option value="">-- Select Type --</option>
              {locatypes.map(t => (
                <option key={t.id} value={t.id}>{t.locatype_name}</option>
              ))}
            </select>
          </div>
          <button 
            type="button" 
            onClick={() => setIsManagingType(!isManagingType)}
            className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 shadow-sm flex-shrink-0"
          >
            ⚙️ Manage Types
          </button>
        </div>
        {errors.location_locatype && <p className="text-red-500 text-xs mt-1">{errors.location_locatype.message}</p>}

        {/* Inline Locatype Manager Modal / Panel */}
        {isManagingType && (
          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-bold text-sm text-blue-800 mb-2">Manage Master Locatypes</h4>
            <ul className="mb-3 max-h-32 overflow-y-auto bg-white border border-gray-200 rounded">
              {locatypes.map(t => (
                <li key={t.id} className="flex justify-between items-center p-2 border-b last:border-0 hover:bg-gray-50">
                  <span className="text-sm font-medium">{t.locatype_name}</span>
                  <div className="space-x-2">
                    <button type="button" onClick={() => {
                        const newName = window.prompt('Edit Name:', t.locatype_name);
                        if (newName) {
                            setLocatypes(locatypes.map(lt => lt.id === t.id ? { ...lt, name: newName } : lt));
                        }
                    }} className="text-xs text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button type="button" onClick={() => handleDeleteType(t.id)} className="text-xs text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="New type name..." 
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="flex-1 p-1 text-sm border rounded"
              />
              <button 
                type="button" 
                onClick={handleAddType}
                className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};
