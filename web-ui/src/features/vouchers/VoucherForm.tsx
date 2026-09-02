import React, { useState, useEffect } from 'react';
import { CreateVoucherPayload, MasterLocation } from './types';
import { InlineLocationManager } from './InlineLocationManager';
import toast from 'react-hot-toast';

interface Props {
  isLoading: boolean;
  initialData?: any;
  onSubmit: (data: CreateVoucherPayload) => Promise<void>;
  onCancel: () => void;
}

export const VoucherForm: React.FC<Props> = ({ isLoading, initialData, onSubmit, onCancel }) => {
  const [locations, setLocations] = useState<MasterLocation[]>([]);
  
  const [formData, setFormData] = useState<Partial<CreateVoucherPayload>>(initialData || {
    voucher_issue_date: new Date().toISOString().substring(0, 10),
    voucher_status: 'Waiting',
    voucher_type: 'HOTEL',
    voucher_guest_name: '',
    voucher_company: '',
    guest_mobile: '',
    pax_adult: 2,
    pax_child: 0,
    child_age: '',
    pax_infant: 0,
  });

  const fetchLocations = () => {
    fetch('/api/master-locations', { headers: {  }})
      .then(r => r.json())
      .then(data => setLocations(data || []))
      .catch(() => toast.error('Failed to load master locations'));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (field: keyof CreateVoucherPayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.voucher_guest_name) {
      toast.error('Guest name is required');
      return;
    }

    if (formData.voucher_type === 'HOTEL' && !formData.hotel_id) {
      toast.error('Please select a Hotel');
      return;
    }

    if (formData.voucher_type === 'LOCAL ATTRACTION' && !formData.attraction_id) {
      toast.error('Please select an Attraction');
      return;
    }

    if (formData.voucher_type === 'SHARING TOUR') {
      if (!formData.tour_id) {
        toast.error('Please select a Tour');
        return;
      }
      if (!formData.pickup_location) {
        toast.error('Please enter a Pick Up Hotel');
        return;
      }
    }
    
    // Convert to strict dates where needed before submit
    const payload = { ...formData };
    if (payload.voucher_issue_date) payload.voucher_issue_date = new Date(payload.voucher_issue_date).toISOString();
    if (payload.check_in_date) payload.check_in_date = new Date(payload.check_in_date).toISOString();
    if (payload.check_out_date) payload.check_out_date = new Date(payload.check_out_date).toISOString();
    if (payload.visit_date) payload.visit_date = new Date(payload.visit_date).toISOString();

    // Clean up empty relational fields to undefined so Prisma ignores them or sets to null
    if (payload.hotel_id === '') delete payload.hotel_id;
    if (payload.attraction_id === '') delete payload.attraction_id;
    if (payload.tour_id === '') delete payload.tour_id;

    onSubmit(payload as CreateVoucherPayload);
  };

  const hotels = locations.filter(l => l.locatype?.locatype_code === 'HOTEL');
  const attractions = locations.filter(l => l.locatype?.locatype_code === 'ATTRACTION');
  const tours = locations.filter(l => l.locatype?.locatype_code === 'TOUR');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 0. Document Status */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="font-bold text-gray-800">Voucher Status</h4>
          <p className="text-xs text-gray-500 mt-1">
            <strong>Waiting:</strong> Default when created.<br/>
            <strong>Confirmed:</strong> Ready for guest (e.g., Hotel confirmed).<br/>
            <strong>Cancelled:</strong> Voided/Refunded.
          </p>
        </div>
        <div className="w-48">
          <select
            value={formData.voucher_status || 'Waiting'}
            onChange={e => handleChange('voucher_status', e.target.value)}
            className={`w-full p-2 border rounded font-bold ${
              formData.voucher_status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-300' :
              formData.voucher_status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-300' :
              'bg-yellow-50 text-yellow-700 border-yellow-300'
            }`}
          >
            <option value="Waiting">Waiting</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 1. Guest Details */}
      <div className="bg-blue-50 p-4 rounded border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-4">1. Guest Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Guest Name *</label>
            <input type="text" required value={formData.voucher_guest_name || ''} onChange={e => handleChange('voucher_guest_name', e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Mobile</label>
            <input type="text" value={formData.guest_mobile || ''} onChange={e => handleChange('guest_mobile', e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm text-gray-700">Adult PAX</label>
            <input type="number" min="0" value={formData.pax_adult || 0} onChange={e => handleChange('pax_adult', parseInt(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Child PAX</label>
            <input type="number" min="0" value={formData.pax_child || 0} onChange={e => handleChange('pax_child', parseInt(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Child Age</label>
            <input type="text" placeholder="e.g. 5, 8" value={formData.child_age || ''} onChange={e => handleChange('child_age', e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Infant PAX</label>
            <input type="number" min="0" value={formData.pax_infant || 0} onChange={e => handleChange('pax_infant', parseInt(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded" />
          </div>
        </div>
      </div>

      {/* 2. Voucher Type */}
      <div className="bg-gray-50 p-4 rounded border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">2. Voucher Type</h4>
        <select 
          value={formData.voucher_type} 
          onChange={e => handleChange('voucher_type', e.target.value)} 
          className="w-full p-2 border rounded bg-white font-bold text-blue-700"
        >
          <option value="HOTEL">Hotel</option>
          <option value="LOCAL ATTRACTION">Local Attraction</option>
          <option value="SHARING TOUR">Sharing Tour</option>
        </select>
      </div>

      {/* 3. Dynamic Section */}
      <div className="p-4 rounded border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">3. Booking Details</h4>
        
        {formData.voucher_type === 'HOTEL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InlineLocationManager
                label="Hotel"
                typeCode="HOTEL"
                value={formData.hotel_id || ''}
                onChange={val => handleChange('hotel_id', val)}
                locations={locations}
                onLocationsUpdated={fetchLocations}
                required={true}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Check In Date</label>
              <input type="date" value={formData.check_in_date?.substring(0, 10) || ''} onChange={e => handleChange('check_in_date', e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Check Out Date</label>
              <input type="date" value={formData.check_out_date?.substring(0, 10) || ''} onChange={e => handleChange('check_out_date', e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Nights</label>
              <input type="number" value={formData.nights || ''} onChange={e => handleChange('nights', parseInt(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Rooms</label>
              <input type="number" value={formData.rooms || ''} onChange={e => handleChange('rooms', parseInt(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <InlineLocationManager
                label="Room Type"
                typeCode="ROOM_TYPE"
                value={formData.room_type || ''}
                onChange={val => handleChange('room_type', val)}
                locations={locations}
                onLocationsUpdated={fetchLocations}
                valueKey="name"
              />
            </div>
          </div>
        )}

        {formData.voucher_type === 'LOCAL ATTRACTION' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InlineLocationManager
                label="Attraction"
                typeCode="ATTRACTION"
                value={formData.attraction_id || ''}
                onChange={val => handleChange('attraction_id', val)}
                locations={locations}
                onLocationsUpdated={fetchLocations}
                required={true}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Date of Visit</label>
              <input type="date" value={formData.visit_date?.substring(0, 10) || ''} onChange={e => handleChange('visit_date', e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Number of Person</label>
              <input type="number" value={formData.person_count || ''} onChange={e => handleChange('person_count', parseInt(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700">Entrance Ticket Type</label>
              <input type="text" value={formData.entrance_ticket || ''} onChange={e => handleChange('entrance_ticket', e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
          </div>
        )}

        {formData.voucher_type === 'SHARING TOUR' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InlineLocationManager
                label="Tour"
                typeCode="TOUR"
                value={formData.tour_id || ''}
                onChange={val => handleChange('tour_id', val)}
                locations={locations}
                onLocationsUpdated={fetchLocations}
                required={true}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Date of Visit</label>
              <input type="date" value={formData.visit_date?.substring(0, 10) || ''} onChange={e => handleChange('visit_date', e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Number of Person</label>
              <input type="number" value={formData.person_count || ''} onChange={e => handleChange('person_count', parseInt(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded" />
            </div>
              <div>
                <label className="block text-sm text-gray-700">Pick Up Hotel</label>
                <input 
                  type="text" 
                  list="hotel-list"
                  placeholder="Type or select a hotel..."
                  value={formData.pickup_location || ''} 
                  onChange={e => handleChange('pickup_location', e.target.value)} 
                  className="mt-1 w-full p-2 border rounded bg-white" 
                />
                <datalist id="hotel-list">
                  {hotels.map(loc => (
                    <option key={loc.id} value={loc.location_name} />
                  ))}
                </datalist>
              </div>
            <div>
              <label className="block text-sm text-gray-700">Pick Up Time</label>
              <input type="text" placeholder="e.g. 07:30 AM" value={formData.pickup_time || ''} onChange={e => handleChange('pickup_time', e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
          </div>
        )}
      </div>

      {/* 4. Shared Footer */}
      <div className="bg-gray-50 p-4 rounded border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">4. Confirmation Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Confirmation Number</label>
            <input type="text" value={formData.conf_no || ''} onChange={e => handleChange('conf_no', e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Payment By</label>
            <input type="text" value={formData.payment_by || ''} onChange={e => handleChange('payment_by', e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Confirmed By</label>
            <input type="text" value={formData.conf_by || ''} onChange={e => handleChange('conf_by', e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Issue Date</label>
            <input type="date" value={formData.voucher_issue_date?.substring(0, 10) || ''} onChange={e => handleChange('voucher_issue_date', e.target.value)} className="mt-1 w-full p-2 border rounded" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700">Remarks</label>
            <textarea value={formData.remarks || ''} onChange={e => handleChange('remarks', e.target.value)} className="mt-1 w-full p-2 border rounded" rows={2}></textarea>
          </div>
        </div>
      </div>

      {/* 5. Audit Log (History) */}
      {initialData && (
        <div className="bg-blue-50 p-4 rounded border border-blue-100 flex justify-between items-center text-sm">
          <div>
            <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">Created By</span>
            <span className="font-medium text-blue-900">{initialData.created_by || 'System'}</span>
            <span className="text-gray-500 ml-2">on {new Date(initialData.created_at).toLocaleString('en-GB')}</span>
          </div>
          {initialData.updated_by && initialData.updated_at !== initialData.created_at && (
            <div className="text-right">
              <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">Last Edited By</span>
              <span className="font-medium text-blue-900">{initialData.updated_by}</span>
              <span className="text-gray-500 ml-2">on {new Date(initialData.updated_at).toLocaleString('en-GB')}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? 'Saving...' : (initialData ? 'Update Voucher' : 'Create Voucher')}
        </button>
      </div>
    </form>
  );
};


