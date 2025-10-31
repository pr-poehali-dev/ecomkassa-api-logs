CREATE TABLE IF NOT EXISTS integration_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    log_type VARCHAR(50) NOT NULL,
    member_id VARCHAR(255),
    deal_id VARCHAR(255),
    external_id VARCHAR(255),
    request_data TEXT,
    response_data TEXT,
    status VARCHAR(50),
    error_message TEXT
);

CREATE INDEX idx_logs_created_at ON integration_logs(created_at DESC);
CREATE INDEX idx_logs_member_id ON integration_logs(member_id);
CREATE INDEX idx_logs_external_id ON integration_logs(external_id);