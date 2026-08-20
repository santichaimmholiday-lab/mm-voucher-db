import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateMasterLocationPayload } from './types';

const formSchema = z.object({
  location_code: z.string().min(1, 'Location Code is required'),
  location_name: z.string().min(1, 'Location Name is required'),
  location_address: z.string().optional(),
  location_locatype: z.string().optional(),
});

interface Props {
  initialData?: CreateMasterLocationPayload;
  onSubmit: (data: CreateMasterLocationPayload) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const MasterLocationForm: React.FC<Props> = ({ initialData, onSubmit, isLoading, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateMasterLocationPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { location_code: '', location_name: '', location_address: '', location_locatype: '' }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Location Code <span className="text-red-500">*</span></label>
        <input 
          {...register('location_code')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
        {errors.location_code && <p className="text-red-500 text-xs mt-1">{errors.location_code.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Location Name <span className="text-red-500">*</span></label>
        <input 
          {...register('location_name')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
        {errors.location_name && <p className="text-red-500 text-xs mt-1">{errors.location_name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <textarea 
          {...register('location_address')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Location Type</label>
        <input 
          {...register('location_locatype')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};
