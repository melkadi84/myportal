/**
 * Cloudflare Worker for Mohamed Elkadi Contact Form
 * Database: mk_contactme (ID: cc5b3b12-7148-464a-9117-644c0b03305c)
 * Bound as: DB
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const data = await request.json();
      const { name, email, subject, message } = data;

      // Validation
      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: "Missing required fields (name, email, message)." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
      const db = env.DB || env.mk_contactme;

      if (!db) {
        return new Response(
          JSON.stringify({ error: "Database binding 'DB' not configured in Worker environment." }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Ensure table exists automatically
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT,
          message TEXT NOT NULL,
          ip TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `).run();

      // Insert record
      await db.prepare(`
        INSERT INTO contact_messages (name, email, subject, message, ip)
        VALUES (?, ?, ?, ?, ?)
      `)
        .bind(name, email, subject || "General Inquiry", message, clientIp)
        .run();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Thank you! Your message has been safely delivered and recorded in Cloudflare D1.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err) {
      console.error("D1 Insert Error:", err);
      return new Response(
        JSON.stringify({ error: "Database error: " + err.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  },
};
