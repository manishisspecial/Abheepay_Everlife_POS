-- Abheepay POS/Soundbox Management System Database Schema
-- Clean and error-free schema for PostgreSQL/Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'distributor', 'retailer');
CREATE TYPE machine_status AS ENUM ('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED');
CREATE TYPE assignment_status AS ENUM ('ACTIVE', 'INACTIVE', 'RETURNED', 'REASSIGNED');
CREATE TYPE settlement_type AS ENUM ('T+0', 'T+1', 'T+2', 'T+3');

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create distributors table
CREATE TABLE IF NOT EXISTS distributors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    company_name VARCHAR(255),
    gst_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create retailers table
CREATE TABLE IF NOT EXISTS retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    shop_name VARCHAR(255),
    gst_number VARCHAR(20),
    distributor_id UUID REFERENCES distributors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create machines table
CREATE TABLE IF NOT EXISTS machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    mid VARCHAR(50) UNIQUE NOT NULL,
    tid VARCHAR(50) UNIQUE NOT NULL,
    machine_type VARCHAR(50) NOT NULL CHECK (machine_type IN ('POS', 'SOUNDBOX')),
    status machine_status DEFAULT 'AVAILABLE',
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    purchase_date DATE,
    warranty_expiry DATE,
    qr_code VARCHAR(255), -- For soundbox QR codes
    has_standee BOOLEAN DEFAULT FALSE, -- For soundbox standee
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
    distributor_id UUID REFERENCES distributors(id) ON DELETE SET NULL,
    retailer_id UUID REFERENCES retailers(id) ON DELETE SET NULL,
    assigned_by UUID NOT NULL,
    assigned_by_role user_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_from DATE NOT NULL,
    valid_to DATE,
    status assignment_status DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
    mid VARCHAR(50) NOT NULL,
    tid VARCHAR(50) NOT NULL,
    settlement_date DATE NOT NULL,
    settlement_type settlement_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_machines_serial_number ON machines(serial_number);
