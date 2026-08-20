import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vouchers/dashboard-stats')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch stats');
        return r.json();
      })
      .then(data => {
        setStats(data);
      })
      .catch(err => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <Link to="/vouchers/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm font-medium">
          + Issue New Voucher
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Vouchers</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalVouchers || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Issued Today</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.todayVouchers || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Waiting Status</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.waitingVouchers || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Recent Vouchers</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats?.recentVouchers?.map((v: any) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  <Link to={`/vouchers`}>{v.voucher_no}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {v.guest_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    v.voucher_status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                    v.voucher_status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {v.voucher_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/api/vouchers/${v.id}/pdf`} target="_blank" className="text-blue-600 hover:text-blue-900">View PDF</Link>
                </td>
              </tr>
            ))}
            {stats?.recentVouchers?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No recent vouchers found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <Link to="/vouchers" className="text-sm font-medium text-blue-600 hover:text-blue-900">View all vouchers &rarr;</Link>
        </div>
      </div>
    </div>
  );
};
