import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";
import QRCode from "npm:qrcode@1.5.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TICKET_LABELS: Record<string, string> = {
  adult: "Adult",
  concession: "Concession",
  child: "Child",
  family: "Family (2 adults + 2 children)",
};

// German Exiles brand colors
const RED = rgb(0.784, 0.063, 0.18); // #C8102E
const GOLD = rgb(0.831, 0.686, 0.216); // #D4AF37
const DARK = rgb(0.067, 0.067, 0.067);
const GREY = rgb(0.4, 0.4, 0.4);
const LIGHT = rgb(0.95, 0.95, 0.95);

// Expand order items into individual tickets (Family = 1 ticket admitting 4)
function expandTickets(items: Array<{ ticket_type: string; quantity: number }>) {
  const tickets: Array<{ ticket_type: string }> = [];
  for (const it of items) {
    for (let i = 0; i < it.quantity; i++) {
      tickets.push({ ticket_type: it.ticket_type });
    }
  }
  return tickets;
}

async function buildTicketsPdf(opts: {
  orderShortId: string;
  customerName: string;
  matchLabel: string;
  competitionLabel: string;
  dateLabel: string;
  timeLabel: string;
  venueLabel: string;
  tickets: Array<{ id: string; ticket_type: string }>;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Embed brand logo (best-effort; ticket still renders if fetch fails)
  let logoImg: any = null;
  try {
    const logoRes = await fetch(
      "https://german-exiles-rugby-hub.lovable.app/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
    );
    if (logoRes.ok) {
      const logoBytes = new Uint8Array(await logoRes.arrayBuffer());
      logoImg = await pdfDoc.embedPng(logoBytes);
    }
  } catch (e) {
    console.warn("Logo fetch failed", e);
  }

  let pageNum = 0;
  for (const ticket of opts.tickets) {
    pageNum++;
    const page = pdfDoc.addPage([595, 420]); // landscape ticket size
    const { width, height } = page.getSize();

    // Top brand band
    page.drawRectangle({ x: 0, y: height - 70, width, height: 70, color: RED });

    let textX = 30;
    if (logoImg) {
      const logoH = 50;
      const logoW = (logoImg.width / logoImg.height) * logoH;
      page.drawImage(logoImg, { x: 20, y: height - 60, width: logoW, height: logoH });
      textX = 20 + logoW + 14;
    }
    page.drawText("GERMAN EXILES RUGBY LEAGUE", {
      x: textX, y: height - 42, size: 18, font: helvBold, color: rgb(1, 1, 1),
    });
    page.drawText("MATCH TICKET", {
      x: textX, y: height - 60, size: 11, font: helv, color: GOLD,
    });

    // Ticket type badge (top right)
    const typeLabel = (TICKET_LABELS[ticket.ticket_type] || ticket.ticket_type).toUpperCase();
    const typeWidth = helvBold.widthOfTextAtSize(typeLabel, 11) + 20;
    page.drawRectangle({
      x: width - typeWidth - 30, y: height - 50, width: typeWidth, height: 22, color: GOLD,
    });
    page.drawText(typeLabel, {
      x: width - typeWidth - 20, y: height - 43, size: 11, font: helvBold, color: DARK,
    });

    // Match details (left column)
    let y = height - 110;
    page.drawText(opts.matchLabel, { x: 30, y, size: 22, font: helvBold, color: DARK });
    y -= 28;
    if (opts.competitionLabel) {
      page.drawText(opts.competitionLabel, { x: 30, y, size: 11, font: helv, color: GREY });
      y -= 22;
    }
    page.drawText("DATE", { x: 30, y, size: 8, font: helvBold, color: GREY });
    page.drawText(opts.dateLabel, { x: 30, y: y - 14, size: 12, font: helv, color: DARK });
    y -= 38;
    if (opts.timeLabel) {
      page.drawText("KICK-OFF", { x: 30, y, size: 8, font: helvBold, color: GREY });
      page.drawText(opts.timeLabel, { x: 30, y: y - 14, size: 12, font: helv, color: DARK });
      y -= 38;
    }
    if (opts.venueLabel) {
      page.drawText("VENUE", { x: 30, y, size: 8, font: helvBold, color: GREY });
      page.drawText(opts.venueLabel, { x: 30, y: y - 14, size: 12, font: helv, color: DARK });
      y -= 38;
    }
    page.drawText("HOLDER", { x: 30, y, size: 8, font: helvBold, color: GREY });
    page.drawText(opts.customerName, { x: 30, y: y - 14, size: 12, font: helv, color: DARK });

    // QR section (right)
    const qrPng = await QRCode.toBuffer(ticket.id, { width: 220, margin: 1, errorCorrectionLevel: "M" });
    const qrImg = await pdfDoc.embedPng(qrPng);
    const qrSize = 160;
    const qrX = width - qrSize - 40;
    const qrY = 80;
    page.drawRectangle({ x: qrX - 10, y: qrY - 10, width: qrSize + 20, height: qrSize + 20, color: LIGHT });
    page.drawImage(qrImg, { x: qrX, y: qrY, width: qrSize, height: qrSize });
    page.drawText("Scan at gate", {
      x: qrX + 30, y: qrY - 22, size: 9, font: helv, color: GREY,
    });

    // Footer with refs
    page.drawLine({ start: { x: 30, y: 50 }, end: { x: width - 30, y: 50 }, thickness: 0.5, color: GREY });
    page.drawText(`Booking ref: ${opts.orderShortId}`, { x: 30, y: 32, size: 9, font: helv, color: GREY });
    page.drawText(`Ticket: ${ticket.id.slice(0, 8).toUpperCase()}`, { x: 30, y: 18, size: 9, font: helv, color: GREY });
    page.drawText(`Ticket ${pageNum} of ${opts.tickets.length}`, {
      x: width - 130, y: 18, size: 9, font: helv, color: GREY,
    });
  }

  return await pdfDoc.save();
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { orderId } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: order } = await supabaseAdmin.from("ticket_orders").select("*").eq("id", orderId).single();
    if (!order) throw new Error("Order not found");

    // SECURITY: Only ever send for confirmed paid orders
    if (order.status !== "paid") {
      console.warn(`Refusing to send tickets for order ${orderId} - status is ${order.status}`);
      return new Response(JSON.stringify({ skipped: true, reason: "order_not_paid" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: items } = await supabaseAdmin
      .from("ticket_order_items").select("*").eq("order_id", orderId);

    const { data: fixture } = await supabaseAdmin
      .from("fixtures").select("opponent, team, date, time, location, competition")
      .eq("id", order.fixture_id).single();

    // Generate individual ticket rows (idempotent — only if not already created)
    const { data: existingTickets } = await supabaseAdmin
      .from("tickets").select("id, ticket_type").eq("order_id", orderId);

    let tickets = existingTickets || [];
    if (tickets.length === 0) {
      const expanded = expandTickets((items || []).map((i: any) => ({
        ticket_type: i.ticket_type, quantity: i.quantity,
      })));
      const rows = expanded.map((t) => ({
        order_id: orderId,
        fixture_id: order.fixture_id,
        ticket_type: t.ticket_type,
        holder_name: order.customer_name,
      }));
      const { data: inserted, error: insErr } = await supabaseAdmin
        .from("tickets").insert(rows).select("id, ticket_type");
      if (insErr) throw insErr;
      tickets = inserted || [];
    }

    const matchLabel = fixture ? `${fixture.team} vs ${fixture.opponent}` : "Match";
    const dateLabel = fixture ? new Date(fixture.date).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }) : "";
    const timeLabel = fixture?.time || "";
    const venueLabel = fixture?.location || "";
    const competitionLabel = fixture?.competition || "";

    const shortId = order.id.slice(0, 8).toUpperCase();
    const totalTickets = tickets.length;

    const itemsHtml = (items || []).map((i: any) =>
      `<li>${TICKET_LABELS[i.ticket_type] || i.ticket_type} &times; ${i.quantity} — £${(i.unit_price * i.quantity).toFixed(2)}</li>`
    ).join("");
    const itemsList = (items || []).map((i: any) =>
      `• ${TICKET_LABELS[i.ticket_type] || i.ticket_type} x${i.quantity} - £${(i.unit_price * i.quantity).toFixed(2)}`
    ).join("\n");

    // Build the branded PDF with one ticket per page
    const pdfBytes = await buildTicketsPdf({
      orderShortId: shortId,
      customerName: order.customer_name,
      matchLabel,
      competitionLabel,
      dateLabel,
      timeLabel,
      venueLabel,
      tickets,
    });
    const pdfBase64 = uint8ToBase64(pdfBytes);
    const pdfFilename = `tickets-${shortId}.pdf`;

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #c8102e;">Your tickets are confirmed, ${order.customer_name}!</h2>
        <p>Thanks for booking. Your tickets are attached to this email as a PDF — each page is one ticket with a unique QR code that will be scanned at the gate.</p>

        <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0;">
          <p style="margin:0;font-size:18px;"><strong>${matchLabel}</strong></p>
          ${competitionLabel ? `<p style="margin:4px 0;color:#666;">${competitionLabel}</p>` : ""}
          <p style="margin:4px 0;">${dateLabel}${timeLabel ? " · " + timeLabel : ""}</p>
          ${venueLabel ? `<p style="margin:4px 0;">${venueLabel}</p>` : ""}
        </div>

        <p><strong>Booking reference:</strong> ${shortId}</p>
        <p><strong>Total tickets:</strong> ${totalTickets}</p>

        <h3>Order summary</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>Total paid:</strong> £${order.total.toFixed(2)}</p>

        <p style="margin-top:24px;padding:12px;background:#fff8e1;border-left:4px solid #d4af37;">
          <strong>At the gate:</strong> Show the PDF on your phone or print it. Each QR code can only be used once.
        </p>

        <p>If you have any questions, just reply to this email.</p>
        <p>— German Exiles Rugby League</p>
      </div>
    `;

    const adminEmailBody = `
New Ticket Order!

Reference: ${shortId}
Match: ${matchLabel}${competitionLabel ? ` (${competitionLabel})` : ""}
Date: ${dateLabel}${timeLabel ? " · " + timeLabel : ""}
Venue: ${venueLabel}

Customer: ${order.customer_name}
Email: ${order.customer_email}

Tickets:
${itemsList}

Total tickets: ${totalTickets}
Total paid: £${order.total.toFixed(2)}
${order.notes ? "\nCustomer notes:\n" + order.notes : ""}
    `.trim();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not set");

    const FROM = "German Exiles Tickets <noreply@germanexilesrl.co.uk>";
    const adminRecipients = ["jay@germanexilesrl.co.uk", "zak@germanexilesrl.co.uk"];

    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: FROM,
        to: adminRecipients,
        subject: `New Ticket Order ${shortId} - ${matchLabel} - ${totalTickets} ticket(s)`,
        text: adminEmailBody,
      }),
    });
    if (!adminRes.ok) console.error("Admin email error:", await adminRes.text());

    const custRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: FROM,
        to: [order.customer_email],
        subject: `Your tickets for ${matchLabel} - ${shortId}`,
        html: customerHtml,
        attachments: [{ filename: pdfFilename, content: pdfBase64 }],
      }),
    });
    if (!custRes.ok) console.error("Customer email error:", await custRes.text());

    // Mark email as sent so we don't resend on retries
    await supabaseAdmin.from("ticket_orders")
      .update({ status: "fulfilled" })
      .eq("id", orderId)
      .eq("status", "paid");

    return new Response(JSON.stringify({ success: true, ticketCount: totalTickets }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-ticket-confirmation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
