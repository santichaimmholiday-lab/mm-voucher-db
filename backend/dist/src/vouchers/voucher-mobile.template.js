"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMobileVoucherHtml = void 0;
const formatDate = (dateStr) => {
    if (!dateStr)
        return '-';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};
const generateMobileVoucherHtml = (voucher, settings, qrCodeBase64) => {
    const issueDate = formatDate(voucher.voucher_issue_date);
    const finalQrCode = settings.qr_code_path || qrCodeBase64;
    const finalLogo = settings.logo_image_path || null;
    let paxString = [];
    if (voucher.pax_adult > 0)
        paxString.push(`${voucher.pax_adult} Adult`);
    if (voucher.pax_child > 0)
        paxString.push(`${voucher.pax_child} Chd-(${voucher.child_age || '-'})`);
    if (voucher.pax_infant > 0)
        paxString.push(`${voucher.pax_infant} Infant`);
    const totalPax = paxString.join(' | ') || '-';
    let conditionText = '';
    if (voucher.voucher_type === 'HOTEL' && settings.condition_hotel) {
        conditionText = settings.condition_hotel;
    }
    else if (voucher.voucher_type === 'SHARING TOUR' && settings.condition_tour) {
        conditionText = settings.condition_tour;
    }
    const displayCondition = conditionText.replace(/\n/g, '<br/>');
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Service Voucher</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: 'Inter', sans-serif; 
          background-color: #f3f4f6; 
          color: #1f2937; 
          line-height: 1.5; 
          padding: 16px; 
        }
        .card {
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: #1e3a8a; /* blue-900 */
          color: #ffffff;
          padding: 20px;
          text-align: center;
          position: relative;
        }
        .header-logo {
          background-color: white;
          padding: 8px;
       border-radius: 8px;
          display: inline-block;
          margin-bottom: 12px;
        }
        .header h1 { font-size: 20px; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
        .header p { font-size: 14px; opacity: 0.9; }
        
        .section {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .section:last-child { border-bottom: none; }
        
        .section-title {
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 700;
          color: #6b7280;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }
        
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        
        .item { margin-bottom: 12px; }
        .item:last-child { margin-bottom: 0; }
        .item-label { font-size: 12px; color: #6b7280; margin-bottom: 2px; }
        .item-value { font-size: 15px; font-weight: 600; color: #111827; }
        
        .badge {
          display: inline-block;
          padding: 4px 10px;
          background-color: #dbeafe;
          color: #1e40af;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .highlight-box {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }
        
        .qr-section {
          text-align: center;
          padding: 24px;
          background-color: #f8fafc;
        }
        .qr-code {
          width: 120px;
          height: 120px;
          margin: 0 auto 12px auto;
          background-color: white;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .qr-code img { width: 100%; height: 100%; object-fit: contain; }
        
        .conditions {
          font-size: 12px;
          color: #4b5563;
          background-color: #fef2f2;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }
        .conditions strong { color: #991b1b; }
        
        .footer {
          text-align: center;
          padding: 24px 20px;
          font-size: 13px;
          color: #6b7280;
        }
        .footer-logo { font-weight: 700; color: #1f2937; margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          ${finalLogo ? `<div class="header-logo"><img src="${finalLogo}" alt="Logo" style="height: 40px; max-width: 100%;" /></div>` : ''}
          <h1>SERVICE VOUCHER</h1>
          <p>Voucher No: ${voucher.voucher_no || '-'}</p>
        </div>
        
        <div class="section">
          <div class="badge">${voucher.voucher_type || 'VOUCHER'}</div>
          
          <div class="item">
            <div class="item-label">Guest Name</div>
            <div class="item-value">${voucher.voucher_guest_name || '-'} ${voucher.voucher_company ? '(' + voucher.voucher_company + ')' : ''}</div>
          </div>
          
          <div class="grid" style="grid-template-columns: 1fr 1fr; margin-top: 12px;">
            <div class="item">
              <div class="item-label">Mobile</div>
              <div class="item-value">${voucher.guest_mobile || '-'}</div>
            </div>
            <div class="item">
              <div class="item-label">PAX</div>
              <div class="item-value">${totalPax}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Service Details</div>
          
          ${voucher.voucher_type === 'HOTEL' ? `
            <div class="highlight-box">
              <div class="item">
                <div class="item-label">Hotel Name</div>
                <div class="item-value" style="font-size: 16px; color: #1e3a8a;">${voucher.hotel?.location_name || '-'}</div>
              </div>
              <div class="item" style="margin-top: 8px;">
                <div class="item-label">Address</div>
                <div class="item-value" style="font-size: 13px; font-weight: 400;">${voucher.hotel?.location_address || '-'}</div>
              </div>
            </div>
            
            <div class="grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 12px;">
              <div class="item">
                <div class="item-label">Check in Date</div>
                <div class="item-value">${formatDate(voucher.check_in_date)}</div>
              </div>
              <div class="item">
                <div class="item-label">Check out Date</div>
                <div class="item-value">${formatDate(voucher.check_out_date)}</div>
              </div>
            </div>
            
            <div class="grid" style="grid-template-columns: 1fr 1fr 1fr; margin-bottom: 12px;">
              <div class="item">
                <div class="item-label">Nights</div>
                <div class="item-value">${voucher.nights || '-'}</div>
              </div>
              <div class="item">
                <div class="item-label">Rooms</div>
                <div class="item-value">${voucher.rooms || '-'}</div>
              </div>
              <div class="item">
                <div class="item-label">Breakfast</div>
                <div class="item-value">${voucher.breakfast || '-'}</div>
              </div>
            </div>
            
            <div class="item">
              <div class="item-label">Type of Room</div>
              <div class="item-value">${voucher.room_type || '-'}</div>
            </div>
          ` : ''}
          
          ${voucher.voucher_type === 'LOCAL ATTRACTION' ? `
            <div class="highlight-box">
              <div class="item">
                <div class="item-label">Attraction Name</div>
                <div class="item-value" style="font-size: 16px; color: #1e3a8a;">${voucher.attraction?.location_name || '-'}</div>
              </div>
            </div>
            <div class="grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 12px;">
              <div class="item">
                <div class="item-label">Date of Visit</div>
                <div class="item-value">${formatDate(voucher.visit_date)}</div>
              </div>
              <div class="item">
                <div class="item-label">Number of Person</div>
                <div class="item-value">${voucher.person_count || '-'}</div>
              </div>
            </div>
            <div class="item">
              <div class="item-label">Entrance Ticket</div>
              <div class="item-value">${voucher.entrance_ticket || '-'}</div>
            </div>
          ` : ''}
          
          ${voucher.voucher_type === 'SHARING TOUR' ? `
            <div class="highlight-box">
              <div class="item">
                <div class="item-label">Tour Name</div>
                <div class="item-value" style="font-size: 16px; color: #1e3a8a;">${voucher.tour?.location_name || '-'}</div>
              </div>
            </div>
            <div class="grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 12px;">
              <div class="item">
                <div class="item-label">Date of Visit</div>
                <div class="item-value">${formatDate(voucher.visit_date)}</div>
              </div>
              <div class="item">
                <div class="item-label">Pick Up Time</div>
                <div class="item-value">${voucher.pickup_time || '-'}</div>
              </div>
            </div>
            <div class="item" style="margin-bottom: 12px;">
              <div class="item-label">Hotel Name (Pickup)</div>
              <div class="item-value">${(voucher.pickup_location || voucher.pickup_hotel?.location_name) || '-'}</div>
            </div>
            <div class="item">
              <div class="item-label">Number of Person</div>
              <div class="item-value">${voucher.person_count || '-'}</div>
            </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 12px;">
            <div class="item">
              <div class="item-label">Confirmation Number</div>
              <div class="item-value">${voucher.conf_no || '-'}</div>
            </div>
            <div class="item">
              <div class="item-label">Payment by</div>
              <div class="item-value">${voucher.payment_by || '-'}</div>
            </div>
          </div>
          <div class="item">
            <div class="item-label">Remarks</div>
            <div class="item-value">${voucher.remarks || '-'}</div>
          </div>
        </div>

        ${displayCondition ? `
          <div class="section" style="padding-top: 0;">
            <div class="conditions">
              <strong>${settings.condition_booking || 'CONDITION OF BOOKING: NON-REFUNDABLE'}</strong><br/>
              ${displayCondition}
            </div>
          </div>
        ` : ''}

        <div class="qr-section">
          ${finalQrCode ? `<div class="qr-code"><img src="${finalQrCode}" alt="QR Code" /></div>` : ''}
          <div style="font-size: 12px; color: #6b7280;">Scan to verify</div>
        </div>
        
        <div class="footer">
          <div class="footer-logo">MM HOLIDAYS CO., LTD.</div>
          <div>Issue Date: ${issueDate}</div>
          <div style="margin-top: 8px; font-size: 11px;">
            Best wishes from our team.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.generateMobileVoucherHtml = generateMobileVoucherHtml;
//# sourceMappingURL=voucher-mobile.template.js.map