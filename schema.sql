-- D1 Table Schema for "mk_contactme" database
-- Database ID: cc5b3b12-7148-464a-9117-644c0b03305c

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  ip TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
