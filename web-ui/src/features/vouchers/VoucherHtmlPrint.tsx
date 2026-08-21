import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Printer, ChevronLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const VoucherHtmlPrint: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': token ? `Bearer ${token}` : '' };
        
        const [voucherRes, settingsRes] = await Promise.all([
          fetch(`/api/vouchers/${id}`, { headers }),
          fetch('/api/settings', { headers })
        ]);

        if (voucherRes.ok && settingsRes.ok) {
          setVoucher(await voucherRes.json());
          setSettings(await settingsRes.json());
        }
      } catch (err) {
        console.error('Failed to load data for printing:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!voucher) return <div className="text-center mt-10 text-red-500">Voucher not found</div>;

  const publicUrl = `${window.location.origin}/api/vouchers/${id}/pdf`;

  let paxParts = [];
  if (voucher.pax_adult > 0) paxParts.push(`${voucher.pax_adult} Adult`);
  if (voucher.pax_child > 0) paxParts.push(`${voucher.pax_child} Chd-(${voucher.child_age || '-'}) `);
  if (voucher.pax_infant > 0) paxParts.push(`${voucher.pax_infant} Infant`);
  const paxString = paxParts.join(' / ');

  const getConditionText = () => {
    if (voucher.voucher_type === 'HOTEL') return settings?.condition_hotel;
    if (voucher.voucher_type === 'TOUR') return settings?.condition_tour;
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white font-sans p-4 print:p-0">
      {/* Print Controls (Hidden on Print) */}
      <div className="print:hidden flex justify-between items-center max-w-[210mm] mx-auto mb-4">
        <button 
          onClick={() => navigate('/vouchers')}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50 border"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Printer className="w-4 h-4" /> Print HTML Voucher
        </button>
      </div>

      {/* A4 Container */}
      <div className="relative w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full print:h-auto overflow-hidden">
        
        {/* Beautiful Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2100" 
            alt="Background" 
            className="w-full h-full object-cover opacity-[0.15] grayscale-[20%]"
            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          />
          <div className="absolute inset-0 bg-white/60" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-10 flex flex-col min-h-[297mm]">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6 border-b-2 border-gray-800 pb-4">
            <div className="w-48">
              {settings?.logo_image_path ? (
                <img src={settings.logo_image_path} alt="Logo" className="max-w-full h-auto max-h-24" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />
              ) : (
                <div className="text-3xl font-black text-red-600 tracking-tighter">MM<span className="text-black">HOLIDAY</span></div>
              )}
            </div>
            <div className="text-right text-sm text-gray-800">
              <h1 className="font-bold text-xl uppercase mb-1">{settings?.company_name || 'MM HOLIDAYS CO.,LTD.'}</h1>
              <p>{settings?.company_address}</p>
              <p>Tel: {settings?.company_tel}</p>
              <p>Email: {settings?.company_email} | Web: {settings?.company_web}</p>
              <p>TAT License: {settings?.tat_license}</p>
            </div>
          </div>

          <h2 className="text-3xl font-black text-center tracking-widest uppercase text-gray-900 mb-6">Voucher</h2>

          {/* Info Grid 1 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mb-6 bg-white/90 p-5 rounded-lg border border-gray-200" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            <div className="flex"><span className="font-bold w-32">Issue Date:</span> <span>{voucher.voucher_issue_date ? format(new Date(voucher.voucher_issue_date), 'dd/MM/yyyy') : '-'}</span></div>
            <div className="flex"><span className="font-bold w-32">Voucher No:</span> <span className="font-bold text-red-600">{voucher.voucher_no}</span></div>
            <div className="flex"><span className="font-bold w-32">Guest Name:</span> <span className="uppercase font-bold">{voucher.voucher_guest_name}</span></div>
            <div className="flex"><span className="font-bold w-32">PAX:</span> <span>{paxString}</span></div>
            <div className="flex"><span className="font-bold w-32">Company:</span> <span>{voucher.voucher_company}</span></div>
            <div className="flex"><span className="font-bold w-32">Type:</span> <span>{voucher.voucher_type}</span></div>
          </div>

          {/* Dynamic Details based on Type */}
          <div className="mb-6 bg-white/90 p-5 rounded-lg border border-gray-200 text-sm" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            <h3 className="font-bold text-base mb-3 border-b pb-1 uppercase">{voucher.voucher_type} DETAILS</h3>
            
            {voucher.voucher_type === 'HOTEL' && (
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex"><span className="font-bold w-32">Hotel Name:</span> <span>{voucher.hotel?.location_name || '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">Address:</span> <span>{voucher.hotel?.location_address || '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">Check In:</span> <span>{voucher.check_in_date ? format(new Date(voucher.check_in_date), 'dd/MM/yyyy') : '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">Check Out:</span> <span>{voucher.check_out_date ? format(new Date(voucher.check_out_date), 'dd/MM/yyyy') : '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">Room Type:</span> <span>{voucher.room_type || '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">No. of Rooms:</span> <span>{voucher.number_of_rooms || '-'}</span></div>
                <div className="flex col-span-2"><span className="font-bold w-32">Inclusions:</span> <span>{voucher.hotel_inclusion || '-'}</span></div>
              </div>
            )}

            {voucher.voucher_type === 'TOUR' && (
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex"><span className="font-bold w-32">Tour Name:</span> <span>{voucher.tour?.location_name || '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">Tour Date:</span> <span>{voucher.tour_date ? format(new Date(voucher.tour_date), 'dd/MM/yyyy') : '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">Pick-up Time:</span> <span>{voucher.pickup_time || '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">Pick-up Hotel:</span> <span>{voucher.pickup_hotel?.location_name || '-'}</span></div>
                <div className="flex col-span-2"><span className="font-bold w-32">Inclusions:</span> <span>{voucher.tour_inclusion || '-'}</span></div>
              </div>
            )}

            {voucher.voucher_type === 'TRANSPORT' && (
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex"><span className="font-bold w-32">Pick-up Date:</span> <span>{voucher.pickup_date ? format(new Date(voucher.pickup_date), 'dd/MM/yyyy') : '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">Time:</span> <span>{voucher.pickup_time || '-'}</span></div>
                <div className="flex col-span-2"><span className="font-bold w-32">Route:</span> <span>{voucher.transport_route || '-'}</span></div>
                <div className="flex col-span-2"><span className="font-bold w-32">Vehicle Type:</span> <span>{voucher.vehicle_type || '-'}</span></div>
              </div>
            )}
            
            {voucher.voucher_type === 'ATTRACTION' && (
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex"><span className="font-bold w-32">Attraction:</span> <span>{voucher.attraction?.location_name || '-'}</span></div>
                <div className="flex"><span className="font-bold w-32">Visit Date:</span> <span>{voucher.visit_date ? format(new Date(voucher.visit_date), 'dd/MM/yyyy') : '-'}</span></div>
                <div className="flex col-span-2"><span className="font-bold w-32">Inclusions:</span> <span>{voucher.attraction_inclusion || '-'}</span></div>
              </div>
            )}
          </div>

          <div className="mb-6 bg-white/90 p-4 rounded-lg" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            <span className="font-bold text-sm">Remark/Special Request:</span>
            <p className="text-sm mt-1">{voucher.voucher_remark || '-'}</p>
          </div>

          {/* Footer Area */}
          <div className="mt-auto flex justify-between items-end pt-4">
            <div className="flex gap-6 items-end">
              <div className="text-center">
                <div className="w-32 h-16 border-b border-gray-400 mb-2"></div>
                <div className="text-sm font-bold uppercase">Authorized By</div>
              </div>
              <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                {settings?.qr_code_path ? (
                  <img src={settings.qr_code_path} alt="QR" className="w-24 h-24" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />
                ) : (
                  <QRCodeSVG value={publicUrl} size={96} />
                )}
              </div>
            </div>
            
            <div className="w-1/2 text-xs bg-red-50 border border-red-200 p-3 rounded-lg text-red-900" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <div className="font-bold uppercase mb-1 text-red-700">Condition of booking :</div>
              <div className="font-bold mb-2">{settings?.condition_booking || 'NON REFUNDABLE'}</div>
              <div className="whitespace-pre-wrap leading-tight">{getConditionText()}</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
