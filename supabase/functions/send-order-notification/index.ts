import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", orderId).single();
    if (!order) throw new Error("Order not found");

    const { data: items } = await supabaseAdmin.from("order_items").select("*").eq("order_id", orderId);

    const isCollect = order.shipping_type === "collect";

    const itemsList = (items || []).map((item: any) =>
      `• ${item.product_name}${item.size ? ` (${item.size})` : ""} x${item.quantity} - £${(item.unit_price * item.quantity).toFixed(2)}`
    ).join("\n");

    const itemsHtml = (items || []).map((item: any) =>
      `<li>${item.product_name}${item.size ? ` (${item.size})` : ""} &times; ${item.quantity} — £${(item.unit_price * item.quantity).toFixed(2)}</li>`
    ).join("");

    const shortId = order.id.slice(0, 8).toUpperCase();

    const deliveryBlock = isCollect
      ? "Collection in person"
      : `${order.shipping_address_line1}\n${order.shipping_address_line2 ? order.shipping_address_line2 + "\n" : ""}${order.shipping_city}\n${order.shipping_postcode}\n${order.shipping_country}`;

    const adminEmailBody = `
New Order Received!

Order ID: ${shortId} (${order.id})
Date: ${new Date(order.created_at).toLocaleString("en-GB")}

Customer: ${order.customer_name}
Email: ${order.customer_email}

Delivery Method: ${isCollect ? "Collect in person" : order.shipping_type.replace("_", " ")}
${isCollect ? "" : "Delivery Address:\n" + deliveryBlock}

${order.notes ? "Customer Notes:\n" + order.notes + "\n" : ""}
Items:
${itemsList}

Subtotal: £${order.subtotal.toFixed(2)}
Shipping: £${order.shipping_cost.toFixed(2)}
Total: £${order.total.toFixed(2)}
    `.trim();

    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #c8102e;">Thank you for your order, ${order.customer_name}!</h2>
        <p>We've received your order and it's being processed.</p>

        <p><strong>Order Number:</strong> ${shortId}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString("en-GB")}</p>

        <h3>Items</h3>
        <ul>${itemsHtml}</ul>

        <p><strong>Subtotal:</strong> £${order.subtotal.toFixed(2)}<br/>
        <strong>Shipping:</strong> £${order.shipping_cost.toFixed(2)}<br/>
        <strong>Total:</strong> £${order.total.toFixed(2)}</p>

        <h3>${isCollect ? "Collection" : "Delivery"}</h3>
        <p style="white-space: pre-line;">${deliveryBlock}</p>

        ${order.notes ? `<h3>Your Notes</h3><p style="white-space: pre-line;">${order.notes}</p>` : ""}

        <p>If you have any questions, just reply to this email.</p>
        <p>— German Exiles Rugby League</p>
      </div>
    `;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not set");

    const FROM = "German Exiles Shop <noreply@germanexilesrl.co.uk>";
    const adminRecipients = ["jay@germanexilesrl.co.uk", "zak@germanexilesrl.co.uk"];

    // Admin notification
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: FROM,
        to: adminRecipients,
        subject: `New Shop Order ${shortId} - ${order.customer_name} - £${order.total.toFixed(2)}`,
        text: adminEmailBody,
      }),
    });
    if (!adminRes.ok) console.error("Admin email error:", await adminRes.text());

    // Customer confirmation
    const custRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: FROM,
        to: [order.customer_email],
        subject: `Your German Exiles order ${shortId} is confirmed`,
        html: customerEmailHtml,
      }),
    });
    if (!custRes.ok) console.error("Customer email error:", await custRes.text());

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
