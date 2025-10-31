-- Таблица настроек интеграции для каждого аккаунта Bitrix24
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(255) NOT NULL UNIQUE,
    secret_code VARCHAR(255),
    ecom_login VARCHAR(255),
    ecom_pass VARCHAR(255),
    ecom_kassa_id INTEGER,
    token_ecom_kassa TEXT,
    payment_object VARCHAR(50),
    payment_method VARCHAR(50),
    email_def_check VARCHAR(255),
    vat_100 VARCHAR(50),
    vat_shipment VARCHAR(50),
    vat_order VARCHAR(50),
    company_email VARCHAR(255),
    company_sno VARCHAR(50),
    company_inn VARCHAR(50),
    company_payment_address VARCHAR(255),
    webhook_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица счетов и платежей
CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(255) NOT NULL REFERENCES users(member_id),
    external_id VARCHAR(255),
    secret VARCHAR(255),
    payment_id INTEGER,
    paysystem_id INTEGER,
    deal_id INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_bills_external_id ON bills(external_id);
CREATE INDEX IF NOT EXISTS idx_bills_member_id ON bills(member_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);

-- Комментарии к таблицам
COMMENT ON TABLE users IS 'Настройки интеграции EcomKassa для каждого портала Bitrix24';
COMMENT ON TABLE bills IS 'История платежей и счетов через EcomKassa';

COMMENT ON COLUMN users.member_id IS 'Уникальный идентификатор аккаунта Bitrix24';
COMMENT ON COLUMN users.secret_code IS 'Секретный код для проверки запросов';
COMMENT ON COLUMN users.ecom_kassa_id IS 'ID кассы в системе EcomKassa';
COMMENT ON COLUMN users.token_ecom_kassa IS 'Токен авторизации в API EcomKassa';
COMMENT ON COLUMN users.company_sno IS 'Система налогообложения (osn, usn_income, usn_income_outcome, etc)';
COMMENT ON COLUMN users.company_inn IS 'ИНН компании для чеков';

COMMENT ON COLUMN bills.external_id IS 'Внешний ID платежа в EcomKassa';
COMMENT ON COLUMN bills.secret IS 'Секретный код для верификации callback';
COMMENT ON COLUMN bills.payment_id IS 'ID платежа в Bitrix24';
COMMENT ON COLUMN bills.deal_id IS 'ID сделки в Bitrix24';
COMMENT ON COLUMN bills.status IS 'Статус платежа: pending, paid, failed';