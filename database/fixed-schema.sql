-- Fixed SQL Schema for Abheepay POS Management System
-- This script creates the complete database schema with real POS data

-- ============================================================================
-- 1. CREATE ENHANCED DATABASE SCHEMA
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create service providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    company_name VARCHAR(255),
    gst_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create distributors table
CREATE TABLE IF NOT EXISTS distributors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    company_name VARCHAR(255),
    gst_number VARCHAR(50),
    contact_person VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create retailers table
CREATE TABLE IF NOT EXISTS retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    shop_name VARCHAR(255),
    gst_number VARCHAR(50),
    distributor_id UUID REFERENCES distributors(id),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create machines table with enhanced fields
CREATE TABLE IF NOT EXISTS machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    mid VARCHAR(50) UNIQUE NOT NULL,
    tid VARCHAR(50) UNIQUE NOT NULL,
    machine_type VARCHAR(20) NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    partner VARCHAR(255) DEFAULT 'In stock',
    partner_type VARCHAR(10) DEFAULT 'B2C',
    qr_code VARCHAR(50),
    has_standee BOOLEAN DEFAULT FALSE,
    service_provider_id UUID REFERENCES service_providers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES machines(id),
    distributor_id UUID REFERENCES distributors(id),
    retailer_id UUID REFERENCES retailers(id),
    assigned_by VARCHAR(255) NOT NULL,
    assigned_by_role VARCHAR(50) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery tracking table
CREATE TABLE IF NOT EXISTS delivery_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id),
    tracking_number VARCHAR(100) UNIQUE,
    delivery_status VARCHAR(50) DEFAULT 'PENDING',
    delivery_date DATE,
    delivered_by VARCHAR(255),
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table for booking management
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    distributor_id UUID REFERENCES distributors(id),
    retailer_id UUID REFERENCES retailers(id),
    service_provider_id UUID REFERENCES service_providers(id),
    order_type VARCHAR(50) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'PENDING',
    order_date DATE NOT NULL,
    delivery_address TEXT,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    notes TEXT,
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    machine_id UUID REFERENCES machines(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory stock table
CREATE TABLE IF NOT EXISTS inventory_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_provider_id UUID REFERENCES service_providers(id),
    machine_type VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    allocated_quantity INTEGER NOT NULL DEFAULT 0,
    maintenance_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_provider_id, machine_type, model, manufacturer)
);