CREATE INDEX IF NOT EXISTS idx_machines_mid_tid ON machines(mid, tid);
CREATE INDEX IF NOT EXISTS idx_machines_status ON machines(status);
CREATE INDEX IF NOT EXISTS idx_assignments_machine_id ON assignments(machine_id);
CREATE INDEX IF NOT EXISTS idx_assignments_distributor_id ON assignments(distributor_id);
CREATE INDEX IF NOT EXISTS idx_assignments_retailer_id ON assignments(retailer_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_valid_from ON assignments(valid_from);
CREATE INDEX IF NOT EXISTS idx_assignments_valid_to ON assignments(valid_to);
CREATE INDEX IF NOT EXISTS idx_retailers_distributor_id ON retailers(distributor_id);
CREATE INDEX IF NOT EXISTS idx_settlements_machine_id ON settlements(machine_id);
CREATE INDEX IF NOT EXISTS idx_settlements_date ON settlements(settlement_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_distributors_updated_at BEFORE UPDATE ON distributors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_retailers_updated_at BEFORE UPDATE ON retailers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON machines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settlements_updated_at BEFORE UPDATE ON settlements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO admins (email, password_hash, name, phone) VALUES 
('admin@abheepay.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', '+91-9876543210')
ON CONFLICT (email) DO NOTHING;

-- Insert sample distributors (password: admin123)
INSERT INTO distributors (email, password_hash, name, phone, company_name, gst_number) VALUES 
('distributor1@abheepay.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ABC Distributors', '+91-9876543211', 'ABC Trading Co.', 'GST123456789'),
('distributor2@abheepay.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'XYZ Distributors', '+91-9876543212', 'XYZ Enterprises', 'GST987654321')
ON CONFLICT (email) DO NOTHING;

-- Insert sample retailers (password: admin123)
INSERT INTO retailers (email, password_hash, name, phone, shop_name, gst_number, distributor_id) VALUES 
('retailer1@abheepay.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', '+91-9876543213', 'Doe Electronics', 'GST111111111', (SELECT id FROM distributors WHERE email = 'distributor1@abheepay.com')),
('retailer2@abheepay.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', '+91-9876543214', 'Smith Gadgets', 'GST222222222', (SELECT id FROM distributors WHERE email = 'distributor2@abheepay.com'))
ON CONFLICT (email) DO NOTHING;

-- Insert GRM Inventory - Telering-390 POS Machines
INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer) VALUES 
('TLR390001', 'MID390001', 'TID390001', 'POS', 'Telering-390', 'Telering'),
('TLR390002', 'MID390002', 'TID390002', 'POS', 'Telering-390', 'Telering'),
('TLR390003', 'MID390003', 'TID390003', 'POS', 'Telering-390', 'Telering'),
('TLR390004', 'MID390004', 'TID390004', 'POS', 'Telering-390', 'Telering'),
('TLR390005', 'MID390005', 'TID390005', 'POS', 'Telering-390', 'Telering'),
('TLR390006', 'MID390006', 'TID390006', 'POS', 'Telering-390', 'Telering'),
('TLR390007', 'MID390007', 'TID390007', 'POS', 'Telering-390', 'Telering'),
('TLR390008', 'MID390008', 'TID390008', 'POS', 'Telering-390', 'Telering'),
('TLR390009', 'MID390009', 'TID390009', 'POS', 'Telering-390', 'Telering'),
('TLR390010', 'MID390010', 'TID390010', 'POS', 'Telering-390', 'Telering')
ON CONFLICT (serial_number) DO NOTHING;

-- Insert GRM Inventory - Everlife 251 POS Machines
INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer) VALUES 
('EVL251001', 'MID251001', 'TID251001', 'POS', 'Everlife-251', 'Everlife'),
('EVL251002', 'MID251002', 'TID251002', 'POS', 'Everlife-251', 'Everlife'),
('EVL251003', 'MID251003', 'TID251003', 'POS', 'Everlife-251', 'Everlife'),
('EVL251004', 'MID251004', 'TID251004', 'POS', 'Everlife-251', 'Everlife'),
('EVL251005', 'MID251005', 'TID251005', 'POS', 'Everlife-251', 'Everlife'),
('EVL251006', 'MID251006', 'TID251006', 'POS', 'Everlife-251', 'Everlife'),
('EVL251007', 'MID251007', 'TID251007', 'POS', 'Everlife-251', 'Everlife'),
('EVL251008', 'MID251008', 'TID251008', 'POS', 'Everlife-251', 'Everlife'),
('EVL251009', 'MID251009', 'TID251009', 'POS', 'Everlife-251', 'Everlife'),
('EVL251010', 'MID251010', 'TID251010', 'POS', 'Everlife-251', 'Everlife')
ON CONFLICT (serial_number) DO NOTHING;

-- Insert GRM Inventory - Telering-1000 Soundbox with QR and Standee
INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer, qr_code, has_standee) VALUES 
('TLR1000001', 'MID1000001', 'TID1000001', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000001', TRUE),
('TLR1000002', 'MID1000002', 'TID1000002', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000002', TRUE),
('TLR1000003', 'MID1000003', 'TID1000003', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000003', TRUE),
('TLR1000004', 'MID1000004', 'TID1000004', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000004', TRUE),
('TLR1000005', 'MID1000005', 'TID1000005', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000005', TRUE),
('TLR1000006', 'MID1000006', 'TID1000006', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000006', FALSE),
('TLR1000007', 'MID1000007', 'TID1000007', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000007', FALSE),
('TLR1000008', 'MID1000008', 'TID1000008', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000008', TRUE),
('TLR1000009', 'MID1000009', 'TID1000009', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000009', FALSE),
('TLR1000010', 'MID1000010', 'TID1000010', 'SOUNDBOX', 'Telering-1000', 'Telering', 'QR_TLR1000010', TRUE)
ON CONFLICT (serial_number) DO NOTHING;

-- Insert additional legacy machines for compatibility
INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer) VALUES 
('POS001', 'MID001', 'TID001', 'POS', 'Verifone VX520', 'Verifone'),
('POS002', 'MID002', 'TID002', 'POS', 'Ingenico iSC250', 'Ingenico'),
('SOUND001', 'MID003', 'TID003', 'SOUNDBOX', 'SoundBox Pro', 'Abheepay'),
('SOUND002', 'MID004', 'TID004', 'SOUNDBOX', 'SoundBox Lite', 'Abheepay'),
('POS003', 'MID005', 'TID005', 'POS', 'Pax A920', 'Pax Technology')
ON CONFLICT (serial_number) DO NOTHING; 