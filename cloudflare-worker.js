/**
 * Cloudflare Worker for Mohamed Elkadi Website
 * Database: mk_contactme (ID: cc5b3b12-7148-464a-9117-644c0b03305c)
 * Bound as: DB
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const db = env.DB || env.mk_contactme;

    // --- GET /api/recommendations ---
    if (request.method === "GET" && (url.pathname === "/api/recommendations" || url.pathname === "/recommendations")) {
      try {
        if (!db) {
          // Return default JSON fallback if DB binding not available
          return new Response(
            JSON.stringify({ error: "DB binding not configured. Using fallback." }),
            { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Ensure table exists
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            position TEXT NOT NULL,
            company TEXT NOT NULL,
            relationship TEXT,
            avatar TEXT,
            date TEXT,
            quote TEXT NOT NULL,
            verified_linkedin INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `).run();

        const { results } = await db.prepare(
          "SELECT * FROM recommendations ORDER BY id ASC"
        ).all();

        return new Response(JSON.stringify(results || []), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (err) {
        console.error("D1 Query Error:", err);
        return new Response(
          JSON.stringify({ error: "Failed to fetch recommendations: " + err.message }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // --- POST /api/contact or Root POST (Contact Form) ---
    if (request.method === "POST") {
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

        if (!db) {
          return new Response(
            JSON.stringify({ error: "Database binding 'DB' not configured in Worker environment." }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Ensure table exists
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
    }

    return new Response(JSON.stringify({ error: "Endpoint not found." }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  },
};
