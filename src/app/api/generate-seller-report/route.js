import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PrismaClient } from '@prisma/client';

export async function generateSellerSystemReport(sellerId) {
  if (!sellerId) {
    throw new Error('Access Denied: Seller ID is required');
  }

  const prisma = new PrismaClient();
  try {
    const sellerServices = await prisma.service.findMany({
      where: { sellerId: sellerId },
      include: {
        salonServices: true,
        RestaurantService: true,
        hotelServices: true,
        carServices: true,
        gymServices: true,
        hallServices: true,
        activityServices: true,
        playgroundServices: true,
        Review: true,
        ReservationItem: true
      }
    });

    const approvedServices = sellerServices.filter(service => service.isApproved);
    const rejectedServices = sellerServices.filter(service => service.isRejected);
    const pendingServices = sellerServices.filter(service => !service.isApproved && !service.isRejected);

    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const COLORS = {
      BACKGROUND: rgb(0.95, 0.96, 0.98),
      HEADER_BG: rgb(0.12, 0.46, 0.7),
      HEADER_TEXT: rgb(1, 1, 1),
      TEXT_DARK: rgb(0.2, 0.2, 0.2),
      TEXT_LIGHT: rgb(0.5, 0.5, 0.5),
      ACCENT: rgb(0.22, 0.66, 1)
    };

    function createReportPage() {
      const page = pdfDoc.addPage([612, 792]);
      const currentDate = new Date().toLocaleDateString();
      page.drawRectangle({ x: 0, y: 0, width: 612, height: 792, color: COLORS.BACKGROUND });
      page.drawRectangle({ x: 0, y: 742, width: 612, height: 50, color: COLORS.HEADER_BG });
      page.drawText('Seller Services Report', {
        x: 50, y: 760, size: 22, font: helveticaBold, color: COLORS.HEADER_TEXT
      });
      page.drawText(`Generated on: ${currentDate}`, {
        x: 460, y: 760, size: 10, font: helveticaFont, color: COLORS.HEADER_TEXT
      });

      page.drawText(`Seller ID: ${sellerId}`, {
        x: 50, y: 710, size: 12, font: helveticaFont, color: COLORS.TEXT_DARK
      });
      page.drawRectangle({ x: 50, y: 700, width: 512, height: 1, color: COLORS.TEXT_LIGHT });
      return { page, yPosition: 680 };
    }

    function renderSection({ page, yPosition, title, services }) {
      page.drawRectangle({ x: 50, y: yPosition, width: 512, height: 30, color: COLORS.ACCENT, opacity: 0.2 });
      page.drawText(title, { x: 60, y: yPosition + 10, size: 14, font: helveticaBold, color: COLORS.HEADER_BG });
      yPosition -= 50;

      if (!services || services.length === 0) {
        page.drawText('No services found', {
          x: 60, y: yPosition, size: 12, font: helveticaFont, color: COLORS.TEXT_LIGHT
        });
        return yPosition - 80;
      }

      services.slice(0, 10).forEach((service, index) => {
        const serviceDetailsText = `${service.name} (${service.type}) - Reviews: ${service.Review.length}, Reservation Items: ${service.ReservationItem.length}`;
        if (index % 2 === 0) {
          page.drawRectangle({ x: 50, y: yPosition, width: 512, height: 25, color: rgb(0.98, 0.98, 1), opacity: 0.5 });
        }
        page.drawText(serviceDetailsText, {
          x: 60, y: yPosition + 5, size: 10, font: helveticaFont, color: COLORS.TEXT_DARK
        });
        yPosition -= 30;
      });
      return yPosition - 40;
    }

    let { page, yPosition } = createReportPage();
    const sections = [
      { title: 'Approved Services', services: approvedServices },
      { title: 'Rejected Services', services: rejectedServices },
      { title: 'Pending Services', services: pendingServices }
    ];

    sections.forEach(section => {
      if (yPosition < 100) {
        ({ page, yPosition } = createReportPage());
      }
      yPosition = renderSection({ page, yPosition, title: section.title, services: section.services });
    });

    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      pdfDoc.getPages()[i].drawText(`Page ${i + 1} of ${pageCount}`, {
        x: 500, y: 50, size: 10, font: helveticaFont, color: COLORS.TEXT_LIGHT
      });
    }

    return await pdfDoc.save();
  } catch (error) {
    console.error('Seller Report Generation Error:', error);
    throw new Error('Failed to generate seller report');
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req) {
  try {
    const { sellerId } = await req.json();
    const pdfBytes = await generateSellerSystemReport(sellerId);
    return new Response(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=seller_services_report.pdf',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.message.includes('Access Denied') ? 403 : 500
    });
  }
}