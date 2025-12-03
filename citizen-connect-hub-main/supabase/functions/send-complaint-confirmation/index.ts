import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ComplaintEmailRequest {
  email: string;
  complaintId: string;
  category: string;
  description: string;
  address?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-complaint-confirmation function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, complaintId, category, description, address }: ComplaintEmailRequest = await req.json();
    
    console.log("Sending confirmation email to:", email);
    console.log("Complaint ID:", complaintId);

    if (!email || !complaintId) {
      throw new Error("Email and complaint ID are required");
    }

    const emailResponse = await resend.emails.send({
      from: "Civic Issues <onboarding@resend.dev>",
      to: [email],
      subject: `Complaint Registered - ${complaintId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a365d, #0d9488); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .tracking-box { background: white; border: 2px solid #0d9488; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .tracking-id { font-size: 24px; font-weight: bold; color: #1a365d; font-family: monospace; }
            .detail { margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Complaint Registered Successfully!</h1>
            </div>
            <div class="content">
              <p>Thank you for reporting this civic issue. Your complaint has been successfully registered in our system.</p>
              
              <div class="tracking-box">
                <p style="margin: 0 0 10px 0; color: #666;">Your Tracking ID</p>
                <div class="tracking-id">${complaintId}</div>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Save this ID to track your complaint status</p>
              </div>

              <h3>Complaint Details:</h3>
              <div class="detail">
                <span class="label">Category:</span> ${category}
              </div>
              <div class="detail">
                <span class="label">Description:</span> ${description.substring(0, 200)}${description.length > 200 ? '...' : ''}
              </div>
              ${address ? `<div class="detail"><span class="label">Location:</span> ${address}</div>` : ''}
              
              <p style="margin-top: 20px;">We will review your complaint and assign it to the relevant department. You will receive updates on the progress.</p>
              
              <div class="footer">
                <p>This is an automated message from the Civic Issue Reporting System.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-complaint-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
