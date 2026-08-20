import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    company_name: '', company_name_th: '', company_address: '', company_tel: '', company_email: '', company_web: '',
    tat_license: '', condition_booking: '', condition_hotel: '', condition_tour: '', logo_image_path: '', qr_code_path: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings', { headers: { 'Authorization': 'Bearer 123' }});
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer 123' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Settings saved successfully!');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_image_path' | 'qr_code_path') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading('Uploading...');
    try {
      const res = await fetch('/api/settings/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer 123' },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setSettings((prev: any) => ({ ...prev, [field]: data.url }));
      toast.success('Upload complete!', { id: toastId });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 shadow-sm disabled:opacity-50 font-medium">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Voucher Images</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
              {settings.logo_image_path && (
                <div className="mb-2 p-2 border rounded bg-gray-50 flex justify-center">
                  <img src={settings.logo_image_path} alt="Logo" className="max-h-24 object-contain" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logo_image_path')} className="text-sm w-full" />
            </div>

            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-1">QR Code (Optional overrides dynamic QR)</label>
              {settings.qr_code_path && (
                <div className="mb-2 p-2 border rounded bg-gray-50 flex justify-center">
                  <img src={settings.qr_code_path} alt="QR Code" className="max-h-24 object-contain" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'qr_code_path')} className="text-sm w-full" />
              <p className="text-xs text-gray-500 mt-1">If blank, the system automatically generates a QR code linking to the voucher PDF.</p>
            </div>
          </div>
        </div>

        {/* Company Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Company Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name (EN)</label>
              <input type="text" value={settings.company_name} onChange={e => setSettings({...settings, company_name: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name (TH)</label>
              <input type="text" value={settings.company_name_th} onChange={e => setSettings({...settings, company_name_th: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea value={settings.company_address} onChange={e => setSettings({...settings, company_address: e.target.value})} className="mt-1 w-full p-2 border rounded-md" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Telephone</label>
                <input type="text" value={settings.company_tel} onChange={e => setSettings({...settings, company_tel: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">TAT License</label>
                <input type="text" value={settings.tat_license} onChange={e => setSettings({...settings, tat_license: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="text" value={settings.company_email} onChange={e => setSettings({...settings, company_email: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input type="text" value={settings.company_web} onChange={e => setSettings({...settings, company_web: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Conditions Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Voucher Conditions (Fine Print)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Main Booking Condition (e.g. NON-REFUNDABLE)</label>
              <input type="text" value={settings.condition_booking} onChange={e => setSettings({...settings, condition_booking: e.target.value})} className="mt-1 w-full p-2 border rounded-md font-bold text-red-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">*Hotel Remarks*</label>
                <textarea value={settings.condition_hotel} onChange={e => setSettings({...settings, condition_hotel: e.target.value})} className="mt-1 w-full p-2 border rounded-md text-sm" rows={6} placeholder="Rules for Hotel vouchers..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">*Sharing Tour Remarks*</label>
                <textarea value={settings.condition_tour} onChange={e => setSettings({...settings, condition_tour: e.target.value})} className="mt-1 w-full p-2 border rounded-md text-sm" rows={6} placeholder="Rules for Tour vouchers..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
