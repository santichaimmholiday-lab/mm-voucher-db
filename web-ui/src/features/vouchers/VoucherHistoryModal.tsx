import React, { useState, useEffect } from 'react';
import { X, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  user_name: string;
  action: string;
  details: string;
  created_at: string;
}

interface VoucherHistoryModalProps {
  voucherId: string;
  onClose: () => void;
}

export const VoucherHistoryModal: React.FC<VoucherHistoryModalProps> = ({ voucherId, onClose }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/vouchers/${voucherId}/logs`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [voucherId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Activity History
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading history...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No activity history found.</div>
          ) : (
            <div className="relative border-l border-gray-200 ml-3 space-y-6">
              {logs.map((log, index) => (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <span className={`absolute -left-2.5 top-1 rounded-full w-5 h-5 border-4 border-white ${
                    log.action === 'CREATE' ? 'bg-green-500' :
                    log.action === 'UPDATE' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}></span>
                  
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                    <span className="font-semibold text-gray-800 flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      {log.user_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 bg-white p-3 rounded-md shadow-sm border border-gray-100">
                    <div className="font-medium mb-1">
                      {log.action === 'CREATE' ? 'Created Voucher' :
                       log.action === 'UPDATE' ? 'Updated Voucher' :
                       'Deleted Voucher'}
                    </div>
                    {log.details && (
                      <div className="text-gray-500 text-xs font-mono bg-gray-50 p-2 rounded mt-2 overflow-x-auto whitespace-pre-wrap">
                        {log.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
