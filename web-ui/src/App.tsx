import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';
import { LogOut, UserCircle } from 'lucide-react';
import { LoginPage } from './features/auth/LoginPage';
import { PermissionsDashboard } from './features/auth/PermissionsDashboard';
import { MasterLocationList } from './features/master-locations/MasterLocationList';
import { CustomerList } from './features/customers/CustomerList';
import { VoucherList } from './features/vouchers/VoucherList';
import { SettingsPage } from './features/settings/SettingsPage';
import { MockPdfPreview } from './features/vouchers/MockPdfPreview';

import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState<{ email: string; role: string; username?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        setUser({ email: payload.email, role: payload.role, username: payload.email.split('@')[0] });
      } catch (e) {
        console.error('Failed to parse token', e);
      }
    }
  }, []);

  const getNavClass = ({ isActive }: { isActive: boolean }) => 
    isActive 
      ? "bg-blue-900 text-white px-3 py-2 rounded-md font-bold shadow-inner border border-blue-700"
      : "text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md font-medium transition-colors";

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-blue-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <img src="/mm_logo.png" alt="MM Holiday Logo" className="h-10 w-auto bg-white rounded-md p-1" />
                <div className="hidden md:flex space-x-2">
                  {!user && <NavLink to="/" end className={getNavClass}>Login</NavLink>}
                  {user && (
                    <>
                      <NavLink to="/permissions" className={getNavClass}>Permissions</NavLink>
                      <NavLink to="/master-locations" className={getNavClass}>Locations</NavLink>
                      <NavLink to="/customers" className={getNavClass}>Customers</NavLink>
                      <NavLink to="/vouchers" className={getNavClass}>Vouchers</NavLink>
                      <NavLink to="/settings" className={getNavClass}>Settings</NavLink>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <>
                    <div className="flex items-center space-x-2 text-blue-100 bg-blue-900/50 px-3 py-1.5 rounded-full border border-blue-700/50">
                      <UserCircle className="w-5 h-5 text-blue-300" />
                      <span className="text-sm font-medium">Hi, <span className="text-white capitalize">{user.username}</span></span>
                    </div>
                    <div className="h-6 w-px bg-blue-700"></div>
                  </>
                )}
                <Link 
                  to="/" 
                  onClick={() => { localStorage.removeItem('token'); setUser(null); }} 
                  className="flex items-center space-x-2 text-blue-200 hover:text-white px-2 py-2 rounded-md text-sm font-medium transition-colors opacity-80 hover:opacity-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto py-6">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/permissions" element={<PermissionsDashboard />} />
            <Route path="/master-locations" element={<MasterLocationList />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/vouchers" element={<VoucherList />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/api/vouchers/:id/pdf" element={<MockPdfPreview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
