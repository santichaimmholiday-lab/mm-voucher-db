import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateCustomerPayload } from './types';

const formSchema = z.object({
  cus_nickname: z.string().min(1, 'Nickname is required').max(100, 'Nickname is too long'),
  cus_name: z.string().min(1, 'Customer Name is required'),
  cus_address: z.string().optional(),
  cus_tel: z.string().optional(),
  cus_fax: z.string().optional(),
  cus_note: z.string().optional(),
});

interface Props {
  initialData?: CreateCustomerPayload;
  onSubmit: (data: CreateCustomerPayload) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const CustomerForm: React.FC<Props> = ({ initialData, onSubmit, isLoading, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateCustomerPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      cus_nickname: '', cus_name: '', cus_address: '', cus_tel: '', cus_fax: '', cus_note: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-1">
        <label className="block text-sm font-medium">Nickname (Code) <span className="text-red-500">*</span></label>
        <input 
          {...register('cus_nickname')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
          placeholder="e.g. AGT-001"
        />
        {errors.cus_nickname && <p className="text-red-500 text-xs mt-1">{errors.cus_nickname.message}</p>}
      </div>

      <div className="md:col-span-1">
        <label className="block text-sm font-medium">Full Name / Company <span className="text-red-500">*</span></label>
        <input 
          {...register('cus_name')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
          placeholder="Company or Customer Name"
        />
        {errors.cus_name && <p className="text-red-500 text-xs mt-1">{errors.cus_name.message}</p>}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium">Address</label>
        <textarea 
          {...register('cus_address')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
          rows={3}
        />
      </div>

      <div className="md:col-span-1">
        <label className="block text-sm font-medium">Telephone</label>
        <input 
          {...register('cus_tel')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
      </div>

      <div className="md:col-span-1">
        <label className="block text-sm font-medium">Fax</label>
        <input 
          {...register('cus_fax')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium">Notes</label>
        <textarea 
          {...register('cus_note')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
          rows={2}
        />
      </div>

      <div className="md:col-span-2 flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          {isLoading ? 'Saving...' : 'Save Customer'}
        </button>
      </div>
    </form>
  );
};
