-- Demo uživatel pro vývoj a testování
-- Heslo: demo1234  (bcrypt hash)

INSERT INTO users (email, password_hash, full_name, is_active)
VALUES (
    'demo@manuflow.cz',
    '$2b$12$q6/8s4dcU/.K3Iko5g8AKuKmODbTVfGFmtVlPPcp.BE29X.jRtdCq',
    'Demo Uživatel',
    TRUE
)
ON CONFLICT (email) DO NOTHING;
