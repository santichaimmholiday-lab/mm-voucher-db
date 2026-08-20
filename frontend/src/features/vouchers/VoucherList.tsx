import React, { useState, useEffect } from 'react';
import { Voucher } from './types';
import { VoucherForm } from './VoucherForm';

// Mock hook for fetching permissions
const usePermissions = () => ({
  canAdd: true,
  canPrint: true
});

export const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const { canAdd, canPrint } = usePermissions();

  useEffect(() => {
    // Mock fetching
    setVouchers([
      { id: 'uuid-1234', voucher_no: 'MM26080001', voucher_issue_date: '2026-08-19', voucher_guest_name: 'Mr. John Wick', voucher_company: 'Continental Hotel', voucher_status: 'Waiting', is_deleted: false }
    ]);
  }, []);

  const handlePrint = (id: string) => {
    // Calling GET /api/vouchers/:id/pdf
    window.open(\`/api/vouchers/\${id}/pdf\`, '_blank');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Voucher Management</h1>
        {canAdd && (
          <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
            + Issue New Voucher
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white p-6 shadow-lg rounded-lg border">
          <h2 className="text-xl font-bold mb-4">Create Master Voucher Document</h2>
          <VoucherForm 
            isLoading={loading}
            onCancel={() => setShowForm(false)}
            onSubmit={async (data) => {
              console.log('Dispatching Composite Payload...', data);
              setShowForm(false);
            }} 
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Voucher No</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Guest Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vouchers.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">{v.voucher_no}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{v.voucher_issue_date}</td>
                  <td className="px-6 py-4 font-medium">{v.voucher_guest_name}</td>
                  <td className="px-6 py-4">{v.voucher_company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {v.voucher_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {canPrint && (
                      <button onClick={() => handlePrint(v.id)} className="text-green-600 hover:text-green-900 font-medium bg-green-50 px-3 py-1 rounded">
                        🖨️ Print PDF
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
