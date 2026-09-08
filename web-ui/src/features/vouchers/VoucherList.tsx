import React, { useState, useEffect, useCallback } from 'react';
import { Voucher } from './types';
import { VoucherForm } from './VoucherForm';
import { usePermissions } from '../../hooks/usePermissions';
import toast from 'react-hot-toast';
import { Pagination } from '../../components/Pagination';
import { AdvancedSearch } from '../../components/AdvancedSearch';
import { FilterCondition, FilterField } from '../../utils/filterUtils';
import { useDebounce } from '../../hooks/useDebounce';
import { VoucherHistoryModal } from './VoucherHistoryModal';

const VOUCHER_FIELDS: FilterField[] = [
  { id: 'voucher_no', label: 'Voucher No.', type: 'text' },
  { id: 'voucher_guest_name', label: 'Guest Name', type: 'text' },
  { id: 'voucher_company', label: 'Company', type: 'text' },
  { id: 'voucher_status', label: 'Status', type: 'text' },
  { id: 'voucher_issue_date', label: 'Issue Date', type: 'date' },
];

export const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any>(null);
  const [viewHistoryVoucherId, setViewHistoryVoucherId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Advanced Search State
  const [advancedFilters, setAdvancedFilters] = useState<FilterCondition[]>([]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const [activeQuickFilter, setActiveQuickFilter] = useState('ALL');

  const handleQuickFilter = (filter: string) => {
    setActiveQuickFilter(filter);
    setIsAdvancedSearchOpen(false);
    
    if (filter === 'ALL') {
      setAdvancedFilters([]);
    } else if (filter === 'WAITING') {
      setAdvancedFilters([{ field: 'voucher_status', operator: 'equals', value: 'Waiting' }]);
    } else if (filter === 'CONFIRMED') {
      setAdvancedFilters([{ field: 'voucher_status', operator: 'equals', value: 'Confirmed' }]);
    } else if (filter === 'TODAY_TOUR') {
      const d = new Date();
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString();
      setAdvancedFilters([{ field: 'visit_date', operator: 'between', value: start, valueTo: end }]);
    } else if (filter === 'THIS_WEEK_CHECKIN') {
      const d = new Date();
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const startD = new Date(d.setDate(diff));
      startD.setHours(0,0,0,0);
      const endD = new Date(startD);
      endD.setDate(endD.getDate() + 6);
      endD.setHours(23,59,59,999);
      setAdvancedFilters([{ field: 'check_in_date', operator: 'between', value: startD.toISOString(), valueTo: endD.toISOString() }]);
    }
  };

  const { canAdd, canEdit, canDelete, canPrint } = usePermissions();

  // Debounce search and filters (Wait 500ms after user stops typing)
  const debouncedSearch = useDebounce(search, 500);
  const debouncedAdvancedFilters = useDebounce(advancedFilters, 500);

  // Check for auto-open form from query string
  useEffect(() => {
    if (window.location.search.includes('new=1')) {
      setShowForm(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (debouncedAdvancedFilters.length > 0) {
        params.append('advanced', JSON.stringify(debouncedAdvancedFilters));
      }

      const res = await fetch(`/api/vouchers?${params.toString()}`, { 
        headers: {  }
      });
      
      if (!res.ok) throw new Error('Failed to fetch vouchers');
      const payload = await res.json();
      
      setVouchers(payload.data);
      setTotalItems(payload.total);
      
    } catch (err: any) {
      toast.error('Frontend/Backend Error: ' + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, debouncedAdvancedFilters]);

  // Refetch when debounced values or page changes
  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // Reset to page 1 when search terms change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedAdvancedFilters]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/vouchers/${id}`, { 
        method: 'DELETE', 
        headers: {  }
      });
      if (!res.ok) throw new Error('Delete failed');
      setVouchers(prev => prev.filter(v => v.id !== id));
      toast.success('Voucher deleted successfully!');
    } catch (err: any) {
      toast.error('Backend Error: ' + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (id: string) => {
    window.open(`/api/vouchers/${id}/pdf`, '_blank');
  };

  return (
    <div className="space-y-4">
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Vouchers</h2>
        {canAdd && (
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Issue New Voucher
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">{editingVoucher ? `Edit Voucher: ${editingVoucher.voucher_no}` : 'Create Voucher'}</h3>
          <VoucherForm 
            isLoading={loading}
            initialData={editingVoucher}
            onCancel={() => {
              setShowForm(false);
              setEditingVoucher(null);
            }}
            onSubmit={async (data) => {
              setLoading(true);
              try {
                const url = editingVoucher ? `/api/vouchers/${editingVoucher.id}` : '/api/vouchers';
                const method = editingVoucher ? 'PATCH' : 'POST';
                const res = await fetch(url, {
                  method,
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
                });
                
                if (!res.ok) {
                  const errData = await res.json().catch(() => ({}));
                  throw new Error(errData.message || 'Operation failed');
                }
                toast.success(editingVoucher ? 'Voucher updated successfully!' : 'Voucher created successfully!');
                setShowForm(false);
                setEditingVoucher(null);
                fetchVouchers();
              } catch (err: any) {
                toast.error(err.message || 'Operation failed');
              } finally {
                setLoading(false);
              }
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 pt-3 border-b border-gray-200 flex space-x-2 overflow-x-auto bg-gray-50 rounded-t-lg">
            <button 
              onClick={() => handleQuickFilter('ALL')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${activeQuickFilter === 'ALL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              ทั้งหมด (All)
            </button>
            <button 
              onClick={() => handleQuickFilter('WAITING')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${activeQuickFilter === 'WAITING' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              รอคอนเฟิร์ม (Waiting)
            </button>
            <button 
              onClick={() => handleQuickFilter('CONFIRMED')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${activeQuickFilter === 'CONFIRMED' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              คอนเฟิร์มแล้ว (Confirmed)
            </button>
            <button 
              onClick={() => handleQuickFilter('TODAY_TOUR')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${activeQuickFilter === 'TODAY_TOUR' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              ทัวร์วันนี้ (Today's Tour)
            </button>
            <button 
              onClick={() => handleQuickFilter('THIS_WEEK_CHECKIN')}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${activeQuickFilter === 'THIS_WEEK_CHECKIN' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              เช็คอินสัปดาห์นี้ (Check-in This Week)
            </button>
          </div>
          <div className="p-4 border-b border-gray-200">
            <input 
              type="text" 
              placeholder="Quick search..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-md mb-2"
            />
            
            <AdvancedSearch 
              fields={VOUCHER_FIELDS}
              filters={advancedFilters}
              onChange={(f) => { setAdvancedFilters(f); setActiveQuickFilter('CUSTOM'); }}
              isOpen={isAdvancedSearchOpen}
              onToggle={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
            />
          </div>
          <div className="relative overflow-x-auto">
            {loading && (
               <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                 <span className="text-gray-500 font-medium">Loading...</span>
               </div>
            )}
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Voucher No.</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Issue Date</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Guest Name</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vouchers.map(v => (
                  <tr key={v.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{v.voucher_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const d = new Date(v.voucher_issue_date);
                        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                      })()}
                    </td>
                    <td className="px-6 py-4">{v.voucher_guest_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">{v.voucher_type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        v.voucher_status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                        v.voucher_status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {v.voucher_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => setViewHistoryVoucherId(v.id)} 
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
                          title="View History"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          History
                        </button>
                        {canPrint && (
                          <>
                            <button 
                              onClick={() => window.open(`/vouchers/${v.id}/print`, '_blank')} 
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 rounded-md transition-colors"
                              title="Print HTML (A4)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Print HTML
                            </button>
                            <button 
                              onClick={() => handlePrint(v.id)} 
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border border-green-200 rounded-md transition-colors"
                              title="Print PDF"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                              Print PDF
                            </button>
                          </>
                        )}
                        {canEdit && (
                          <button 
                            onClick={() => {
                              setEditingVoucher(v);
                              setShowForm(true);
                            }}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 border border-amber-200 rounded-md transition-colors" 
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            onClick={() => handleDelete(v.id)} 
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-md transition-colors"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {vouchers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No vouchers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {viewHistoryVoucherId && (
        <VoucherHistoryModal 
          voucherId={viewHistoryVoucherId} 
          onClose={() => setViewHistoryVoucherId(null)} 
        />
      )}
    </div>
  );
};

