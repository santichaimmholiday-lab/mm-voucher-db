const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear(); // Always Gregorian
  return `${day}/${month}/${year}`;
};

export const generateVoucherHtml = (voucher: any, settings: any, generatedQrCodeBase64: string): string => {
  const issueDate = formatDate(voucher.voucher_issue_date);

  // Decide which QR Code to show (Uploaded vs Auto-generated public URL)
  const finalQrCode = settings.qr_code_path ? `http://localhost:3000${settings.qr_code_path}` : generatedQrCodeBase64;
  const finalLogo = settings.logo_image_path ? `http://localhost:3000${settings.logo_image_path}` : null;

  // Construct Guest PAX
  let paxString: string[] = [];
  if (voucher.pax_adult > 0) paxString.push(`${voucher.pax_adult} Adult`);
  if (voucher.pax_child > 0) paxString.push(`${voucher.pax_child} Chd-(${voucher.child_age || '-'})`);
  if (voucher.pax_infant > 0) paxString.push(`${voucher.pax_infant} Infant`);

  // Build the dynamic body (Section 4)
  let dynamicBody = '';
  if (voucher.voucher_type === 'HOTEL') {
    dynamicBody = `
      <table class="detail-table">
        <tr>
          <td class="label">Hotel Name :</td><td class="value">${voucher.hotel?.location_name || '-'}</td>
          <td class="label">Address :</td><td class="value">${voucher.hotel?.location_address || '-'}</td>
        </tr>
        <tr>
          <td class="label">Check in Date :</td><td class="value">${formatDate(voucher.check_in_date)}</td>
          <td class="label">Check out Date :</td><td class="value">${formatDate(voucher.check_out_date)}</td>
        </tr>
        <tr>
          <td class="label">Number of Nights :</td><td class="value">${voucher.nights || '-'}</td>
          <td class="label">Number of Rooms :</td><td class="value">${voucher.rooms || '-'}</td>
        </tr>
        <tr>
          <td class="label">Type of Room :</td><td class="value">${voucher.room_type || '-'}</td>
          <td class="label">Confirmation Number :</td><td class="value">${voucher.conf_no || '-'}</td>
        </tr>
        <tr>
          <td class="label">Payment by :</td><td class="value">${voucher.payment_by || '-'}</td>
          <td class="label">Confirmation by :</td><td class="value">${voucher.conf_by || '-'}</td>
        </tr>
        <tr>
          <td class="label">Remarks :</td><td class="value" colspan="3">${voucher.remarks || '-'}</td>
        </tr>
      </table>
    `;
  } else if (voucher.voucher_type === 'LOCAL ATTRACTION') {
    dynamicBody = `
      <table class="detail-table">
        <tr>
          <td class="label">Attraction Name :</td><td class="value">${voucher.attraction?.location_name || '-'}</td>
          <td class="label">Date of Visit :</td><td class="value">${formatDate(voucher.visit_date)}</td>
        </tr>
        <tr>
          <td class="label">Number of Person :</td><td class="value">${voucher.person_count || '-'}</td>
          <td class="label">Entrance Ticket :</td><td class="value">${voucher.entrance_ticket || '-'}</td>
        </tr>
        <tr>
          <td class="label">Confirmation Number :</td><td class="value">${voucher.conf_no || '-'}</td>
          <td class="label">Payment by :</td><td class="value">${voucher.payment_by || '-'}</td>
        </tr>
        <tr>
          <td class="label">Confirmation by :</td><td class="value">${voucher.conf_by || '-'}</td>
          <td class="label">Remarks :</td><td class="value">${voucher.remarks || '-'}</td>
        </tr>
      </table>
    `;
  } else if (voucher.voucher_type === 'SHARING TOUR') {
    dynamicBody = `
      <table class="detail-table">
        <tr>
          <td class="label">Tour Name :</td><td class="value">${voucher.tour?.location_name || '-'}</td>
          <td class="label">Date of Visit :</td><td class="value">${formatDate(voucher.visit_date)}</td>
        </tr>
        <tr>
          <td class="label">Number of Person :</td><td class="value">${voucher.person_count || '-'}</td>
          <td class="label">Pick Up Time :</td><td class="value">${voucher.pickup_time || '-'}</td>
        </tr>
        <tr>
          <td class="label">Hotel Name (Pickup):</td><td class="value">${voucher.pickup_hotel?.location_name || '-'}</td>
          <td class="label">Confirmation Number :</td><td class="value">${voucher.conf_no || '-'}</td>
        </tr>
        <tr>
          <td class="label">Payment by :</td><td class="value">${voucher.payment_by || '-'}</td>
          <td class="label">Confirmation by :</td><td class="value">${voucher.conf_by || '-'}</td>
        </tr>
        <tr>
          <td class="label">Remarks :</td><td class="value" colspan="3">${voucher.remarks || '-'}</td>
        </tr>
      </table>
    `;
  }

  const a5Content = `
        <!-- Section 1: Header -->
        <div class="header">
          <div class="logo-section">
            ${finalLogo 
              ? `<img src="${finalLogo}" alt="Logo" />`
              : `<h1 style="color:#d00; margin:0; font-size:28px; font-style:italic;">MM</h1><div style="font-size:9px; font-weight:bold;">HOLIDAYS CO.,LTD.</div>`
            }
          </div>
          <div class="company-info">
            <div class="company-name">${settings.company_name || 'MM HOLIDAYS CO., LTD.'}</div>
            <div class="company-name-th">${settings.company_name_th || ''}</div>
            <div>${settings.company_address || ''}</div>
            <div>Tel: ${settings.company_tel || ''} | Web: ${settings.company_web || ''}</div>
            <div>Email: ${settings.company_email || ''}</div>
            <div>${settings.tat_license || ''}</div>
          </div>
          <div class="qr-section">
            <img src="${finalQrCode}" alt="QR Code" />
          </div>
        </div>

        <!-- Section 2: Title -->
        <div class="title-section">
          <div style="flex:1">VOUCHER NO : <strong>${voucher.voucher_no}</strong></div>
          <div class="title-text">SERVICE VOUCHER</div>
          <div style="flex:1; text-align:right;">Date of issue : <strong>${issueDate}</strong></div>
        </div>

        <!-- Section 3 & 4: Guest and Dynamic Content -->
        <div class="content-wrapper">
          <div class="content-title">Guest Detail</div>
          <div class="guest-row">
            <div class="guest-col"><strong>GUEST NAME :</strong> ${voucher.voucher_guest_name}</div>
            <div class="guest-col"><strong>MOBILE :</strong> ${voucher.guest_mobile || '-'}</div>
            <div class="guest-col"><strong>PAX :</strong> ${paxString.join(' | ') || '-'}</div>
          </div>
          ${dynamicBody}
        </div>

        <!-- Section 5: Conditions -->
        <div class="conditions-section">
          <strong>${settings.condition_booking || 'CONDITION OF BOOKING: NON-REFUNDABLE'}</strong><br/>
          
          ${voucher.voucher_type === 'HOTEL' && settings.condition_hotel ? `
            <br/><strong>*Hotel Remarks*</strong><br/>
            ${settings.condition_hotel.replace(/\n/g, '<br/>')}
          ` : ''}

          ${voucher.voucher_type === 'SHARING TOUR' && settings.condition_tour ? `
            <br/><strong>*Important Note*: Sharing Tour:</strong><br/>
            ${settings.condition_tour.replace(/\n/g, '<br/>')}
          ` : ''}
        </div>

        <div class="footer-wishes">
          BEST WISHES FROM MM HOLIDAYS
        </div>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet">
      <style>
        @page { size: A4 portrait; margin: 0; }
        body {
          margin: 0; padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          width: 210mm; height: 297mm; position: relative; background: white;
        }
        .a5-container {
          width: 210mm; height: 148.5mm; /* Exactly half of A4 */
          box-sizing: border-box; padding: 10mm 15mm; position: relative;
        }
        .a5-container.top-half { border-bottom: 1px dashed #ccc; }
        /* Header Section */
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .logo-section { flex: 0 0 25%; }
        .logo-section img { width: 100%; max-width: 150px; object-fit: contain; }
        .company-info { flex: 1; padding-left: 15px; font-size: 10px; line-height: 1.3; }
        .company-name { color: #000080; font-size: 14px; font-weight: bold; margin-bottom: 2px; }
        .company-name-th { color: #000080; font-size: 11px; font-weight: bold; margin-bottom: 5px; }
        .qr-section { flex: 0 0 15%; text-align: right; }
        .qr-section img { width: 70px; height: 70px; }
        
        /* Title Section */
        .title-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 12px; }
        .title-text { 
          text-align: center; flex: 1; 
          font-family: 'Caveat', cursive; 
          font-size: 32px; font-weight: bold; letter-spacing: 2px;
          line-height: 1;
        }
        
        /* Guest & Dynamic Body */
        .content-wrapper { border: 1px solid #999; border-radius: 8px; padding: 10px; margin-bottom: 10px; position: relative; }
        .content-title { color: #000080; font-weight: bold; font-size: 14px; position: absolute; top: -10px; left: 15px; background: white; padding: 0 5px; }
        
        .guest-row { display: flex; font-size: 11px; margin-bottom: 10px; border-bottom: 1px dotted #eee; padding-bottom: 5px; }
        .guest-col { flex: 1; }
        
        .detail-table { width: 100%; font-size: 11px; border-collapse: collapse; }
        .detail-table td { padding: 4px 0; vertical-align: top; }
        .detail-table .label { width: 18%; font-weight: 600; color: #444; }
        .detail-table .value { width: 32%; }

        /* Conditions Section */
        .conditions-section { font-size: 9px; line-height: 1.2; margin-bottom: 10px; }
        .conditions-section strong { font-size: 10px; color: #000; }
        
        /* Footer */
        .footer-wishes { text-align: center; font-weight: bold; font-size: 12px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="a5-container top-half">
        ${a5Content}
      </div>
      <div class="a5-container">
        ${a5Content}
      </div>
    </body>
    </html>
  `;
};
