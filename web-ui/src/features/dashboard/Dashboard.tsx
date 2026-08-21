import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [dateRangeType, setDateRangeType] = useState('thisMonth');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    fetchStats();
  }, [dateRangeType, customStart, customEnd]);

  const fetchStats = () => {
    let start = '';
    let end = '';
    
    const now = new Date();
    
    if (dateRangeType === 'thisMonth') {
      start = format(startOfMonth(now), 'yyyy-MM-dd');
      end = format(endOfMonth(now), 'yyyy-MM-dd');
    } else if (dateRangeType === 'lastMonth') {
      const last = subMonths(now, 1);
      start = format(startOfMonth(last), 'yyyy-MM-dd');
      end = format(endOfMonth(last), 'yyyy-MM-dd');
    } else if (dateRangeType === 'thisYear') {
      start = format(startOfYear(now), 'yyyy-MM-dd');
      end = format(endOfYear(now), 'yyyy-MM-dd');
    } else if (dateRangeType === 'custom') {
      if (customStart) start = customStart;
      if (customEnd) end = customEnd;
    }

    setLoading(true);

    const query = [];
    if (start) query.push(`startDate=${start}`);
    if (end) query.push(`endDate=${end}`);
    const fetchUrl = '/api/dashboard/stats' + (query.length ? '?' + query.join('&') : '');

    const token = localStorage.getItem('token');

    fetch(fetchUrl, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
      .then(r => {
        if (!r.ok) throw new Error(`Failed to fetch stats (Status: ${r.status})`);
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
  };

  if (!stats && loading) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <select 
            value={dateRangeType}
            onChange={(e) => setDateRangeType(e.target.value)}
            className="border-gray-300 rounded-md text-sm p-1.5 focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Time</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRangeType === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="border-gray-300 rounded-md text-sm p-1.5"
              />
              <span className="text-gray-500">-</span>
              <input 
                type="date" 
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="border-gray-300 rounded-md text-sm p-1.5"
              />
            </div>
          )}
          
          <Link to="/vouchers?new=1" className="ml-auto md:ml-2 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 shadow-sm text-sm font-medium">
            + Issue Voucher
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Vouchers</p>
            <p className="text-xl font-bold text-gray-900">{stats?.summary?.totalVouchers || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-2 bg-green-100 text-green-600 rounded-full">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Confirmed</p>
            <p className="text-xl font-bold text-gray-900">{stats?.summary?.confirmedVouchers || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Waiting</p>
            <p className="text-xl font-bold text-gray-900">{stats?.summary?.waitingVouchers || 0}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-full">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Cancelled</p>
            <p className="text-xl font-bold text-gray-900">{stats?.summary?.cancelledVouchers || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">New Customers</p>
            <p className="text-xl font-bold text-gray-900">{stats?.summary?.totalCustomers || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Voucher Issuance Trend</h3>
          <div className="h-64">
            {stats?.trend && stats.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="vouchers" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Vouchers" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No data for this period</div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Vouchers by Type</h3>
          <div className="h-64">
             {stats?.byType && stats.byType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.byType.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
             ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No data for this period</div>
             )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Recent Vouchers (In Selected Period)</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats?.recentVouchers?.map((v: any) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  <Link to={`/vouchers/${v.id}`}>{v.voucher_no}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {v.voucher_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {v.voucher_guest_name}
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
                  <a href={`/api/vouchers/${v.id}/pdf`} target="_blank" className="text-blue-600 hover:text-blue-900" rel="noreferrer">View PDF</a>
                </td>
              </tr>
            ))}
            {stats?.recentVouchers?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No vouchers found for this period.</td>
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
