-- D1 schema: strictly whitelisted pseudonymous event fields, no PII fields.
CREATE TABLE IF NOT EXISTS events (
 event_id TEXT PRIMARY KEY, session_id TEXT NOT NULL, occurred_at TEXT NOT NULL,
 event_name TEXT NOT NULL, experiment TEXT NOT NULL, variant TEXT NOT NULL,
 assignment_mode TEXT NOT NULL, action_source TEXT NOT NULL,
 product_id TEXT, card_position INTEGER, saved_count INTEGER NOT NULL,
 question_type TEXT, answer_kind TEXT, filter_category TEXT,
 CHECK (variant IN ('A','B','C')),
 CHECK (assignment_mode IN ('randomized','direct')),
 CHECK (saved_count BETWEEN 0 AND 3)
);
CREATE INDEX IF NOT EXISTS idx_events_experiment ON events(experiment, variant, event_name, occurred_at);
CREATE INDEX IF NOT EXISTS idx_events_funnel ON events(session_id, occurred_at);
