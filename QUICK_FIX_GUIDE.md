# 🚨 QUICK FIX: SQL Error Resolution Guide

## The Problem
You're getting "error while applying sql query" because:
1. Tables don't exist in your Supabase database
2. UUID extension is missing
3. Permissions issues

## 🔧 IMMEDIATE SOLUTION

### Step 1: Create Tables in Supabase Dashboard

1. Go to your **Supabase Dashboard**
2. Click on **SQL Editor** (left sidebar)
3. Run these commands **ONE BY ONE**:

```sql
-- First, enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

```sql
-- Create service_providers table
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
```

```sql
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
```

```sql
-- Create machines table
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
```

```sql
-- Create other required tables
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
```

### Step 2: Insert Service Providers

```sql
-- Insert service providers
INSERT INTO service_providers (name, email, phone, address, company_name, gst_number, status) VALUES 
('Telering Process Private Limited', 'admin@telering.com', '+91-9876543201', 'Telering Corporate Office, Mumbai, Maharashtra', 'Telering Process Private Limited', 'TELERING001', 'ACTIVE'),
('EVERLIFE PRODUCTS AND SERVICES PVT LTD', 'admin@everlife.com', '+91-9876543202', 'Everlife Corporate Office, Delhi, Delhi', 'EVERLIFE PRODUCTS AND SERVICES PVT LTD', 'EVERLIFE001', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;
```

### Step 3: Insert Real POS Data

Now run this command in your terminal:

```bash
node scripts/setup-database-manual.js
```

This will insert all 641 machines from your `pos.txt` file.

### Step 4: Verify Setup

Run these queries in Supabase SQL Editor:

```sql
-- Check if data is inserted
SELECT COUNT(*) as total_machines FROM machines;
SELECT COUNT(*) as total_distributors FROM distributors;
SELECT COUNT(*) as total_service_providers FROM service_providers;
```

## 🎯 Expected Results

After following these steps, you should see:
- **Service Providers**: 2 (Telering & Everlife)
- **Distributors**: 50+ (all vendors from pos.txt)
- **Machines**: 641 (all POS machines from pos.txt)

## 🚀 Start the Application

Once the database is set up:

```bash
npm run dev
```

Then login and test the flow:
1. Select Service Provider
2. View GRM Inventory (641 machines)
3. Book Orders
4. Track Delivery Status
5. View Dashboard

## 🆘 If You Still Get Errors

1. **Check Supabase Logs**: Go to Dashboard → Logs
2. **Verify .env file**: Make sure SUPABASE_URL and SUPABASE_ANON_KEY are correct
3. **Check RLS Policies**: If needed, disable RLS temporarily for testing

## 📞 Quick Test

After setup, you can test the API directly:

```bash
curl http://localhost:5000/api/service-providers
```

This should return your 2 service providers.

---

**The key issue was that the tables didn't exist in your Supabase database. Following these steps will create the tables and populate them with your real POS data (641 machines, 50 vendors).** 