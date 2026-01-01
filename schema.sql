-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- SQLite auto-increment
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    type TEXT DEFAULT 'student', -- student, admin
    is_verified INTEGER DEFAULT 0,
    verification_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY, -- Using the string ID from JSON (e.g., LESSON-176...)
    user_id INTEGER,
    student_name TEXT,
    student_email TEXT,
    student_phone TEXT,
    student_country_code TEXT,
    subject TEXT,
    custom_subject TEXT,
    duration INTEGER DEFAULT 60,
    status TEXT DEFAULT 'new', -- new, accepted, declined, completed
    price REAL,
    datetime DATETIME,
    notes TEXT,
    language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Courses Table
-- Storing flexible JSON data for multi-language support reduces schema complexity
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY, -- e.g., MTH-101
    title_en TEXT,
    data JSON NOT NULL, -- Full JSON object (en, he, ar, ru, videos)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analytics / Stats
CREATE TABLE IF NOT EXISTS daily_stats (
    date DATE PRIMARY KEY,
    visitors INTEGER DEFAULT 0,
    pageviews INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- pageview, click, signup
    data JSON,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    donor_name TEXT,
    method TEXT,
    status TEXT DEFAULT 'completed',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_lessons_user_id ON lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);
CREATE INDEX IF NOT EXISTS idx_lessons_date ON lessons(datetime);
