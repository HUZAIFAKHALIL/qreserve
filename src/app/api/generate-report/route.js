// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// import { PrismaClient } from '@prisma/client';

// export async function generateSystemReport(userType) {
//   if (!userType || userType.toLowerCase() !== 'admin') {
//     throw new Error('Access Denied: Admin privileges required');
//   }

//   const prisma = new PrismaClient();
//   try {
//     const [services, users, discounts, completedReservations, payments] = await Promise.all([
//       prisma.service.findMany(),
//       prisma.user.findMany(),
//       prisma.loyaltyDiscount.findMany(),
//       prisma.completedReservation.findMany(),
//       prisma.payment.findMany()
//     ]);

//     const pdfDoc = await PDFDocument.create();
//     const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     const COLORS = {
//       BACKGROUND: rgb(0.95, 0.96, 0.98),
//       HEADER_BG: rgb(0.12, 0.46, 0.7),
//       HEADER_TEXT: rgb(1, 1, 1),
//       TEXT_DARK: rgb(0.2, 0.2, 0.2),
//       TEXT_LIGHT: rgb(0.5, 0.5, 0.5),
//       BORDER: rgb(0.8, 0.8, 0.8),
//       ACCENT: rgb(0.22, 0.66, 1)
//     };

//     function createReportPage() {
//       const page = pdfDoc.addPage([612, 792]);
//       const currentDate = new Date().toLocaleDateString();

//       page.drawRectangle({ x: 0, y: 0, width: 612, height: 792, color: COLORS.BACKGROUND });
//       page.drawRectangle({ x: 0, y: 742, width: 612, height: 50, color: COLORS.HEADER_BG });
      
//       page.drawText('Comprehensive System Report', {
//         x: 50, y: 760, size: 22, font: helveticaBold, color: COLORS.HEADER_TEXT
//       });
      
//       page.drawText(`Generated on: ${currentDate}`, {
//         x: 460, y: 760, size: 10, font: helveticaFont, color: COLORS.HEADER_TEXT
//       });
      
//       return { page, yPosition: 700 };
//     }

//     function renderSection({ page, yPosition, title, data }) {
//       page.drawRectangle({ x: 50, y: yPosition, width: 512, height: 30, color: COLORS.ACCENT, opacity: 0.2 });
//       page.drawText(title, { x: 60, y: yPosition + 10, size: 14, font: helveticaBold, color: COLORS.HEADER_BG });
//       yPosition -= 40;

//       if (!data || data.length === 0) {
//         page.drawText('No data available', {
//           x: 60, y: yPosition, size: 12, font: helveticaFont, color: COLORS.TEXT_LIGHT
//         });
//         return yPosition - 70;
//       }

//       const keys = Object.keys(data[0]).slice(0, 4);
//       page.drawRectangle({ x: 50, y: yPosition, width: 512, height: 25, color: rgb(0.96, 0.97, 0.99) });
//       keys.forEach((key, index) => {
//         page.drawText(key.toUpperCase(), {
//           x: 60 + index * 120, y: yPosition + 5, size: 11, font: helveticaBold, color: COLORS.TEXT_DARK
//         });
//       });
//       yPosition -= 25;

//       data.slice(0, 10).forEach((item, index) => {
//         if (index % 2 === 0) {
//           page.drawRectangle({ x: 50, y: yPosition, width: 512, height: 20, color: rgb(0.98, 0.98, 1), opacity: 0.5 });
//         }
//         keys.forEach((key, keyIndex) => {
//           page.drawText(String(item[key] ?? 'N/A'), {
//             x: 60 + keyIndex * 120, y: yPosition + 5, size: 10, font: helveticaFont, color: COLORS.TEXT_DARK
//           });
//         });
//         yPosition -= 20;
//       });
//       return yPosition - 30;
//     }

//     let { page, yPosition } = createReportPage();
//     const sections = [
//       { title: 'Services Overview', data: services },
//       { title: 'User Management', data: users },
//       { title: 'Loyalty Discounts', data: discounts },
//       { title: 'Completed Reservations', data: completedReservations },
//       { title: 'Payment Transactions', data: payments }
//     ];

//     sections.forEach(section => {
//       if (yPosition < 100) {
//         ({ page, yPosition } = createReportPage());
//       }
//       yPosition = renderSection({ page, yPosition, title: section.title, data: section.data });
//     });

//     const pageCount = pdfDoc.getPageCount();
//     for (let i = 0; i < pageCount; i++) {
//       pdfDoc.getPages()[i].drawText(`Page ${i + 1} of ${pageCount}`, {
//         x: 500, y: 50, size: 10, font: helveticaFont, color: COLORS.TEXT_LIGHT
//       });
//     }

//     return await pdfDoc.save();
//   } catch (error) {
//     console.error('System Report Generation Error:', error);
//     throw new Error('Failed to generate system report');
//   }
// }

// export async function POST(req) {
//   try {
//     const { userType } = await req.json();
//     const pdfBytes = await generateSystemReport(userType);
//     return new Response(Buffer.from(pdfBytes), {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': 'attachment; filename=system_comprehensive_report.pdf',
//       },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), { 
//       status: error.message.includes('Access Denied') ? 403 : 500 
//     });
//   }
// }


import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PrismaClient } from '@prisma/client';

