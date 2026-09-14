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
const Icons = {
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    ticket: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    details: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
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
    const totalPax = paxString.join(' / ') || '-';
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
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: 'Fredoka', sans-serif; 
          background-color: #f0fdfa; /* light teal background outside */
          color: #334155;
          line-height: 1.5;
          padding: 16px;
        }
        
        .dashed-container { 
          border: 3px dashed #38bdf8; 
          border-radius: 28px; 
          padding: 24px 16px; 
          margin: 0 auto; 
          max-width: 600px; 
          background: #ffffff; 
        }

        .header-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .logo-img {
          height: 50px;
          max-width: 100%;
          border-radius: 12px;
        }
        .company-info {
          font-size: 11px;
          color: #0284c7;
          font-weight: 500;
        }
        .company-title {
          font-size: 14px;
          font-weight: 700;
          color: #0369a1;
          margin-bottom: 2px;
        }

        .title-row {
          text-align: center;
          margin: 24px 0;
        }
        .title-row h1 {
          color: #0ea5e9;
          font-size: 26px;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .title-row p {
          color: #ec4899;
          font-size: 13px;
          font-weight: 500;
          margin-top: 4px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (min-width: 480px) {
          .info-grid { grid-template-columns: 1fr 1fr; }
        }
        
        .info-card {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 16px;
          border: 2px solid;
          gap: 14px;
        }
        .info-card.blue { border-color: #bae6fd; }
        .info-card.pink { border-color: #fbcfe8; }
        .info-card.green { border-color: #bbf7d0; }
        .info-card.yellow { border-color: #fef08a; }

        .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .info-card.blue .info-icon { background: #e0f2fe; color: #0284c7; }
        .info-card.pink .info-icon { background: #fce7f3; color: #db2777; }
        .info-card.green .info-icon { background: #dcfce7; color: #16a34a; }
        .info-card.yellow .info-icon { background: #fef9c3; color: #ca8a04; }
        
        .info-text { flex: 1; }
        .info-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.8;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .info-val {
          font-size: 14px;
          font-weight: 600;
        }
        
        .info-card.blue .info-text { color: #0369a1; }
        .info-card.pink .info-text { color: #be185d; }
        .info-card.green .info-text { color: #15803d; }
        .info-card.yellow .info-text { color: #a16207; }

        .details-box {
          border: 2px solid #e9d5ff;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .details-title {
          color: #9333ea;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .d-item { display: flex; flex-direction: column; }
        .d-item.full { grid-column: 1 / -1; }
        
        .d-label {
          font-size: 10px;
          color: #a855f7;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .d-val {
          font-size: 14px;
          color: #4c1d95;
          font-weight: 600;
        }

        .d-highlight {
          background: #f3e8ff;
          padding: 16px;
          border-radius: 16px;
          margin-top: 20px;
          color: #6b21a8;
        }
        .d-highlight-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 6px;
          color: #9333ea;
        }

        .qr-section {
          text-align: center;
          padding: 20px;
          background: #f8fafc;
          border-radius: 16px;
          border: 2px dashed #cbd5e1;
          margin-bottom: 16px;
        }
        .qr-code {
          width: 120px;
          height: 120px;
          margin: 0 auto 8px auto;
          background: white;
          padding: 8px;
          border-radius: 12px;
        }
        .qr-code img { width: 100%; height: 100%; object-fit: contain; }
        
        .conditions {
          font-size: 12px;
          color: #be123c;
          background-color: #fff1f2;
          padding: 16px;
          border-radius: 16px;
          border: 2px dashed #fecdd3;
          margin-bottom: 16px;
        }
      </style>
    </head>
    <body>
      <div class="dashed-container">
        <div class="header-top">
          ${finalLogo ? `<img class="logo-img" src="${finalLogo}" alt="Logo" />` : ''}
          <div class="company-info">
            <div class="company-title">MM HOLIDAYS CO., LTD.</div>
            <div>256/4 Silom Road, Suriyawong, Bangrak, Bangkok 10500 Thailand</div>
            <div>Tel: +662-635-6944-5 Mobile: +66 87-5178432 | Email: mmholidaysbkk@gmail.com</div>
            <div>TAT License: No.14/00733</div>
          </div>
        </div>
        
        <div class="title-row">
          <h1>🌴 VOUCHER ☀️</h1>
          <p>😊 Have a wonderful trip! 🤍</p>
        </div>

        <div class="info-grid">
          <div class="info-card blue">
            <div class="info-icon">${Icons.user}</div>
            <div class="info-text">
              <div class="info-label">Guest Name</div>
              <div class="info-val">${voucher.voucher_guest_name || '-'} ${voucher.guest_mobile ? '(' + voucher.guest_mobile + ')' : ''}</div>
            </div>
          </div>
          
          <div class="info-card pink">
            <div class="info-icon">${Icons.ticket}</div>
            <div class="info-text">
              <div class="info-label">Voucher No.</div>
              <div class="info-val">${voucher.voucher_no || '-'}</div>
            </div>
          </div>

          <div class="info-card green">
            <div class="info-icon">${Icons.users}</div>
            <div class="info-text">
              <div class="info-label">Total Pax</div>
              <div class="info-val">${totalPax}</div>
            </div>
          </div>

          <div class="info-card yellow">
            <div class="info-icon">${Icons.calendar}</div>
            <div class="info-text">
              <div class="info-label">Issue Date</div>
              <div class="info-val">${issueDate}</div>
            </div>
          </div>
        </div>

        <div class="details-box">
          <div class="details-title">
            ${Icons.details} ${voucher.voucher_type || 'SERVICE'} DETAILS
          </div>
          
          <div class="details-grid">
            ${voucher.voucher_type === 'HOTEL' ? `
              <div class="d-item full">
                <div class="d-label">Hotel Name</div>
                <div class="d-val" style="font-size: 16px;">${voucher.hotel?.location_name || '-'}</div>
              </div>
              <div class="d-item">
                <div class="d-label">Check in Date</div>
                <div class="d-val">${formatDate(voucher.check_in_date)}</div>
              </div>
              <div class="d-item">
                <div class="d-label">Check out Date</div>
                <div class="d-val">${formatDate(voucher.check_out_date)}</div>
              </div>
              <div class="d-item">
                <div class="d-label">Nights</div>
                <div class="d-val">${voucher.nights || '-'}</div>
              </div>
              <div class="d-item">
                <div class="d-label">Rooms</div>
                <div class="d-val">${voucher.rooms || '-'}</div>
              </div>
              <div class="d-item">
                <div class="d-label">Type of Room</div>
                <div class="d-val">${voucher.room_type || '-'}</div>
              </div>
              <div class="d-item">
                <div class="d-label">Breakfast</div>
                <div class="d-val">${voucher.breakfast || '-'}</div>
              </div>
            ` : ''}

            ${voucher.voucher_type === 'LOCAL ATTRACTION' ? `
              <div class="d-item full">
                <div class="d-label">Attraction</div>
                <div class="d-val" style="font-size: 16px;">${voucher.attraction?.location_name || '-'}</div>
              </div>
              <div class="d-item">
                <div class="d-label">Visit Date</div>
                <div class="d-val">${formatDate(voucher.visit_date)}</div>
              </div>
              <div class="d-item">
                <div class="d-label">No. of Persons</div>
                <div class="d-val">${voucher.person_count || '-'}</div>
              </div>
              <div class="d-item full">
                <div class="d-label">Entrance Ticket</div>
                <div class="d-val">${voucher.entrance_ticket || '-'}</div>
              </div>
            ` : ''}

            ${voucher.voucher_type === 'SHARING TOUR' ? `
              <div class="d-item full">
                <div class="d-label">Tour Name</div>
                <div class="d-val" style="font-size: 16px;">${voucher.tour?.location_name || '-'}</div>
              </div>
              <div class="d-item">
                <div class="d-label">Visit Date</div>
                <div class="d-val">${formatDate(voucher.visit_date)}</div>
              </div>
              <div class="d-item">
                <div class="d-label">Pick Up Time</div>
                <div class="d-val">${voucher.pickup_time || '-'}</div>
              </div>
              <div class="d-item full">
                <div class="d-label">Hotel Name (Pickup)</div>
                <div class="d-val">${(voucher.pickup_location || voucher.pickup_hotel?.location_name) || '-'}</div>
              </div>
              <div class="d-item">
                <div class="d-label">No. of Persons</div>
                <div class="d-val">${voucher.person_count || '-'}</div>
              </div>
            ` : ''}
            
            <div class="d-item full" style="margin-top: 8px;">
              <div class="d-label">Confirmation Number</div>
              <div class="d-val">${voucher.conf_no || '-'}</div>
            </div>
            
            <div class="d-item">
              <div class="d-label">Confirmation By</div>
              <div class="d-val">${voucher.voucher_company || '-'}</div>
            </div>
            <div class="d-item">
              <div class="d-label">Payment By</div>
              <div class="d-val">${voucher.payment_by || '-'}</div>
            </div>
          </div>
          
          <div class="d-highlight">
            <div class="d-highlight-label">${Icons.check} Inclusions / Remarks</div>
            <div style="font-size: 13px; font-weight: 500;">
              ${voucher.remarks || '-'}
            </div>
          </div>
        </div>

        ${displayCondition ? `
          <div class="conditions">
            <div style="font-weight: 700; margin-bottom: 4px;">${settings.condition_booking || 'CONDITION OF BOOKING: NON-REFUNDABLE'}</div>
            ${displayCondition}
          </div>
        ` : ''}

        ${finalQrCode ? `
          <div class="qr-section">
            <div class="qr-code"><img src="${finalQrCode}" alt="QR Code" /></div>
            <div style="font-size: 12px; color: #64748b; font-weight: 600;">Scan to verify</div>
          </div>
        ` : ''}
        
      </div>
    </body>
    </html>
  `;
};
exports.generateMobileVoucherHtml = generateMobileVoucherHtml;
//# sourceMappingURL=voucher-mobile.template.js.map