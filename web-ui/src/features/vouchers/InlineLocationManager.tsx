import CreatableSelect from 'react-select/creatable';
import React, { useState, useEffect } from 'react';
import { MasterLocation } from './types';
import toast from 'react-hot-toast';

interface Props {
  label: string;
  typeCode: 'HOTEL' | 'ATTRACTION' | 'TOUR' | 'ROOM_TYPE';
  value: string;
  onChange: (val: string) => void;
  locations: MasterLocation[];
  onLocationsUpdated: () => void;
  required?: boolean;
  valueKey?: 'id' | 'name';
}

export const InlineLocationManager: React.FC<Props> = ({ label, typeCode, value, onChange, locations, onLocationsUpdated, required, valueKey = 'id' }) => {
  const [isManaging, setIsManaging] = useState(false);
  const [locatypeId, setLocatypeId] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newAddress, setNewAddress] = useState('');
  
  const filteredLocations = locations.filter(l => l.locatype?.locatype_code === typeCode);

  useEffect(() => {
    // Fetch locatypes to get the correct ID for this typeCode
    fetch('/api/master-locatypes', { headers: {  }})
      .then(res => res.json())
      .then(data => {
        const type = data.find((t: any) => t.locatype_code === typeCode);
        if (type) setLocatypeId(type.id);
      })
      .catch(err => console.error(err));
  }, [typeCode]);

  const handleAdd = async () => {
    if (!newName || !newCode) {
      toast.error('Name and Code are required');
      return;
    }
    if (!locatypeId) {
      toast.error('System error: Location type not found');
      return;
    }

    try {
      const res = await fetch('/api/master-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({
          location_code: newCode,
          location_name: newName,
          location_address: newAddress,
          location_locatype: locatypeId
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add location');
      }
      toast.success('Location added!');
      setNewName('');
      setNewCode('');
      setNewAddress('');
      onLocationsUpdated();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (loc: MasterLocation) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      const res = await fetch(`/api/master-locations/${loc.id}`, {
        method: 'DELETE',
        headers: {  }
      });
      if (!res.ok) throw new Error('Failed to delete location');
      
      if (valueKey === 'name' && value === loc.location_name) onChange('');
      else if (valueKey === 'id' && value === loc.id) onChange('');
      
      toast.success('Location deleted!');
      onLocationsUpdated();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleEdit = async (loc: MasterLocation) => {
    const newLocName = window.prompt('Edit Name:', loc.location_name);
    if (newLocName === null) return;

    const newLocAddr = window.prompt('Edit Address:', loc.location_address || '');
    if (newLocAddr === null) return;

    try {
      const res = await fetch(`/api/master-locations/${loc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',  },
        body: JSON.stringify({
          location_name: newLocName,
          location_address: newLocAddr
        })
      });
      if (!res.ok) throw new Error('Failed to update location');
      toast.success('Location updated!');
      onLocationsUpdated();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="flex space-x-2 mt-1">
        <div className="flex-1">
          <CreatableSelect
            isClearable
            options={filteredLocations.map(h => ({
              value: valueKey === 'name' ? h.location_name : h.id,
              label: h.location_name
            }))}
            value={value ? { value: value, label: valueKey === 'name' ? value : (filteredLocations.find(l => l.id === value)?.location_name || locations.find(l => l.id === value)?.location_name || value) } : null}
            onChange={(newValue: any) => onChange(newValue ? newValue.value : '')}
            placeholder={`Search or type ${label}...`}
            formatCreateLabel={(inputValue) => `Use custom: "${inputValue}"`}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '42px',
                borderColor: '#e5e7eb',
                borderRadius: '0.375rem',
              })
            }}
          />
        </div>
        <button 
          type="button" 
          onClick={() => setIsManaging(!isManaging)}
          className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 shadow-sm flex-shrink-0"
        >
          ⚙️ Manage
        </button>
      </div>

      {isManaging && (
        <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-inner">
          <h5 className="font-bold text-sm text-gray-800 mb-2">Manage {label}</h5>
          
          <ul className="mb-3 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded">
            {filteredLocations.map(t => (
              <li key={t.id} className="flex justify-between items-center p-2 border-b last:border-0 hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-700">{t.location_name} <span className="text-xs text-gray-400">({t.location_code})</span></span>
                <div className="space-x-3">
                  <button type="button" onClick={() => handleEdit(t)} className="text-xs text-indigo-600 hover:text-indigo-900 font-semibold">Edit</button>
                  <button type="button" onClick={() => handleDelete(t)} className="text-xs text-red-600 hover:text-red-900 font-semibold">Delete</button>
                </div>
              </li>
            ))}
            {filteredLocations.length === 0 && (
              <li className="p-2 text-sm text-gray-500 text-center">No locations found.</li>
            )}
          </ul>
          
          <div className="flex flex-col space-y-2 mt-2">
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Code (e.g. HTL01)" 
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-1/3 p-2 text-sm border rounded"
              />
              <input 
                type="text" 
                placeholder="Name..." 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 p-2 text-sm border rounded"
              />
            </div>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Address (Optional)" 
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="flex-1 p-2 text-sm border rounded"
              />
              <button 
                type="button" 
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 font-medium whitespace-nowrap"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