-- ============================================================================
-- 2. CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_machines_serial_number ON machines(serial_number);
CREATE INDEX IF NOT EXISTS idx_machines_status ON machines(status);
CREATE INDEX IF NOT EXISTS idx_machines_type ON machines(machine_type);
CREATE INDEX IF NOT EXISTS idx_machines_service_provider ON machines(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_assignments_machine_id ON assignments(machine_id);
CREATE INDEX IF NOT EXISTS idx_assignments_distributor_id ON assignments(distributor_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_retailers_distributor_id ON retailers(distributor_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_assignment_id ON delivery_tracking(assignment_id);
CREATE INDEX IF NOT EXISTS idx_orders_distributor_id ON orders(distributor_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_provider_id ON orders(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_service_provider ON inventory_stock(service_provider_id);

-- ============================================================================
-- 3. INSERT SERVICE PROVIDERS
-- ============================================================================

INSERT INTO service_providers (name, email, phone, address, company_name, gst_number, status) VALUES 
('Telering Process Private Limited', 'admin@telering.com', '+91-9876543201', 'Telering Corporate Office, Mumbai, Maharashtra', 'Telering Process Private Limited', 'TELERING001', 'ACTIVE'),
('EVERLIFE PRODUCTS AND SERVICES PVT LTD', 'admin@everlife.com', '+91-9876543202', 'Everlife Corporate Office, Delhi, Delhi', 'EVERLIFE PRODUCTS AND SERVICES PVT LTD', 'EVERLIFE001', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 4. INSERT REAL POS DATA
-- ============================================================================

-- Include the real POS data from the generated file
\i database/real-pos-data.sql

-- ============================================================================
-- 5. INSERT SAMPLE RETAILERS
-- ============================================================================

INSERT INTO retailers (email, name, phone, address, shop_name, gst_number, distributor_id, status) VALUES 
('retailer1@abheepay.com', 'Instant Mudra Branch 1', '+91-9876543201', '5th Floor, Building F, PLOT NO 29 TO 32 AND 36, PUDHARI BHAVAN, SEC-30A, NEAR SANPADA TAILWAY STATION, Sanpada, Navi Mumbai, Thane, Maharashtra, 400705', 'Instant Mudra Store 1', '27AAFCI2936K1ZB', (SELECT id FROM distributors WHERE email = 'info@dmcpay.in'), 'ACTIVE'),
('retailer2@abheepay.com', 'DMCPAY Branch 1', '+91-9650001862', 'Flat No.: A 1738, Suraj Kund Badkhal Road, Nhpc Colony Faridabad Sub Post Office, Green Field Colony, Haryana, Faridabad - 121010', 'DMCPAY Store 1', '06AALCD1614P1ZF', (SELECT id FROM distributors WHERE email = 'info@dmcpay.in'), 'ACTIVE'),
('retailer3@abheepay.com', 'Paymatrix Branch 1', '+91-9876543203', 'Shop no 8 shewanta Heights Punyai Nagar Near Crown Bakery Pune Satara Road Balaji nagar Dhankwadi - Pune - 411043', 'Paymatrix Store 1', '27AAPCP0507M1Z3', (SELECT id FROM distributors WHERE email = 'paymatrixsolutions@gmail.com'), 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 6. INSERT SOUNDBOXES
-- ============================================================================

DO $$
DECLARE
    i INTEGER;
    serial_num VARCHAR(10);
    mid_num VARCHAR(15);
    tid_num VARCHAR(15);
    qr_code VARCHAR(20);
    has_standee BOOLEAN;
    telering_id UUID;
    everlife_id UUID;
BEGIN
    -- Get service provider IDs
    SELECT id INTO telering_id FROM service_providers WHERE name = 'Telering Process Private Limited';
    SELECT id INTO everlife_id FROM service_providers WHERE name = 'EVERLIFE PRODUCTS AND SERVICES PVT LTD';
    
    FOR i IN 1..1000 LOOP
        serial_num := 'SB' || LPAD(i::TEXT, 6, '0');
        mid_num := 'MIDSB' || LPAD(i::TEXT, 6, '0');
        tid_num := 'TIDSB' || LPAD(i::TEXT, 6, '0');
        qr_code := 'QR_SB' || LPAD(i::TEXT, 6, '0');
        has_standee := (RANDOM() > 0.5);
        
        -- Distribute soundboxes between Telering and Everlife
        IF i <= 500 THEN
            INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer, status, qr_code, has_standee, service_provider_id)
            VALUES (serial_num, mid_num, tid_num, 'SOUNDBOX', 'SoundBox-1000', 'Abheepay', 'AVAILABLE', qr_code, has_standee, telering_id)
            ON CONFLICT (serial_number) DO NOTHING;
        ELSE
            INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer, status, qr_code, has_standee, service_provider_id)
            VALUES (serial_num, mid_num, tid_num, 'SOUNDBOX', 'SoundBox-1000', 'Abheepay', 'AVAILABLE', qr_code, has_standee, everlife_id)
            ON CONFLICT (serial_number) DO NOTHING;
        END IF;
    END LOOP;
END $$;

-- ============================================================================
-- 7. UPDATE INVENTORY STOCK
-- ============================================================================

INSERT INTO inventory_stock (service_provider_id, machine_type, model, manufacturer, total_quantity, available_quantity, allocated_quantity, maintenance_quantity) VALUES 
((SELECT id FROM service_providers WHERE name = 'Telering Process Private Limited'), 'POS', 'POS-Telering', 'Telering', 390, 390, 0, 0),
((SELECT id FROM service_providers WHERE name = 'EVERLIFE PRODUCTS AND SERVICES PVT LTD'), 'POS', 'POS-Everlife', 'Everlife', 251, 251, 0, 0),
((SELECT id FROM service_providers WHERE name = 'Telering Process Private Limited'), 'SOUNDBOX', 'SoundBox-1000', 'Abheepay', 500, 500, 0, 0),
((SELECT id FROM service_providers WHERE name = 'EVERLIFE PRODUCTS AND SERVICES PVT LTD'), 'SOUNDBOX', 'SoundBox-1000', 'Abheepay', 500, 500, 0, 0)
ON CONFLICT (service_provider_id, machine_type, model, manufacturer) DO NOTHING;

-- ============================================================================
-- 8. VERIFY DATA
-- ============================================================================

SELECT '=== FIXED SCHEMA DEPLOYED ===' as status;
SELECT COUNT(*) as total_machines FROM machines;
SELECT COUNT(*) as total_distributors FROM distributors;
SELECT COUNT(*) as total_retailers FROM retailers;
SELECT COUNT(*) as total_service_providers FROM service_providers;
SELECT COUNT(*) as total_orders FROM orders;
SELECT COUNT(*) as total_assignments FROM assignments; 