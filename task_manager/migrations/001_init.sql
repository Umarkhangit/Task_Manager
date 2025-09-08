CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid

-- Priorities
CREATE TABLE IF NOT EXISTS priorities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE  -- e.g., low, medium, high
);

INSERT INTO priorities (name) VALUES
('low'), ('medium'), ('high')
ON CONFLICT (name) DO NOTHING;

-- Statuses
CREATE TABLE IF NOT EXISTS statuses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE  -- e.g., todo, in-progress, over-due, done, closed
);

INSERT INTO statuses (name) VALUES
('todo'), ('in-progress'), ('over-due'), ('done'), ('closed')
ON CONFLICT (name) DO NOTHING;

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    priority_id INT REFERENCES priorities(id) ON DELETE RESTRICT,
    status_id INT REFERENCES statuses(id) ON DELETE RESTRICT,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    user_id text REFERENCES "user"(id) ON DELETE CASCADE
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id text REFERENCES "user"(id) ON DELETE CASCADE
);

-- Migration tracker
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    applied_at TIMESTAMP DEFAULT now()
);
