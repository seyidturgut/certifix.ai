CREATE DATABASE IF NOT EXISTS certifix;
USE certifix;

CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(191),
    recipient_name VARCHAR(255) NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    status ENUM('valid', 'revoked') DEFAULT 'valid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(191) PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'USER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial users
INSERT IGNORE INTO users (id, email, password, role, full_name) VALUES 
('admin_1', 'admin@certifix.ai', 'password123', 'SUPER_ADMIN', 'System Admin'),
('demo_1', 'customer@demo.com', 'password123', 'USER', 'Demo Customer'),
('seyit_1', 'seyitturgut@gmail.com', '1q2w3e', 'SUPER_ADMIN', 'Seyit Turgut');

CREATE TABLE IF NOT EXISTS designs (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191),
    name VARCHAR(255),
    design_json LONGTEXT,
    is_template BOOLEAN DEFAULT FALSE,
    orientation ENUM('landscape', 'portrait') DEFAULT 'landscape',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assets (
    id VARCHAR(191) PRIMARY KEY,
    type ENUM('template', 'element', 'image') NOT NULL,
    name VARCHAR(255) NOT NULL,
    content LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
