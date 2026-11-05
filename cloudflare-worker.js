/**
 * Cloudflare Worker for Mohamed Elkadi Website
 * Database: mk_contactme  |  Bound as: DB
 * Tables are created once from schema.sql, not on every request.
 */

const ALLOWED_ORIGINS = ["https://melkadi.website", "https://www.melkadi.website"];
const ALLOWED_SUBJECTS = ["Recruiter inquiry", "Job opportunity", "Collaboration", "Other"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_PER_WINDOW = 5;     // messages per IP
const WINDOW_MINUTES = 10;

function corsFor(request) {
  const origin = request.headers.get("Origin");
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

export default {
  async fetch(request, env) {
    const cors = corsFor(request);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const db = env.DB || env.mk_contactme;

    // --- GET /api/recommendations ---
    if (request.method === "GET" && (url.pathname === "/api/recommendations" || url.pathname === "/recommendations")) {
      if (!db) return json({ error: "Service unavailable." }, 503, cors);
      try {
        const { results } = await db.prepare("SELECT * FROM recommendations ORDER BY id ASC").all();
        return json(results || [], 200, cors);
      } catch (err) {
        console.error("D1 Query Error:", err);
        return json({ error: "Could not load recommendations." }, 500, cors);
      }
    }

    // --- POST /api/contact or root POST (contact form) ---
    if (request.method === "POST") {
      const origin = request.headers.get("Origin");
      if (origin && !ALLOWED_ORIGINS.includes(origin)) {
        return json({ error: "Origin not allowed." }, 403, cors);
      }
      if (!db) return json({ error: "Service unavailable." }, 503, cors);

      let data;
      try {
        data = await request.json();
      } catch {
        return json({ error: "Invalid request body." }, 400, cors);
      }

      const name = String(data.name || "").trim();
      const email = String(data.email || "").trim();
      const subject = String(data.subject || "").trim() || "Other";
      const message = String(data.message || "").trim();

      if (!name || !email || !message) {
        return json({ error: "Name, email and message are required." }, 400, cors);
      }
      if (name.length > 120 || email.length > 200 || message.length > 3500 || !EMAIL_RE.test(email)) {
        return json({ error: "Check the name, email and message length." }, 400, cors);
      }
      if (!ALLOWED_SUBJECTS.includes(subject)) {
        return json({ error: "Unknown topic." }, 400, cors);
      }

      const ip = request.headers.get("CF-Connecting-IP") || "unknown";

      try {
        const { results } = await db.prepare(
          "SELECT COUNT(*) AS n FROM contact_messages WHERE ip = ? AND created_at > datetime('now', ?)"
        ).bind(ip, `-${WINDOW_MINUTES} minutes`).all();
        if ((results?.[0]?.n || 0) >= MAX_PER_WINDOW) {
          return json({ error: "Too many messages. Try again later." }, 429, cors);
        }

        await db.prepare(
          "INSERT INTO contact_messages (name, email, subject, message, ip) VALUES (?, ?, ?, ?, ?)"
        ).bind(name, email, subject, message, ip).run();

        return json({ success: true, message: "Message received." }, 200, cors);
      } catch (err) {
        console.error("D1 Insert Error:", err);
        return json({ error: "Could not save the message." }, 500, cors);
      }
    }

    return json({ error: "Endpoint not found." }, 404, cors);
  },
};