export async function generateSystemReport(userType) {
  // Validate admin access
  if (!userType || userType.toLowerCase() !== 'admin') {
    throw new Error('Access Denied: Admin privileges required');
  }

  const prisma = new PrismaClient();
  try {
    // Explicitly define the models to include, excluding FlightService
    const modelsToFetch = [
      { name: 'ChatMessage', model: prisma.chatMessage },
      { name: 'Promotion', model: prisma.promotion },
      { name: 'LoyaltyDiscount', model: prisma.loyaltyDiscount },
      { name: 'SignupDiscount', model: prisma.signupDiscount },
      { name: 'User', model: prisma.user },
      { name: 'Service', model: prisma.service },
      { name: 'SalonService', model: prisma.salonService },
      { name: 'RestaurantService', model: prisma.restaurantService },
      { name: 'HotelService', model: prisma.hotelService },
      { name: 'CarService', model: prisma.carService },
      { name: 'GymService', model: prisma.gymService },
      { name: 'HallService', model: prisma.hallService },
      { name: 'ActivityService', model: prisma.activityService },
      { name: 'PlaygroundService', model: prisma.playgroundService },
      { name: 'Reservation', model: prisma.reservation },
      { name: 'ReservationItem', model: prisma.reservationItem },
      { name: 'PartnerRequest', model: prisma.partnerRequest },
      { name: 'CompletedReservation', model: prisma.completedReservation },
      { name: 'Payment', model: prisma.payment },
      { name: 'Review', model: prisma.review }
    ];

    // Fetch data for all models
    const modelData = await Promise.all(
      modelsToFetch.map(async ({ name, model }) => {
        try {
          const data = await model.findMany();
          return { name, data };
        } catch (error) {
          console.error(`Error fetching ${name}:`, error);
          return { name, data: [] };
        }
      })
    );

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Color palette for consistent styling
    const COLORS = {
      BACKGROUND: rgb(0.95, 0.96, 0.98),
      HEADER_BG: rgb(0.12, 0.46, 0.7),
      HEADER_TEXT: rgb(1, 1, 1),
      TEXT_DARK: rgb(0.2, 0.2, 0.2),
      TEXT_LIGHT: rgb(0.5, 0.5, 0.5),
      BORDER: rgb(0.8, 0.8, 0.8),
      ACCENT: rgb(0.22, 0.66, 1)
    };

    // Function to create a new report page
    function createReportPage() {
      const page = pdfDoc.addPage([612, 792]);
      const currentDate = new Date().toLocaleDateString();

      // Background and header
      page.drawRectangle({ x: 0, y: 0, width: 612, height: 792, color: COLORS.BACKGROUND });
      page.drawRectangle({ x: 0, y: 742, width: 612, height: 50, color: COLORS.HEADER_BG });
      
      // Title and date
      page.drawText('Comprehensive System Report', {
        x: 50, y: 760, size: 22, font: helveticaBold, color: COLORS.HEADER_TEXT
      });
      
      page.drawText(`Generated on: ${currentDate}`, {
        x: 460, y: 760, size: 10, font: helveticaFont, color: COLORS.HEADER_TEXT
      });
      
      return { page, yPosition: 700 };
    }

    // Function to render a section of the report
    function renderSection({ page, yPosition, title, data }) {
      // Section header
      page.drawRectangle({ x: 50, y: yPosition, width: 512, height: 30, color: COLORS.ACCENT, opacity: 0.2 });
      page.drawText(title, { x: 60, y: yPosition + 10, size: 14, font: helveticaBold, color: COLORS.HEADER_BG });
      yPosition -= 40;

      // Handle empty data
      if (!data || data.length === 0) {
        page.drawText('No data available', {
          x: 60, y: yPosition, size: 12, font: helveticaFont, color: COLORS.TEXT_LIGHT
        });
        return yPosition - 70;
      }

      // Determine columns to display (first 4 or fewer)
      const keys = Object.keys(data[0]).slice(0, 4);
      
      // Column headers
      page.drawRectangle({ x: 50, y: yPosition, width: 512, height: 25, color: rgb(0.96, 0.97, 0.99) });
      keys.forEach((key, index) => {
        page.drawText(key.toUpperCase(), {
          x: 60 + index * 120, y: yPosition + 5, size: 11, font: helveticaBold, color: COLORS.TEXT_DARK
        });
      });
      yPosition -= 25;

      // Render data rows (limit to 10)
      data.slice(0, 10).forEach((item, index) => {
        // Alternate row background
        if (index % 2 === 0) {
          page.drawRectangle({ x: 50, y: yPosition, width: 512, height: 20, color: rgb(0.98, 0.98, 1), opacity: 0.5 });
        }
        
        // Render each column
        keys.forEach((key, keyIndex) => {
          page.drawText(String(item[key] ?? 'N/A'), {
            x: 60 + keyIndex * 120, y: yPosition + 5, size: 10, font: helveticaFont, color: COLORS.TEXT_DARK
          });
        });
        yPosition -= 20;
      });
      
      return yPosition - 30;
    }

    // Generate report pages
    let { page, yPosition } = createReportPage();

    // Render each model's data
    modelData.forEach(({ name, data }) => {
      // Create a new page if current page is running out of space
      if (yPosition < 100) {
        ({ page, yPosition } = createReportPage());
      }
      
      // Render section for each model
      yPosition = renderSection({ 
        page, 
        yPosition, 
        title: `${name} Overview`, 
        data 
      });
    });

    // Add page numbers
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      pdfDoc.getPages()[i].drawText(`Page ${i + 1} of ${pageCount}`, {
        x: 500, y: 50, size: 10, font: helveticaFont, color: COLORS.TEXT_LIGHT
      });
    }

    // Save and return PDF
    return await pdfDoc.save();
  } catch (error) {
    console.error('System Report Generation Error:', error);
    throw new Error('Failed to generate system report');
  } finally {
    // Ensure Prisma client disconnects
    await prisma.$disconnect();
  }
}

export async function POST(req) {
  try {
    const { userType } = await req.json();
    const pdfBytes = await generateSystemReport(userType);
    return new Response(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=system_comprehensive_report.pdf',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: error.message.includes('Access Denied') ? 403 : 500 
    });
  }
}