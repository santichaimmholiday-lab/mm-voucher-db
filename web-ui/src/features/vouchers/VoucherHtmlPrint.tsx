import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Printer, ChevronLeft, Sun, Palmtree, Smile, MapPin, Calendar, User, Users, Building, Ticket, Navigation, Car, Hotel, CheckCircle2, Heart } from 'lucide-react';
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

  const getVoucherIcon = () => {
    if (voucher.voucher_type === 'HOTEL') return <Hotel className="w-8 h-8 text-pink-500 inline-block mr-2" />;
    if (voucher.voucher_type === 'TOUR') return <MapPin className="w-8 h-8 text-green-500 inline-block mr-2" />;
    if (voucher.voucher_type === 'TRANSPORT') return <Car className="w-8 h-8 text-blue-500 inline-block mr-2" />;
    return <Ticket className="w-8 h-8 text-purple-500 inline-block mr-2" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white font-sans p-4 print:p-0">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Mali:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          .font-mali { font-family: 'Mali', cursive; }
          @media print {
            @page { size: A4; margin: 0; }
            body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .print-hide { display: none !important; }
            .shadow-lg, .shadow-xl, .shadow-2xl, .shadow-sm { box-shadow: none !important; }
          }
        `}
      </style>

      {/* Print Controls (Hidden on Print) */}
      <div className="print-hide flex justify-between items-center max-w-[210mm] mx-auto mb-4">
        <button 
          onClick={() => navigate('/vouchers')}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50 border"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600 font-mali font-bold"
        >
          <Printer className="w-5 h-5" /> Print Cute Voucher
        </button>
      </div>

      {/* A4 Container */}
      <div className="relative w-[210mm] min-h-[297mm] mx-auto bg-white print:w-full print:h-auto overflow-hidden shadow-xl p-8">
        
        {/* Ticket-style inner dashed border */}
        <div className="relative border-4 border-dashed border-sky-300 rounded-3xl h-full p-8 flex flex-col bg-sky-50/30">
          
          {/* Decorative Background Icons (Watermarks) */}
          <Sun className="absolute top-10 right-10 w-32 h-32 text-yellow-100 -z-10 rotate-12 opacity-50" />
          <Palmtree className="absolute bottom-40 left-10 w-40 h-40 text-emerald-50 -z-10 -rotate-12 opacity-50" />
          <MapPin className="absolute top-1/2 right-20 w-48 h-48 text-pink-50 -z-10 rotate-45 opacity-50" />

          {/* Header */}
          <div className="flex justify-between items-start mb-6 z-10">
            <div className="w-48 bg-white p-3 rounded-2xl shadow-sm border border-sky-100 rotate-[-2deg]">
              {settings?.logo_image_path ? (
                <img src={settings.logo_image_path} alt="Logo" className="max-w-full h-auto max-h-20 mx-auto" />
              ) : (
                <div className="text-3xl font-black text-red-600 tracking-tighter text-center">MM<span className="text-black">HOLIDAY</span></div>
              )}
            </div>
            <div className="text-right text-sky-900 font-mali">
              <h1 className="font-bold text-xl uppercase mb-1">{settings?.company_name || 'MM HOLIDAYS CO.,LTD.'}</h1>
              <p className="text-sm">{settings?.company_address}</p>
              <p className="text-sm">Tel: {settings?.company_tel}</p>
              <p className="text-sm">Email: {settings?.company_email}</p>
              <p className="text-sm">TAT License: {settings?.tat_license}</p>
            </div>
          </div>

          <div className="text-center mb-6 relative z-10">
            <h2 className="text-5xl font-black text-sky-500 font-mali tracking-widest uppercase drop-shadow-sm flex justify-center items-center gap-3">
              <Palmtree className="w-10 h-10 text-emerald-400" />
              VOUCHER
              <Sun className="w-10 h-10 text-yellow-400" />
            </h2>
            <p className="font-mali text-pink-500 font-bold mt-1 text-lg flex justify-center items-center gap-2">
              <Smile className="w-5 h-5" /> Have a wonderful trip! <Heart className="w-5 h-5" />
            </p>
          </div>

          {/* Guest Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 z-10">
            <div className="bg-white p-4 rounded-2xl border-2 border-sky-200 shadow-sm flex items-center gap-3">
              <div className="bg-sky-100 p-3 rounded-full text-sky-500"><User className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Guest Name</p>
                <p className="font-mali text-xl font-bold text-sky-900 uppercase">{voucher.voucher_guest_name}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-sm flex items-center gap-3">
              <div className="bg-pink-100 p-3 rounded-full text-pink-500"><Ticket className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Voucher No.</p>
                <p className="font-mali text-xl font-bold text-pink-600">{voucher.voucher_no}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-sm flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-500"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Total PAX</p>
                <p className="font-mali text-lg font-bold text-emerald-800">{paxString}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-full text-amber-500"><Calendar className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Issue Date</p>
                <p className="font-mali text-lg font-bold text-amber-800">{voucher.voucher_issue_date ? format(new Date(voucher.voucher_issue_date), 'dd MMM yyyy') : '-'}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Details based on Type */}
          <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-sm mb-6 z-10 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 bg-purple-100 w-24 h-24 rounded-full opacity-50"></div>
            
            <h3 className="font-mali font-bold text-2xl mb-4 text-purple-800 border-b-2 border-purple-100 pb-2 flex items-center">
              {getVoucherIcon()}
              {voucher.voucher_type} DETAILS
            </h3>
            
            <div className="font-mali text-gray-700 text-lg">
              {voucher.voucher_type === 'HOTEL' && (
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Hotel Name</span> <span className="font-bold text-purple-900">{voucher.hotel?.location_name || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Address</span> <span>{voucher.hotel?.location_address || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Check In</span> <span className="text-green-600 font-bold">{voucher.check_in_date ? format(new Date(voucher.check_in_date), 'dd MMM yyyy') : '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Check Out</span> <span className="text-red-500 font-bold">{voucher.check_out_date ? format(new Date(voucher.check_out_date), 'dd MMM yyyy') : '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Room Type</span> <span>{voucher.room_type || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">No. of Rooms</span> <span>{voucher.number_of_rooms || '-'} Room(s)</span></div>
                  <div className="flex flex-col col-span-2 bg-purple-50 p-3 rounded-xl border border-purple-100"><span className="text-xs text-purple-400 uppercase font-sans font-bold mb-1"><CheckCircle2 className="w-3 h-3 inline" /> Inclusions</span> <span>{voucher.hotel_inclusion || '-'}</span></div>
                </div>
              )}

              {voucher.voucher_type === 'TOUR' && (
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Tour Name</span> <span className="font-bold text-purple-900">{voucher.tour?.location_name || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Tour Date</span> <span className="text-green-600 font-bold">{voucher.tour_date ? format(new Date(voucher.tour_date), 'dd MMM yyyy') : '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Pick-up Time</span> <span className="text-orange-500 font-bold">{voucher.pickup_time || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Pick-up Hotel</span> <span>{voucher.pickup_hotel?.location_name || '-'}</span></div>
                  <div className="flex flex-col col-span-2 bg-purple-50 p-3 rounded-xl border border-purple-100"><span className="text-xs text-purple-400 uppercase font-sans font-bold mb-1"><CheckCircle2 className="w-3 h-3 inline" /> Inclusions</span> <span>{voucher.tour_inclusion || '-'}</span></div>
                </div>
              )}

              {voucher.voucher_type === 'TRANSPORT' && (
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Pick-up Date</span> <span className="text-green-600 font-bold">{voucher.pickup_date ? format(new Date(voucher.pickup_date), 'dd MMM yyyy') : '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Pick-up Time</span> <span className="text-orange-500 font-bold">{voucher.pickup_time || '-'}</span></div>
                  <div className="flex flex-col col-span-2"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Route</span> <span className="font-bold text-purple-900"><Navigation className="w-4 h-4 inline mr-1 text-purple-400"/> {voucher.transport_route || '-'}</span></div>
                  <div className="flex flex-col col-span-2"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Vehicle Type</span> <span>{voucher.vehicle_type || '-'}</span></div>
                </div>
              )}
              
              {voucher.voucher_type === 'ATTRACTION' && (
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Attraction</span> <span className="font-bold text-purple-900">{voucher.attraction?.location_name || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-gray-400 uppercase font-sans font-bold">Visit Date</span> <span className="text-green-600 font-bold">{voucher.visit_date ? format(new Date(voucher.visit_date), 'dd MMM yyyy') : '-'}</span></div>
                  <div className="flex flex-col col-span-2 bg-purple-50 p-3 rounded-xl border border-purple-100"><span className="text-xs text-purple-400 uppercase font-sans font-bold mb-1"><CheckCircle2 className="w-3 h-3 inline" /> Inclusions</span> <span>{voucher.attraction_inclusion || '-'}</span></div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 bg-yellow-50/80 p-4 rounded-2xl border border-yellow-200 z-10 flex gap-3 items-start">
            <span className="bg-yellow-200 p-2 rounded-full text-yellow-700 shrink-0"><Smile className="w-5 h-5" /></span>
            <div>
              <span className="font-bold text-xs uppercase text-yellow-800">Special Request / Remark:</span>
              <p className="font-mali text-yellow-900 mt-1">{voucher.voucher_remark || 'No special requests. Have a great time!'}</p>
            </div>
          </div>

          {/* Footer Area */}
          <div className="mt-auto flex justify-between items-end z-10 pt-4">
            
            <div className="w-3/5 text-sm bg-red-50 p-4 rounded-2xl border-2 border-red-200 text-red-900 font-mali relative">
              <div className="absolute -top-3 -left-3 bg-red-500 text-white font-sans text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Important Note</div>
              <div className="font-bold mb-1">{settings?.condition_booking || 'NON REFUNDABLE'}</div>
              <div className="whitespace-pre-wrap leading-tight text-red-800/90">{getConditionText()}</div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="bg-white p-3 rounded-2xl shadow-sm border-2 border-gray-200 rotate-3 transition-transform">
                {settings?.qr_code_path ? (
                  <img src={settings.qr_code_path} alt="QR" className="w-24 h-24" />
                ) : (
                  <QRCodeSVG value={publicUrl} size={96} fgColor="#0c4a6e" />
                )}
              </div>
              <p className="font-mali font-bold text-sky-800 text-sm bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
                Scan for E-Voucher!
              </p>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};
