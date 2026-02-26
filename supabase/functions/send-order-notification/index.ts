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

    // Fetch order
    const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", orderId).single();
    if (!order) throw new Error("Order not found");

    // Fetch order items
    const { data: items } = await supabaseAdmin.from("order_items").select("*").eq("order_id", orderId);

    const itemsList = (items || []).map((item: any) =>
      `• ${item.product_name}${item.size ? ` (${item.size})` : ""} x${item.quantity} - £${(item.unit_price * item.quantity).toFixed(2)}`
    ).join("\n");

    const emailBody = `
New Order Received!

Order ID: ${order.id}
Date: ${new Date(order.created_at).toLocaleString("en-GB")}

Customer: ${order.customer_name}
Email: ${order.customer_email}

Delivery Address:
${order.shipping_address_line1}
${order.shipping_address_line2 ? order.shipping_address_line2 + "\n" : ""}${order.shipping_city}
${order.shipping_postcode}
${order.shipping_country}

Shipping: ${order.shipping_type.replace("_", " ")} (£${order.shipping_cost.toFixed(2)})

Items:
${itemsList}

Subtotal: £${order.subtotal.toFixed(2)}
Shipping: £${order.shipping_cost.toFixed(2)}
Total: £${order.total.toFixed(2)}
    `.trim();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not set");

    const recipients = ["jay@germanexilesrl.co.uk", "zak@germanexilesrl.co.uk"];

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "German Exiles Shop <onboarding@resend.dev>",
        to: recipients,
        subject: `New Shop Order - ${order.customer_name} - £${order.total.toFixed(2)}`,
        text: emailBody,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", errText);
    }

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
