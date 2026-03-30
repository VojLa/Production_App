INSERT INTO users (email, password_hash, full_name, is_active, is_email_verified, email_verified_at)
VALUES (
    'demo@manuflow.cz',
    '$2b$12$lxdOBXQDROnL1W7j.D/QCODgqR4LzCQvT4zG0mGacYX2lSWua70gu',
    'Demo Uživatel',
    TRUE,
    TRUE,
    NOW()
)
ON CONFLICT (email) DO NOTHING;
