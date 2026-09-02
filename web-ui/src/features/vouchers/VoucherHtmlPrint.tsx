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
    if (voucher.voucher_type === 'TOUR' || voucher.voucher_type === 'SHARING TOUR') return settings?.condition_tour;
    return '';
  };

  const getVoucherIcon = () => {
    if (voucher.voucher_type === 'HOTEL') return <Hotel className="w-8 h-8 text-pink-500 inline-block mr-2" />;
    if (voucher.voucher_type === 'TOUR' || voucher.voucher_type === 'SHARING TOUR') return <MapPin className="w-8 h-8 text-green-500 inline-block mr-2" />;
    if (voucher.voucher_type === 'TRANSPORT') return <Car className="w-8 h-8 text-blue-500 inline-block mr-2" />;
    return <Ticket className="w-8 h-8 text-purple-500 inline-block mr-2" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white font-sans p-4 print:p-0 print:overflow-hidden print:h-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Mali:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          .font-mali { font-family: 'Mali', cursive; }
          @media print {
            @page { size: A4 portrait; margin: 0 !important; }
            html, body { 
              margin: 0 !important; 
              padding: 0 !important;
              background-color: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            body * {
              visibility: hidden;
            }
            .print-page-wrapper, .print-page-wrapper * {
              visibility: visible;
            }
            .print-page-wrapper {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm !important;
              height: 296.5mm !important; /* Slightly less than 297 to avoid blank page */
              margin: 0 !important;
              padding: 0 !important;
              page-break-after: avoid;
              page-break-inside: avoid;
              box-sizing: border-box;
              border: none !important;
              box-shadow: none !important;
              overflow: hidden !important;
            }
          }
        `}
      </style>

      {/* Back Button / Print Controls - Hidden in Print */}
      <div className="max-w-[210mm] mx-auto mb-4 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center text-sky-600 hover:text-sky-800 bg-white px-4 py-2 rounded-xl shadow-sm border border-sky-100 font-mali font-bold">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>
        
        <button onClick={() => window.print()} className="flex items-center bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl shadow-sm border border-pink-600 font-mali font-bold text-lg animate-bounce">
          <Printer className="w-5 h-5 mr-2" /> Print Cute Voucher
        </button>
      </div>

      {/* A4 Page Container */}
      <div className="relative w-[210mm] h-[297mm] mx-auto bg-white overflow-hidden shadow-xl p-6 print:p-4 print-page-wrapper box-border">
        
        {/* Ticket-style inner dashed border */}
        <div className="relative border-4 border-dashed border-sky-300 rounded-3xl h-full p-4 print:p-3 flex flex-col bg-sky-50/30 overflow-hidden box-border">
          
          {/* Decorative Background Icons (Watermarks) */}
          <Sun className="absolute top-10 right-10 w-24 h-24 text-yellow-100 -z-10 rotate-12 opacity-50" />
          <Palmtree className="absolute bottom-40 left-10 w-32 h-32 text-emerald-50 -z-10 -rotate-12 opacity-50" />
          <MapPin className="absolute top-1/2 right-20 w-32 h-32 text-pink-50 -z-10 rotate-45 opacity-50" />

          {/* Header */}
          <div className="flex justify-between items-start mb-2 z-10">
            <div className="w-40 bg-white p-2 rounded-xl shadow-sm border border-sky-100 rotate-[-2deg]">
              {settings?.logo_image_path ? (
                <img src={settings.logo_image_path} alt="Logo" className="max-w-full h-auto max-h-16 mx-auto" />
              ) : (
                <div className="text-2xl font-black text-red-600 tracking-tighter text-center">MM<span className="text-black">HOLIDAY</span></div>
              )}
            </div>
            <div className="text-right text-sky-900 font-mali">
              <h1 className="font-bold text-lg uppercase mb-1">{settings?.company_name || 'MM HOLIDAYS CO.,LTD.'}</h1>
              <p className="text-xs">{settings?.company_address}</p>
              <p className="text-xs">Tel: {settings?.company_tel} | Email: {settings?.company_email}</p>
              <p className="text-xs">TAT License: {settings?.tat_license}</p>
            </div>
          </div>

          <div className="text-center mb-2 relative z-10">
            <h2 className="text-3xl font-black text-sky-500 font-mali tracking-widest uppercase drop-shadow-sm flex justify-center items-center gap-2">
              <Palmtree className="w-8 h-8 text-emerald-400" />
              VOUCHER
              <Sun className="w-8 h-8 text-yellow-400" />
            </h2>
            <p className="font-mali text-pink-500 font-bold mt-1 text-sm flex justify-center items-center gap-1">
              <Smile className="w-4 h-4" /> Have a wonderful trip! <Heart className="w-4 h-4" />
            </p>
          </div>

          {/* Guest Info Grid */}
          <div className="grid grid-cols-2 gap-2 mb-2 z-10">
            <div className="bg-white p-3 rounded-xl border-2 border-sky-200 shadow-sm flex items-center gap-2">
              <div className="bg-sky-100 p-2 rounded-full text-sky-500"><User className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold leading-none">Guest Name</p>
                <p className="font-mali text-base font-bold text-sky-900 uppercase leading-tight mt-1">
                  {voucher.voucher_guest_name}
                  {voucher.guest_mobile && <span className="text-xs ml-1 text-sky-600">({voucher.guest_mobile})</span>}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-xl border-2 border-pink-200 shadow-sm flex items-center gap-2">
              <div className="bg-pink-100 p-2 rounded-full text-pink-500"><Ticket className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold leading-none">Voucher No.</p>
                <p className="font-mali text-base font-bold text-pink-600 leading-tight mt-1">{voucher.voucher_no}</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border-2 border-emerald-200 shadow-sm flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-500"><Users className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold leading-none">Total PAX</p>
                <p className="font-mali text-sm font-bold text-emerald-800 leading-tight mt-1">{paxString}</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border-2 border-amber-200 shadow-sm flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-full text-amber-500"><Calendar className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold leading-none">Issue Date</p>
                <p className="font-mali text-sm font-bold text-amber-800 leading-tight mt-1">{voucher.voucher_issue_date ? format(new Date(voucher.voucher_issue_date), 'dd MMM yyyy') : '-'}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Details based on Type */}
          <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-sm mb-2 z-10 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 bg-purple-100 w-16 h-16 rounded-full opacity-50"></div>
            
            <h3 className="font-mali font-bold text-lg mb-2 text-purple-800 border-b border-purple-100 pb-1 flex items-center">
              {getVoucherIcon()}
              {voucher.voucher_type} DETAILS
            </h3>
            
            <div className="font-mali text-gray-700 text-sm">
              {voucher.voucher_type === 'HOTEL' && (
                <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Hotel Name</span> <span className="font-bold text-purple-900 leading-tight">{voucher.hotel?.location_name || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Address</span> <span className="text-purple-900 font-bold leading-tight">{voucher.hotel?.location_address || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Check-in Date</span> <span className="font-bold text-purple-900 leading-tight">{voucher.check_in_date ? format(new Date(voucher.check_in_date), 'dd/MM/yyyy') : '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Check-out Date</span> <span className="font-bold text-purple-900 leading-tight">{voucher.check_out_date ? format(new Date(voucher.check_out_date), 'dd/MM/yyyy') : '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Room Type</span> <span className="text-purple-900 font-bold leading-tight">{voucher.room_type || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">No. of Rooms</span> <span className="text-purple-900 font-bold leading-tight">{voucher.number_of_rooms || '-'} Room(s)</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Booking Conf No</span> <span className="text-purple-900 font-bold leading-tight">{voucher.conf_no || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Meal</span> <span className="text-purple-900 font-bold leading-tight">{voucher.meal || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Payment By</span> <span className="text-purple-900 font-bold leading-tight">{voucher.payment_by || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Confirmation By</span> <span className="text-purple-900 font-bold leading-tight">{voucher.conf_by || '-'}</span></div>
                  <div className="flex flex-col col-span-2 bg-purple-50 p-2 rounded-lg border border-purple-100 mt-1"><span className="text-[10px] text-purple-400 uppercase font-sans font-bold leading-none mb-1"><CheckCircle2 className="w-3 h-3 inline" /> Inclusions</span> <span className="text-purple-900 font-bold leading-tight">{voucher.hotel_inclusion || '-'}</span></div>
                </div>
              )}

              {(voucher.voucher_type === 'TOUR' || voucher.voucher_type === 'SHARING TOUR') && (
                <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Tour Name</span> <span className="font-bold text-purple-900 leading-tight">{voucher.tour?.location_name || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Tour Date</span> <span className="text-purple-900 font-bold leading-tight">{voucher.visit_date ? format(new Date(voucher.visit_date), 'dd/MM/yyyy') : '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Pick-up Time</span> <span className="text-purple-900 font-bold leading-tight">{voucher.pickup_time || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Pick-up Hotel</span> <span className="text-purple-900 font-bold leading-tight">{voucher.pickup_location || voucher.pickup_hotel?.location_name || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Confirmation Number</span> <span className="text-purple-900 font-bold leading-tight">{voucher.conf_no || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">No. of Person</span> <span className="text-purple-900 font-bold leading-tight">{voucher.person_count || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Payment By</span> <span className="text-purple-900 font-bold leading-tight">{voucher.payment_by || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Confirmation By</span> <span className="text-purple-900 font-bold leading-tight">{voucher.conf_by || '-'}</span></div>
                  <div className="flex flex-col col-span-2 bg-purple-50 p-2 rounded-lg border border-purple-100 mt-1"><span className="text-[10px] text-purple-400 uppercase font-sans font-bold leading-none mb-1"><CheckCircle2 className="w-3 h-3 inline" /> Inclusions</span> <span className="text-purple-900 font-bold leading-tight">{voucher.tour_inclusion || '-'}</span></div>
                </div>
              )}

              {voucher.voucher_type === 'TRANSPORT' && (
                <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Pick-up Date</span> <span className="text-purple-900 font-bold leading-tight">{voucher.pickup_date ? format(new Date(voucher.pickup_date), 'dd/MM/yyyy') : '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Pick-up Time</span> <span className="text-purple-900 font-bold leading-tight">{voucher.pickup_time || '-'}</span></div>
                  <div className="flex flex-col col-span-2"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Route</span> <span className="font-bold text-purple-900 leading-tight"><Navigation className="w-3 h-3 inline mr-1 text-purple-400"/> {voucher.transport_route || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Vehicle Type</span> <span className="text-purple-900 font-bold leading-tight">{voucher.vehicle_type || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Confirmation Number</span> <span className="text-purple-900 font-bold leading-tight">{voucher.conf_no || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Payment By</span> <span className="text-purple-900 font-bold leading-tight">{voucher.payment_by || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Confirmation By</span> <span className="text-purple-900 font-bold leading-tight">{voucher.conf_by || '-'}</span></div>
                </div>
              )}
              
              {(voucher.voucher_type === 'ATTRACTION' || voucher.voucher_type === 'LOCAL ATTRACTION') && (
                <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Attraction</span> <span className="font-bold text-purple-900 leading-tight">{voucher.attraction?.location_name || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Visit Date</span> <span className="text-purple-900 font-bold leading-tight">{voucher.visit_date ? format(new Date(voucher.visit_date), 'dd/MM/yyyy') : '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">No. of Persons</span> <span className="text-purple-900 font-bold leading-tight">{voucher.person_count || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Entrance Ticket</span> <span className="text-purple-900 font-bold leading-tight">{voucher.entrance_ticket || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Confirmation Number</span> <span className="text-purple-900 font-bold leading-tight">{voucher.conf_no || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Payment By</span> <span className="text-purple-900 font-bold leading-tight">{voucher.payment_by || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase font-sans font-bold leading-none mt-1">Confirmation By</span> <span className="text-purple-900 font-bold leading-tight">{voucher.conf_by || '-'}</span></div>
                  <div className="flex flex-col col-span-2 bg-purple-50 p-2 rounded-lg border border-purple-100 mt-1"><span className="text-[10px] text-purple-400 uppercase font-sans font-bold leading-none mb-1"><CheckCircle2 className="w-3 h-3 inline" /> Inclusions</span> <span className="text-purple-900 font-bold leading-tight">{voucher.attraction_inclusion || '-'}</span></div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-2 bg-yellow-50/80 p-3 rounded-2xl border border-yellow-200 z-10 flex gap-2 items-start">
            <span className="bg-yellow-200 p-1 rounded-full text-yellow-700 shrink-0"><Smile className="w-4 h-4" /></span>
            <div>
              <span className="font-bold text-[10px] uppercase text-yellow-800 leading-none">Special Request / Remark:</span>
              <p className="font-mali text-yellow-900 mt-1 text-xs leading-tight">{voucher.voucher_remark || 'No special requests. Have a great time!'}</p>
            </div>
          </div>

          {/* Footer Area */}
          <div className="mt-auto flex justify-between items-end z-10 pt-2">
            
            <div className="w-3/5 text-xs bg-red-50 p-3 rounded-xl border-2 border-red-200 text-red-900 font-mali relative">
              <div className="absolute -top-3 -left-3 bg-red-500 text-white font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Important Note</div>
              <div className="font-bold mb-1">{settings?.condition_booking || 'NON REFUNDABLE'}</div>
              <div className="whitespace-pre-wrap leading-tight text-[10px] text-red-800/90">{getConditionText()}</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="bg-white p-2 rounded-xl shadow-sm border-2 border-gray-200 rotate-3 transition-transform">
                {settings?.qr_code_path ? (
                  <img src={settings.qr_code_path} alt="QR" className="w-16 h-16" />
                ) : (
                  <QRCodeSVG value={publicUrl} size={64} fgColor="#0c4a6e" />
                )}
              </div>
              <p className="font-mali font-bold text-sky-800 text-[10px] bg-sky-100 px-2 py-1 rounded-full border border-sky-200">
                Scan for contact
              </p>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};

