import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateVoucherPayload } from './types';

// Omitted full zod schema for brevity, but it aligns with backend DTO
const formSchema = z.object({
  voucher_issue_date: z.string().min(1, 'Issue Date is required'),
  voucher_guest_name: z.string().min(1, 'Guest name is required'),
  voucher_company: z.string().min(1, 'Company name is required'),
  // Add other fields as optional
});

interface Props {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const VoucherForm: React.FC<Props> = ({ onSubmit, isLoading, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'hotel' | 'tour'>('general');
  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: { voucher_issue_date: new Date().toISOString().split('T')[0] }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex border-b border-gray-200">
        <button type="button" onClick={() => setActiveTab('general')} className={\`py-2 px-4 \${activeTab === 'general' ? 'border-b-2 border-blue-500 font-semibold' : ''}\`}>General Details</button>
        <button type="button" onClick={() => setActiveTab('hotel')} className={\`py-2 px-4 \${activeTab === 'hotel' ? 'border-b-2 border-blue-500 font-semibold' : ''}\`}>Hotel Booking</button>
        <button type="button" onClick={() => setActiveTab('tour')} className={\`py-2 px-4 \${activeTab === 'tour' ? 'border-b-2 border-blue-500 font-semibold' : ''}\`}>Tour/Transfer</button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Issue Date <span className="text-red-500">*</span></label>
              <input type="date" {...register('voucher_issue_date')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              {errors.voucher_issue_date && <p className="text-red-500 text-xs mt-1">{errors.voucher_issue_date.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Guest Name <span className="text-red-500">*</span></label>
              <input {...register('voucher_guest_name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              {errors.voucher_guest_name && <p className="text-red-500 text-xs mt-1">{errors.voucher_guest_name.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Company / Agent <span className="text-red-500">*</span></label>
              <input {...register('voucher_company')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Pax No (Adult/Child)</label>
              <div className="flex space-x-2">
                <input {...register('voucher_adult')} placeholder="Adults" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                <input {...register('voucher_child')} placeholder="Children" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hotel' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Hotel Name</label>
              <input {...register('hotel.hotel_hotel')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Room Type & Nights</label>
              <div className="flex space-x-2">
                <input {...register('hotel.hotel_room_type')} placeholder="Type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                <input type="number" {...register('hotel.hotel_night')} placeholder="Nights" className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Check In</label>
              <input type="date" {...register('hotel.hotel_check_in')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Check Out</label>
              <input type="date" {...register('hotel.hotel_check_out')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          </div>
        )}

        {activeTab === 'tour' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Pick Up Date</label>
              <input type="date" {...register('tour.tour_pick_up_date')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Pick Up Time</label>
              <input type="time" {...register('tour.tour_pick_up_time')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Meals Provided</label>
              <div className="flex space-x-4 mt-2">
                <label className="inline-flex items-center"><input type="checkbox" {...register('tour.tour_lunch')} value="Yes" className="rounded" /><span className="ml-2">Lunch</span></label>
                <label className="inline-flex items-center"><input type="checkbox" {...register('tour.tour_dinner')} value="Yes" className="rounded" /><span className="ml-2">Dinner</span></label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-green-600 text-white rounded-md shadow">
          {isLoading ? 'Saving Transaction...' : 'Save Complete Voucher'}
        </button>
      </div>
    </form>
  );
};
