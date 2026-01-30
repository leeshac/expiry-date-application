CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW() 
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    image VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);